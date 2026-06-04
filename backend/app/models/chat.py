"""Chat — mijoz bilan operator (yoki bot) o'rtasidagi xabarlar"""
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON
from sqlalchemy.sql import func
from app.core.database import Base


class ChatSession(Base):
    """Chat sessiyasi"""
    __tablename__ = "chat_sessions"
    id = Column(Integer, primary_key=True)
    session_id = Column(String(64), unique=True, index=True)
    name = Column(String(200))
    phone = Column(String(50))
    email = Column(String(200))
    telegram_chat_id = Column(String(50), nullable=True, index=True)  # agar bot orqali ulansa
    is_active = Column(Boolean, default=True)
    unread_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_message_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)


class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True)
    session_id = Column(String(64), index=True)
    sender = Column(String(20))  # 'user', 'operator', 'bot'
    text = Column(Text)
    attachments = Column(JSON, default=list)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
