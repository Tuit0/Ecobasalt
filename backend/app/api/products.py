"""Mahsulot va kategoriya endpointlari"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from app.core.database import get_db
from app.models.product import Category, Product
from app.schemas import (
    CategoryOut, CategoryCreate, CategoryUpdate,
    ProductOut, ProductCreate, ProductUpdate,
)
from app.services.auth import require_admin

router = APIRouter()


# ─────────── Public ───────────
@router.get("/categories", response_model=list[CategoryOut])
async def list_categories(session: AsyncSession = Depends(get_db)):
    res = await session.execute(
        select(Category).where(Category.is_active == True).order_by(Category.order)
    )
    return res.scalars().all()


@router.get("/categories/{slug}", response_model=CategoryOut)
async def get_category(slug: str, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(Category).where(Category.slug == slug))
    cat = res.scalar_one_or_none()
    if not cat:
        raise HTTPException(404, "Kategoriya topilmadi")
    return cat


@router.get("", response_model=list[ProductOut])
async def list_products(
    category: str | None = Query(None),
    featured: bool | None = Query(None),
    session: AsyncSession = Depends(get_db),
):
    q = select(Product).where(Product.is_active == True)
    if category:
        cat_res = await session.execute(select(Category).where(Category.slug == category))
        cat = cat_res.scalar_one_or_none()
        if cat:
            q = q.where(Product.category_id == cat.id)
    if featured is not None:
        q = q.where(Product.is_featured == featured)
    q = q.order_by(Product.order, Product.id.desc())
    res = await session.execute(q)
    return res.scalars().all()


@router.get("/{slug}", response_model=ProductOut)
async def get_product(slug: str, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(Product).where(Product.slug == slug))
    prod = res.scalar_one_or_none()
    if not prod:
        raise HTTPException(404, "Mahsulot topilmadi")
    # views +1
    await session.execute(update(Product).where(Product.id == prod.id).values(views=Product.views + 1))
    await session.commit()
    return prod


# ─────────── Admin ───────────
@router.post("/categories", response_model=CategoryOut, dependencies=[Depends(require_admin)])
async def create_category(data: CategoryCreate, session: AsyncSession = Depends(get_db)):
    cat = Category(**data.model_dump())
    session.add(cat)
    await session.commit()
    await session.refresh(cat)
    return cat


@router.patch("/categories/{cid}", response_model=CategoryOut, dependencies=[Depends(require_admin)])
async def update_category(cid: int, data: CategoryUpdate, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(Category).where(Category.id == cid))
    cat = res.scalar_one_or_none()
    if not cat:
        raise HTTPException(404)
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(cat, k, v)
    await session.commit()
    await session.refresh(cat)
    return cat


@router.delete("/categories/{cid}", dependencies=[Depends(require_admin)])
async def delete_category(cid: int, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(Category).where(Category.id == cid))
    cat = res.scalar_one_or_none()
    if not cat:
        raise HTTPException(404)
    await session.delete(cat)
    await session.commit()
    return {"ok": True}


@router.post("", response_model=ProductOut, dependencies=[Depends(require_admin)])
async def create_product(data: ProductCreate, session: AsyncSession = Depends(get_db)):
    prod = Product(**data.model_dump())
    session.add(prod)
    await session.commit()
    await session.refresh(prod)
    return prod


@router.patch("/{pid}", response_model=ProductOut, dependencies=[Depends(require_admin)])
async def update_product(pid: int, data: ProductUpdate, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(Product).where(Product.id == pid))
    prod = res.scalar_one_or_none()
    if not prod:
        raise HTTPException(404)
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(prod, k, v)
    await session.commit()
    await session.refresh(prod)
    return prod


@router.delete("/{pid}", dependencies=[Depends(require_admin)])
async def delete_product(pid: int, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(Product).where(Product.id == pid))
    prod = res.scalar_one_or_none()
    if not prod:
        raise HTTPException(404)
    await session.delete(prod)
    await session.commit()
    return {"ok": True}


# Admin uchun barcha mahsulotlar (yashirinlari ham)
@router.get("/admin/all", response_model=list[ProductOut], dependencies=[Depends(require_admin)])
async def admin_list_all_products(session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(Product).order_by(Product.order, Product.id.desc()))
    return res.scalars().all()
