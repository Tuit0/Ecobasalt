"""Content blocks va hero slides — admin paneldan boshqariladi"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.content import ContentBlock, HeroSlide, Project
from app.schemas import (
    ContentBlockOut, ContentBlockUpdate,
    HeroSlideOut, HeroSlideCreate,
    ProjectOut, ProjectCreate,
)
from app.services.auth import require_admin

router = APIRouter()


# ─────────── Content blocks ───────────
@router.get("/blocks", response_model=list[ContentBlockOut])
async def list_blocks(section: str | None = None, session: AsyncSession = Depends(get_db)):
    q = select(ContentBlock).order_by(ContentBlock.section, ContentBlock.order)
    if section:
        q = q.where(ContentBlock.section == section)
    res = await session.execute(q)
    return res.scalars().all()


@router.get("/blocks/by-key/{key}", response_model=ContentBlockOut)
async def get_block_by_key(key: str, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(ContentBlock).where(ContentBlock.key == key))
    block = res.scalar_one_or_none()
    if not block:
        raise HTTPException(404)
    return block


@router.patch("/blocks/{key}", response_model=ContentBlockOut, dependencies=[Depends(require_admin)])
async def update_block(key: str, data: ContentBlockUpdate, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(ContentBlock).where(ContentBlock.key == key))
    block = res.scalar_one_or_none()
    if not block:
        # yaratish
        block = ContentBlock(key=key, value=data.value)
        if data.label: block.label = data.label
        if data.section: block.section = data.section
        if data.block_type: block.block_type = data.block_type
        session.add(block)
    else:
        block.value = data.value
        if data.label is not None: block.label = data.label
        if data.section is not None: block.section = data.section
        if data.block_type is not None: block.block_type = data.block_type
    await session.commit()
    await session.refresh(block)
    return block


# ─────────── Hero Slides ───────────
@router.get("/hero-slides", response_model=list[HeroSlideOut])
async def list_hero_slides(session: AsyncSession = Depends(get_db)):
    res = await session.execute(
        select(HeroSlide).where(HeroSlide.is_active == True).order_by(HeroSlide.order)
    )
    return res.scalars().all()


@router.post("/hero-slides", response_model=HeroSlideOut, dependencies=[Depends(require_admin)])
async def create_hero_slide(data: HeroSlideCreate, session: AsyncSession = Depends(get_db)):
    slide = HeroSlide(**data.model_dump())
    session.add(slide)
    await session.commit()
    await session.refresh(slide)
    return slide


@router.patch("/hero-slides/{sid}", response_model=HeroSlideOut, dependencies=[Depends(require_admin)])
async def update_hero_slide(sid: int, data: HeroSlideCreate, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(HeroSlide).where(HeroSlide.id == sid))
    slide = res.scalar_one_or_none()
    if not slide:
        raise HTTPException(404)
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(slide, k, v)
    await session.commit()
    await session.refresh(slide)
    return slide


@router.delete("/hero-slides/{sid}", dependencies=[Depends(require_admin)])
async def delete_hero_slide(sid: int, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(HeroSlide).where(HeroSlide.id == sid))
    slide = res.scalar_one_or_none()
    if not slide:
        raise HTTPException(404)
    await session.delete(slide)
    await session.commit()
    return {"ok": True}


# ─────────── Projects ───────────
@router.get("/projects", response_model=list[ProjectOut])
async def list_projects(featured: bool | None = None, session: AsyncSession = Depends(get_db)):
    q = select(Project).where(Project.is_active == True)
    if featured is not None:
        q = q.where(Project.is_featured == featured)
    q = q.order_by(Project.order, Project.id.desc())
    res = await session.execute(q)
    return res.scalars().all()


@router.get("/projects/by-slug/{slug}", response_model=ProjectOut)
async def get_project_by_slug(slug: str, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(Project).where(Project.slug == slug, Project.is_active == True))
    proj = res.scalar_one_or_none()
    if not proj:
        raise HTTPException(404, detail="Project not found")
    return proj


@router.post("/projects", response_model=ProjectOut, dependencies=[Depends(require_admin)])
async def create_project(data: ProjectCreate, session: AsyncSession = Depends(get_db)):
    proj = Project(**data.model_dump())
    session.add(proj)
    await session.commit()
    await session.refresh(proj)
    return proj


@router.patch("/projects/{pid}", response_model=ProjectOut, dependencies=[Depends(require_admin)])
async def update_project(pid: int, data: ProjectCreate, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(Project).where(Project.id == pid))
    proj = res.scalar_one_or_none()
    if not proj:
        raise HTTPException(404)
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(proj, k, v)
    await session.commit()
    await session.refresh(proj)
    return proj


@router.delete("/projects/{pid}", dependencies=[Depends(require_admin)])
async def delete_project(pid: int, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(Project).where(Project.id == pid))
    proj = res.scalar_one_or_none()
    if not proj:
        raise HTTPException(404)
    await session.delete(proj)
    await session.commit()
    return {"ok": True}
