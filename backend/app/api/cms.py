"""FAQ, Features, Clients, Calculator products, Comparison rows API"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.core.database import get_db
from app.models.cms import FAQ, Feature, Client, CalculatorProduct, ComparisonRow
from app.schemas import (
    FAQOut, FAQCreate, FAQUpdate,
    FeatureOut, FeatureCreate, FeatureUpdate,
    ClientOut, ClientCreate, ClientUpdate,
    CalcProductOut, CalcProductCreate, CalcProductUpdate,
    ComparisonRowOut, ComparisonRowCreate, ComparisonRowUpdate,
)
from app.services.auth import require_admin

router = APIRouter(tags=["cms"])


# ─────────── FAQ ───────────
@router.get("/faqs", response_model=list[FAQOut])
async def list_faqs(category: str | None = None, session: AsyncSession = Depends(get_db)):
    q = select(FAQ).where(FAQ.is_active == True)
    if category:
        q = q.where(FAQ.category == category)
    q = q.order_by(FAQ.order, FAQ.id)
    res = await session.execute(q)
    return res.scalars().all()


@router.get("/faqs/admin/all", response_model=list[FAQOut], dependencies=[Depends(require_admin)])
async def list_all_faqs(session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(FAQ).order_by(FAQ.order, FAQ.id))
    return res.scalars().all()


@router.post("/faqs", response_model=FAQOut, dependencies=[Depends(require_admin)])
async def create_faq(data: FAQCreate, session: AsyncSession = Depends(get_db)):
    faq = FAQ(**data.model_dump())
    session.add(faq)
    await session.commit()
    await session.refresh(faq)
    return faq


@router.patch("/faqs/{fid}", response_model=FAQOut, dependencies=[Depends(require_admin)])
async def update_faq(fid: int, data: FAQUpdate, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(FAQ).where(FAQ.id == fid))
    faq = res.scalar_one_or_none()
    if not faq:
        raise HTTPException(404)
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(faq, k, v)
    await session.commit()
    await session.refresh(faq)
    return faq


@router.delete("/faqs/{fid}", dependencies=[Depends(require_admin)])
async def delete_faq(fid: int, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(FAQ).where(FAQ.id == fid))
    faq = res.scalar_one_or_none()
    if not faq:
        raise HTTPException(404)
    await session.delete(faq)
    await session.commit()
    return {"ok": True}


# ─────────── Features ───────────
@router.get("/features", response_model=list[FeatureOut])
async def list_features(session: AsyncSession = Depends(get_db)):
    q = select(Feature).where(Feature.is_active == True).order_by(Feature.order, Feature.id)
    res = await session.execute(q)
    return res.scalars().all()


@router.get("/features/admin/all", response_model=list[FeatureOut], dependencies=[Depends(require_admin)])
async def list_all_features(session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(Feature).order_by(Feature.order, Feature.id))
    return res.scalars().all()


@router.post("/features", response_model=FeatureOut, dependencies=[Depends(require_admin)])
async def create_feature(data: FeatureCreate, session: AsyncSession = Depends(get_db)):
    f = Feature(**data.model_dump())
    session.add(f)
    await session.commit()
    await session.refresh(f)
    return f


@router.patch("/features/{fid}", response_model=FeatureOut, dependencies=[Depends(require_admin)])
async def update_feature(fid: int, data: FeatureUpdate, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(Feature).where(Feature.id == fid))
    f = res.scalar_one_or_none()
    if not f:
        raise HTTPException(404)
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(f, k, v)
    await session.commit()
    await session.refresh(f)
    return f


@router.delete("/features/{fid}", dependencies=[Depends(require_admin)])
async def delete_feature(fid: int, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(Feature).where(Feature.id == fid))
    f = res.scalar_one_or_none()
    if not f:
        raise HTTPException(404)
    await session.delete(f)
    await session.commit()
    return {"ok": True}


# ─────────── Clients ───────────
@router.get("/clients", response_model=list[ClientOut])
async def list_clients(session: AsyncSession = Depends(get_db)):
    q = select(Client).where(Client.is_active == True).order_by(Client.order, Client.id)
    res = await session.execute(q)
    return res.scalars().all()


@router.get("/clients/admin/all", response_model=list[ClientOut], dependencies=[Depends(require_admin)])
async def list_all_clients(session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(Client).order_by(Client.order, Client.id))
    return res.scalars().all()


@router.post("/clients", response_model=ClientOut, dependencies=[Depends(require_admin)])
async def create_client(data: ClientCreate, session: AsyncSession = Depends(get_db)):
    c = Client(**data.model_dump())
    session.add(c)
    await session.commit()
    await session.refresh(c)
    return c


@router.patch("/clients/{cid}", response_model=ClientOut, dependencies=[Depends(require_admin)])
async def update_client(cid: int, data: ClientUpdate, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(Client).where(Client.id == cid))
    c = res.scalar_one_or_none()
    if not c:
        raise HTTPException(404)
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(c, k, v)
    await session.commit()
    await session.refresh(c)
    return c


@router.delete("/clients/{cid}", dependencies=[Depends(require_admin)])
async def delete_client(cid: int, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(Client).where(Client.id == cid))
    c = res.scalar_one_or_none()
    if not c:
        raise HTTPException(404)
    await session.delete(c)
    await session.commit()
    return {"ok": True}


# ─────────── Calculator Products ───────────
@router.get("/calc/products", response_model=list[CalcProductOut])
async def list_calc_products(session: AsyncSession = Depends(get_db)):
    q = select(CalculatorProduct).where(CalculatorProduct.is_active == True).order_by(CalculatorProduct.order, CalculatorProduct.id)
    res = await session.execute(q)
    return res.scalars().all()


@router.get("/calc/products/admin/all", response_model=list[CalcProductOut], dependencies=[Depends(require_admin)])
async def list_all_calc_products(session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(CalculatorProduct).order_by(CalculatorProduct.order, CalculatorProduct.id))
    return res.scalars().all()


@router.post("/calc/products", response_model=CalcProductOut, dependencies=[Depends(require_admin)])
async def create_calc_product(data: CalcProductCreate, session: AsyncSession = Depends(get_db)):
    p = CalculatorProduct(**data.model_dump())
    session.add(p)
    await session.commit()
    await session.refresh(p)
    return p


@router.patch("/calc/products/{pid}", response_model=CalcProductOut, dependencies=[Depends(require_admin)])
async def update_calc_product(pid: int, data: CalcProductUpdate, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(CalculatorProduct).where(CalculatorProduct.id == pid))
    p = res.scalar_one_or_none()
    if not p:
        raise HTTPException(404)
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(p, k, v)
    await session.commit()
    await session.refresh(p)
    return p


@router.delete("/calc/products/{pid}", dependencies=[Depends(require_admin)])
async def delete_calc_product(pid: int, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(CalculatorProduct).where(CalculatorProduct.id == pid))
    p = res.scalar_one_or_none()
    if not p:
        raise HTTPException(404)
    await session.delete(p)
    await session.commit()
    return {"ok": True}


# ─────────── Comparison Rows ───────────
@router.get("/comparison/rows", response_model=list[ComparisonRowOut])
async def list_comparison_rows(session: AsyncSession = Depends(get_db)):
    q = select(ComparisonRow).where(ComparisonRow.is_active == True).order_by(ComparisonRow.order, ComparisonRow.id)
    res = await session.execute(q)
    return res.scalars().all()


@router.get("/comparison/rows/admin/all", response_model=list[ComparisonRowOut], dependencies=[Depends(require_admin)])
async def list_all_comparison_rows(session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(ComparisonRow).order_by(ComparisonRow.order, ComparisonRow.id))
    return res.scalars().all()


@router.post("/comparison/rows", response_model=ComparisonRowOut, dependencies=[Depends(require_admin)])
async def create_comparison_row(data: ComparisonRowCreate, session: AsyncSession = Depends(get_db)):
    r = ComparisonRow(**data.model_dump())
    session.add(r)
    await session.commit()
    await session.refresh(r)
    return r


@router.patch("/comparison/rows/{rid}", response_model=ComparisonRowOut, dependencies=[Depends(require_admin)])
async def update_comparison_row(rid: int, data: ComparisonRowUpdate, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(ComparisonRow).where(ComparisonRow.id == rid))
    r = res.scalar_one_or_none()
    if not r:
        raise HTTPException(404)
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(r, k, v)
    await session.commit()
    await session.refresh(r)
    return r


@router.delete("/comparison/rows/{rid}", dependencies=[Depends(require_admin)])
async def delete_comparison_row(rid: int, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(ComparisonRow).where(ComparisonRow.id == rid))
    r = res.scalar_one_or_none()
    if not r:
        raise HTTPException(404)
    await session.delete(r)
    await session.commit()
    return {"ok": True}
