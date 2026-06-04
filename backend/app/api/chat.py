"""Chat — mijoz bilan operator (yoki Telegram bot) o'rtasidagi suhbat"""
import json
import asyncio
from datetime import datetime, timezone
from typing import Dict, Set
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func, update

from app.core.database import get_db, AsyncSessionLocal
from app.models.chat import ChatSession, ChatMessage
from app.schemas import ChatMessageCreate, ChatMessageOut, ChatSessionOut
from app.services.auth import require_admin, get_current_user
from app.bot.bot import send_chat_message_to_telegram

router = APIRouter()


# ─────────── WebSocket Manager ───────────
class ConnectionManager:
    def __init__(self):
        # session_id -> set of websockets (mijoz)
        self.user_connections: Dict[str, Set[WebSocket]] = {}
        # operatorlar — barchasi bir to'plamda
        self.operator_connections: Set[WebSocket] = set()

    async def connect_user(self, session_id: str, ws: WebSocket):
        await ws.accept()
        self.user_connections.setdefault(session_id, set()).add(ws)

    async def connect_operator(self, ws: WebSocket):
        await ws.accept()
        self.operator_connections.add(ws)

    def disconnect_user(self, session_id: str, ws: WebSocket):
        if session_id in self.user_connections:
            self.user_connections[session_id].discard(ws)
            if not self.user_connections[session_id]:
                del self.user_connections[session_id]

    def disconnect_operator(self, ws: WebSocket):
        self.operator_connections.discard(ws)

    async def send_to_user(self, session_id: str, message: dict):
        if session_id in self.user_connections:
            dead = []
            for ws in self.user_connections[session_id]:
                try:
                    await ws.send_json(message)
                except Exception:
                    dead.append(ws)
            for ws in dead:
                self.user_connections[session_id].discard(ws)

    async def broadcast_to_operators(self, message: dict):
        dead = []
        for ws in self.operator_connections:
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.operator_connections.discard(ws)


manager = ConnectionManager()


# ─────────── API endpoints ───────────
@router.post("/messages", response_model=ChatMessageOut)
async def send_message(data: ChatMessageCreate, session: AsyncSession = Depends(get_db)):
    """Mijoz xabar yuboradi"""
    # Sessiya yaratish/yangilash
    res = await session.execute(select(ChatSession).where(ChatSession.session_id == data.session_id))
    chat_sess = res.scalar_one_or_none()
    if not chat_sess:
        chat_sess = ChatSession(
            session_id=data.session_id,
            name=data.name,
            phone=data.phone,
        )
        session.add(chat_sess)
    else:
        if data.name and not chat_sess.name:
            chat_sess.name = data.name
        if data.phone and not chat_sess.phone:
            chat_sess.phone = data.phone
        chat_sess.last_message_at = datetime.now(timezone.utc)
        if data.sender == "user":
            chat_sess.unread_count = (chat_sess.unread_count or 0) + 1

    msg = ChatMessage(
        session_id=data.session_id,
        sender=data.sender,
        text=data.text,
    )
    session.add(msg)
    await session.commit()
    await session.refresh(msg)

    # WebSocket orqali yuborish
    payload = {
        "type": "message",
        "id": msg.id,
        "session_id": msg.session_id,
        "sender": msg.sender,
        "text": msg.text,
        "created_at": msg.created_at.isoformat() if msg.created_at else None,
        "name": chat_sess.name,
        "phone": chat_sess.phone,
    }
    if data.sender == "user":
        await manager.broadcast_to_operators(payload)
        # Telegramga ham yuborish
        try:
            await send_chat_message_to_telegram(chat_sess, msg)
        except Exception:
            pass
    else:
        await manager.send_to_user(data.session_id, payload)

    return msg


@router.get("/messages/{session_id}", response_model=list[ChatMessageOut])
async def get_messages(session_id: str, session: AsyncSession = Depends(get_db)):
    """Sessiya xabarlarini olish"""
    res = await session.execute(
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at)
        .limit(200)
    )
    return res.scalars().all()


@router.get("/sessions", response_model=list[ChatSessionOut], dependencies=[Depends(require_admin)])
async def list_sessions(session: AsyncSession = Depends(get_db)):
    """Adminka uchun barcha chat sessiyalari"""
    res = await session.execute(
        select(ChatSession).order_by(desc(ChatSession.last_message_at)).limit(100)
    )
    return res.scalars().all()


@router.post("/sessions/{session_id}/read", dependencies=[Depends(require_admin)])
async def mark_read(session_id: str, session: AsyncSession = Depends(get_db)):
    await session.execute(
        update(ChatSession).where(ChatSession.session_id == session_id).values(unread_count=0)
    )
    await session.execute(
        update(ChatMessage).where(ChatMessage.session_id == session_id, ChatMessage.sender == "user").values(is_read=True)
    )
    await session.commit()
    return {"ok": True}


# ─────────── WebSocket — mijoz uchun ───────────
@router.websocket("/ws/user/{session_id}")
async def websocket_user(websocket: WebSocket, session_id: str):
    await manager.connect_user(session_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            text = data.get("text", "").strip()
            if not text:
                continue
            # DB'ga saqlash va operatorlarga yuborish
            async with AsyncSessionLocal() as db:
                res = await db.execute(select(ChatSession).where(ChatSession.session_id == session_id))
                chat_sess = res.scalar_one_or_none()
                if not chat_sess:
                    chat_sess = ChatSession(
                        session_id=session_id,
                        name=data.get("name"),
                        phone=data.get("phone"),
                    )
                    db.add(chat_sess)
                else:
                    chat_sess.last_message_at = datetime.now(timezone.utc)
                    chat_sess.unread_count = (chat_sess.unread_count or 0) + 1

                msg = ChatMessage(session_id=session_id, sender="user", text=text)
                db.add(msg)
                await db.commit()
                await db.refresh(msg)

                payload = {
                    "type": "message", "id": msg.id, "session_id": session_id,
                    "sender": "user", "text": text,
                    "created_at": msg.created_at.isoformat(),
                    "name": chat_sess.name, "phone": chat_sess.phone,
                }
                await manager.broadcast_to_operators(payload)
                try:
                    await send_chat_message_to_telegram(chat_sess, msg)
                except Exception:
                    pass
    except WebSocketDisconnect:
        manager.disconnect_user(session_id, websocket)
    except Exception:
        manager.disconnect_user(session_id, websocket)


# ─────────── WebSocket — operator uchun ───────────
@router.websocket("/ws/operator")
async def websocket_operator(websocket: WebSocket, token: str = None):
    # Token tekshiruvini soddalashtirib qoldirdik — production'da JWT'ni tekshirish kerak
    await manager.connect_operator(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            session_id = data.get("session_id")
            text = data.get("text", "").strip()
            if not session_id or not text:
                continue
            async with AsyncSessionLocal() as db:
                msg = ChatMessage(session_id=session_id, sender="operator", text=text)
                db.add(msg)
                await db.execute(
                    update(ChatSession).where(ChatSession.session_id == session_id).values(
                        last_message_at=datetime.now(timezone.utc)
                    )
                )
                await db.commit()
                await db.refresh(msg)

                payload = {
                    "type": "message", "id": msg.id, "session_id": session_id,
                    "sender": "operator", "text": text,
                    "created_at": msg.created_at.isoformat(),
                }
                await manager.send_to_user(session_id, payload)
                # Boshqa operatorlarga ham
                await manager.broadcast_to_operators(payload)
    except WebSocketDisconnect:
        manager.disconnect_operator(websocket)
    except Exception:
        manager.disconnect_operator(websocket)
