"""Bo'limlar ko'rinishi (section visibility) — admin tomonidan boshqariladi.

ContentBlock ichida `section.{key}.visible` keylari orqali saqlanadi.
Value: "1" (ko'rinadi) yoki "0" (yashirin).
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.core.database import get_db
from app.models.content import ContentBlock
from app.services.auth import require_admin

router = APIRouter()

PREFIX = "section."
SUFFIX = ".visible"


def _key_to_section(key: str) -> str | None:
    if not key.startswith(PREFIX) or not key.endswith(SUFFIX):
        return None
    return key[len(PREFIX):-len(SUFFIX)]


# Default ko'rinadigan barcha bo'limlar
KNOWN_SECTIONS = [
    "trustbar",
    "stats",
    "industries",
    "process",
    "comparison",
    "products",
    "projects",
    "features",
    "faq",
    "testimonials",
    "newsletter",
    "blog",
    "final_cta",
    "about",
    "company_stats",
    "why_eco_basalt",
]


class VisibilityUpdate(BaseModel):
    sections: dict[str, bool]


@router.get("/visibility")
async def get_visibility(session: AsyncSession = Depends(get_db)) -> dict[str, bool]:
    """Barcha bo'limlar ko'rinishi: {trustbar: true, stats: false, ...}"""
    res = await session.execute(
        select(ContentBlock).where(ContentBlock.key.like(f"{PREFIX}%{SUFFIX}"))
    )
    blocks = res.scalars().all()
    result: dict[str, bool] = {s: True for s in KNOWN_SECTIONS}
    for b in blocks:
        sec = _key_to_section(b.key)
        if not sec:
            continue
        result[sec] = str(b.value).strip() not in ("0", "false", "no", "")
    return result


@router.patch("/visibility", dependencies=[Depends(require_admin)])
async def update_visibility(data: VisibilityUpdate, session: AsyncSession = Depends(get_db)) -> dict[str, bool]:
    for sec, visible in data.sections.items():
        key = f"{PREFIX}{sec}{SUFFIX}"
        res = await session.execute(select(ContentBlock).where(ContentBlock.key == key))
        block = res.scalar_one_or_none()
        val = "1" if visible else "0"
        if block:
            block.value = val
        else:
            session.add(ContentBlock(
                key=key,
                value=val,
                label=f"Bo'lim ko'rinishi: {sec}",
                section="visibility",
                block_type="text",
            ))
    await session.commit()
    return await get_visibility(session)
