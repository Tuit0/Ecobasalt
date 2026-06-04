"""Blog API"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.core.database import get_db
from app.models.cms import BlogPost
from app.schemas import BlogPostOut, BlogPostCreate, BlogPostUpdate
from app.services.auth import require_admin

router = APIRouter(prefix="/blog", tags=["blog"])


@router.get("", response_model=list[BlogPostOut])
async def list_posts(
    category: str | None = None,
    featured: bool | None = None,
    limit: int = Query(50, le=100),
    session: AsyncSession = Depends(get_db),
):
    q = select(BlogPost).where(BlogPost.is_published == True)
    if category:
        q = q.where(BlogPost.category == category)
    if featured is not None:
        q = q.where(BlogPost.is_featured == featured)
    q = q.order_by(desc(BlogPost.published_at), desc(BlogPost.id)).limit(limit)
    res = await session.execute(q)
    return res.scalars().all()


@router.get("/by-slug/{slug}", response_model=BlogPostOut)
async def get_post(slug: str, session: AsyncSession = Depends(get_db)):
    res = await session.execute(
        select(BlogPost).where(BlogPost.slug == slug, BlogPost.is_published == True)
    )
    post = res.scalar_one_or_none()
    if not post:
        raise HTTPException(404, detail="Post not found")
    # Inkrement views
    post.views = (post.views or 0) + 1
    await session.commit()
    await session.refresh(post)
    return post


@router.get("/admin/all", response_model=list[BlogPostOut], dependencies=[Depends(require_admin)])
async def list_all_posts(session: AsyncSession = Depends(get_db)):
    """Admin uchun — published va draft'lar ham"""
    res = await session.execute(select(BlogPost).order_by(desc(BlogPost.id)))
    return res.scalars().all()


@router.post("", response_model=BlogPostOut, dependencies=[Depends(require_admin)])
async def create_post(data: BlogPostCreate, session: AsyncSession = Depends(get_db)):
    post = BlogPost(**data.model_dump())
    session.add(post)
    await session.commit()
    await session.refresh(post)
    return post


@router.patch("/{pid}", response_model=BlogPostOut, dependencies=[Depends(require_admin)])
async def update_post(pid: int, data: BlogPostUpdate, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(BlogPost).where(BlogPost.id == pid))
    post = res.scalar_one_or_none()
    if not post:
        raise HTTPException(404)
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(post, k, v)
    await session.commit()
    await session.refresh(post)
    return post


@router.delete("/{pid}", dependencies=[Depends(require_admin)])
async def delete_post(pid: int, session: AsyncSession = Depends(get_db)):
    res = await session.execute(select(BlogPost).where(BlogPost.id == pid))
    post = res.scalar_one_or_none()
    if not post:
        raise HTTPException(404)
    await session.delete(post)
    await session.commit()
    return {"ok": True}
