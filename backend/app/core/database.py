"""Database — Async SQLAlchemy"""
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from typing import AsyncGenerator
import logging

from app.core.config import settings

log = logging.getLogger(__name__)

_is_sqlite = settings.DATABASE_URL.startswith("sqlite")

# SQLite uchun connection pool argumentlari kerak emas (single-file DB)
_engine_kwargs: dict = {"echo": False}
if not _is_sqlite:
    _engine_kwargs.update(pool_pre_ping=True, pool_size=10, max_overflow=20)

engine = create_async_engine(settings.DATABASE_URL, **_engine_kwargs)

AsyncSessionLocal = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db():
    """Jadvallarni yaratish, light migration va boshlang'ich kontent."""
    from app.models import user, product, application, content, analytics, chat, cms  # noqa
    from app.services.auth import create_default_admin
    from app.services.seeder import seed_initial_content
    from sqlalchemy import text

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

        # Light migration — SQLite create_all mavjud jadvalga column qo'shmaydi
        if _is_sqlite:
            # projects.slug column
            res = await conn.exec_driver_sql("PRAGMA table_info(projects)")
            cols = [row[1] for row in res.fetchall()]
            if "slug" not in cols:
                await conn.exec_driver_sql("ALTER TABLE projects ADD COLUMN slug VARCHAR(160)")
                log.info("✅ Migration: projects.slug column qo'shildi")

    log.info("✅ Database tayyor")

    # Default admin va boshlang'ich kontent
    async with AsyncSessionLocal() as session:
        await create_default_admin(session)
        await seed_initial_content(session)


async def close_db():
    await engine.dispose()
