"""Admin uchun umumiy ma'lumotlar"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc

from app.core.database import get_db
from app.models.application import Application
from app.models.product import Product, Category
from app.models.chat import ChatSession
from app.services.auth import require_admin

router = APIRouter(dependencies=[Depends(require_admin)])


@router.get("/overview")
async def overview(session: AsyncSession = Depends(get_db)):
    products_count = await session.scalar(select(func.count(Product.id)))
    categories_count = await session.scalar(select(func.count(Category.id)))
    apps_new = await session.scalar(select(func.count(Application.id)).where(Application.status == "new"))
    chats_unread = await session.scalar(
        select(func.count(ChatSession.session_id)).where(ChatSession.unread_count > 0)
    )

    recent_apps_res = await session.execute(
        select(Application).order_by(desc(Application.created_at)).limit(5)
    )
    recent_apps = [
        {
            "id": a.id, "name": a.name, "phone": a.phone,
            "product_interest": a.product_interest, "status": a.status,
            "created_at": a.created_at.isoformat() if a.created_at else None,
        }
        for a in recent_apps_res.scalars().all()
    ]

    return {
        "products_count": products_count or 0,
        "categories_count": categories_count or 0,
        "applications_new": apps_new or 0,
        "chats_unread": chats_unread or 0,
        "recent_applications": recent_apps,
    }
