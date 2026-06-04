"""Analitika — sahifa ko'rishlari va statistika"""
import hashlib
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, delete

from app.core.database import get_db
from app.models.analytics import PageView, ActiveSession
from app.models.application import Application
from app.models.product import Product
from app.schemas import TrackView, Heartbeat
from app.services.auth import require_admin

router = APIRouter()


def hash_ip(ip: str) -> str:
    return hashlib.sha256(ip.encode()).hexdigest()[:16] if ip else ""


@router.post("/track")
async def track_pageview(
    data: TrackView,
    request: Request,
    session: AsyncSession = Depends(get_db),
):
    """Frontend har sahifa o'tganda chaqiradi"""
    ip = request.client.host if request.client else ""
    pv = PageView(
        session_id=data.session_id,
        path=data.path,
        referrer=data.referrer,
        user_agent=data.user_agent or request.headers.get("user-agent", ""),
        ip_hash=hash_ip(ip),
        device=data.device,
        duration_sec=data.duration_sec,
        utm=data.utm,
    )
    session.add(pv)
    await session.commit()
    return {"ok": True}


@router.post("/heartbeat")
async def heartbeat(data: Heartbeat, session: AsyncSession = Depends(get_db)):
    """Har 15 soniyada chaqiriladi — kim qaysi sahifada ekanini bilish uchun"""
    res = await session.execute(select(ActiveSession).where(ActiveSession.session_id == data.session_id))
    sess = res.scalar_one_or_none()
    if sess:
        sess.path = data.path
        sess.last_seen = datetime.now(timezone.utc)
        if data.device:
            sess.device = data.device
    else:
        session.add(ActiveSession(
            session_id=data.session_id,
            path=data.path,
            device=data.device,
        ))
    await session.commit()
    return {"ok": True}


@router.get("/stats", dependencies=[Depends(require_admin)])
async def get_stats(session: AsyncSession = Depends(get_db)):
    """Adminka uchun umumiy statistika"""
    now = datetime.now(timezone.utc)
    day_ago = now - timedelta(days=1)
    week_ago = now - timedelta(days=7)
    five_min_ago = now - timedelta(minutes=5)

    # Eski sessiyalarni tozalash
    await session.execute(delete(ActiveSession).where(ActiveSession.last_seen < (now - timedelta(minutes=10))))
    await session.commit()

    total_views = await session.scalar(select(func.count(PageView.id)))
    unique_sessions = await session.scalar(select(func.count(func.distinct(PageView.session_id))))
    views_today = await session.scalar(select(func.count(PageView.id)).where(PageView.created_at >= day_ago))
    apps_total = await session.scalar(select(func.count(Application.id)))
    apps_today = await session.scalar(select(func.count(Application.id)).where(Application.created_at >= day_ago))

    active_now = await session.scalar(select(func.count(ActiveSession.session_id)).where(ActiveSession.last_seen >= five_min_ago))

    # Top sahifalar (7 kun)
    top_pages_res = await session.execute(
        select(PageView.path, func.count(PageView.id).label("count"))
        .where(PageView.created_at >= week_ago)
        .group_by(PageView.path)
        .order_by(desc("count"))
        .limit(10)
    )
    top_pages = [{"path": p, "views": c} for p, c in top_pages_res.all()]

    # Kunlik ko'rishlar (so'nggi 14 kun)
    views_by_day_res = await session.execute(
        select(
            func.date(PageView.created_at).label("day"),
            func.count(PageView.id).label("count"),
        )
        .where(PageView.created_at >= (now - timedelta(days=14)))
        .group_by("day")
        .order_by("day")
    )
    views_by_day = [{"day": str(d), "views": c} for d, c in views_by_day_res.all()]

    # Eng ko'p ko'rilgan mahsulotlar
    top_products_res = await session.execute(
        select(Product.name_uz, Product.slug, Product.views)
        .order_by(desc(Product.views))
        .limit(5)
    )
    top_products = [{"name": n, "slug": s, "views": v} for n, s, v in top_products_res.all()]

    # Qurilmalar
    devices_res = await session.execute(
        select(PageView.device, func.count(PageView.id))
        .where(PageView.created_at >= week_ago)
        .group_by(PageView.device)
    )
    devices = [{"device": d or "unknown", "count": c} for d, c in devices_res.all()]

    return {
        "total_views": total_views or 0,
        "unique_sessions": unique_sessions or 0,
        "views_today": views_today or 0,
        "applications_total": apps_total or 0,
        "applications_today": apps_today or 0,
        "active_now": active_now or 0,
        "top_pages": top_pages,
        "views_by_day": views_by_day,
        "top_products": top_products,
        "devices": devices,
    }


@router.get("/active", dependencies=[Depends(require_admin)])
async def active_users(session: AsyncSession = Depends(get_db)):
    """Hozir kim qaysi sahifada ekanini ko'rsatadi"""
    now = datetime.now(timezone.utc)
    five_min = now - timedelta(minutes=5)
    res = await session.execute(
        select(ActiveSession).where(ActiveSession.last_seen >= five_min).order_by(desc(ActiveSession.last_seen))
    )
    sessions = res.scalars().all()
    return [
        {
            "session_id": s.session_id[:8],
            "path": s.path,
            "device": s.device,
            "last_seen": s.last_seen.isoformat() if s.last_seen else None,
        }
        for s in sessions
    ]
