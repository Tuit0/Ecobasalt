"""Mijoz arizalari endpointlari"""
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc

from app.core.database import get_db
from app.models.application import Application
from app.schemas import ApplicationCreate, ApplicationOut, ApplicationUpdate
from app.services.auth import require_admin
from app.bot.bot import send_application_to_telegram

router = APIRouter()


@router.post("", response_model=ApplicationOut)
async def create_application(
    data: ApplicationCreate,
    request: Request,
    session: AsyncSession = Depends(get_db),
):
    extra = data.extra_data or {}
    extra["ip"] = request.client.host if request.client else None
    extra["user_agent"] = request.headers.get("user-agent", "")
    app_obj = Application(
        name=data.name, phone=data.phone, email=data.email,
        company=data.company, message=data.message,
        product_interest=data.product_interest, source=data.source,
        extra_data=extra,
    )
    session.add(app_obj)
    await session.commit()
    await session.refresh(app_obj)

    # Telegramga yuborish (background)
    try:
        await send_application_to_telegram(app_obj)
    except Exception as e:
        # log qilamiz lekin yuzaga chiqarmaymiz — ariza baribir saqlanadi
        import logging
        logging.getLogger("basalt").warning(f"Telegramga yuborib bo'lmadi: {e}")

    return app_obj


@router.get("", response_model=list[ApplicationOut], dependencies=[Depends(require_admin)])
async def list_applications(
    status: str | None = None,
    limit: int = 100,
    offset: int = 0,
    session: AsyncSession = Depends(get_db),
):
    q = select(Application)
    if status:
        q = q.where(Application.status == status)
    q = q.order_by(desc(Application.created_at)).offset(offset).limit(limit)
    res = await session.execute(q)
    return res.scalars().all()


@router.get("/stats", dependencies=[Depends(require_admin)])
async def applications_stats(session: AsyncSession = Depends(get_db)):
    total = await session.scalar(select(func.count(Application.id)))
    new = await session.scalar(select(func.count(Application.id)).where(Application.status == "new"))
    in_progress = await session.scalar(select(func.count(Application.id)).where(Application.status == "in_progress"))
    done = await session.scalar(select(func.count(Application.id)).where(Application.status == "done"))
    return {"total": total, "new": new, "in_progress": in_progress, "done": done}


@router.patch("/{aid}", response_model=ApplicationOut, dependencies=[Depends(require_admin)])
async def update_application(aid: int, data: ApplicationUpdate, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(Application).where(Application.id == aid))
    app_obj = res.scalar_one_or_none()
    if not app_obj:
        raise HTTPException(404)
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(app_obj, k, v)
    await session.commit()
    await session.refresh(app_obj)
    return app_obj


@router.delete("/{aid}", dependencies=[Depends(require_admin)])
async def delete_application(aid: int, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(Application).where(Application.id == aid))
    app_obj = res.scalar_one_or_none()
    if not app_obj:
        raise HTTPException(404)
    await session.delete(app_obj)
    await session.commit()
    return {"ok": True}
