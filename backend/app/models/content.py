"""Sayt kontenti — admin paneldan boshqariladi.
Har bir blok (Hero, About, Stats, Contact va h.k.) shu jadvalda saqlanadi."""
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON
from sqlalchemy.sql import func
from app.core.database import Base


class ContentBlock(Base):
    """Har bir 'key' — sayt qismidagi yozuv yoki bo'lim.
    Admin paneldan istalgan matnni o'zgartirish mumkin.

    Misollar:
      - key='hero.title' value={"uz": "...", "ru": "...", "en": "..."}
      - key='hero.subtitle'
      - key='stats' value={"projects": 150, "clients": 80, "years": 12}
      - key='contact.phone' value="+998..."
    """
    __tablename__ = "content_blocks"
    id = Column(Integer, primary_key=True)
    key = Column(String(120), unique=True, nullable=False, index=True)
    section = Column(String(80), index=True)  # 'hero', 'about', 'stats' va h.k.
    label = Column(String(255))  # adminkada ko'rsatish uchun nomi
    value = Column(JSON, default=dict)
    block_type = Column(String(40), default="text")  # text, multilang, image, number, list, json
    order = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class HeroSlide(Base):
    """Hero slayder uchun slaydlar"""
    __tablename__ = "hero_slides"
    id = Column(Integer, primary_key=True)
    title_uz = Column(String(255))
    title_ru = Column(String(255))
    title_en = Column(String(255))
    subtitle_uz = Column(Text)
    subtitle_ru = Column(Text)
    subtitle_en = Column(Text)
    image = Column(String(500))
    cta_text_uz = Column(String(100))
    cta_text_ru = Column(String(100))
    cta_text_en = Column(String(100))
    cta_link = Column(String(500))
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Project(Base):
    """Tugallangan loyihalar — portfolio"""
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True)
    slug = Column(String(160), unique=True, index=True)
    title_uz = Column(String(255))
    title_ru = Column(String(255))
    title_en = Column(String(255))
    description_uz = Column(Text)
    description_ru = Column(Text)
    description_en = Column(Text)
    location = Column(String(255))
    year = Column(Integer)
    area_m2 = Column(Integer, nullable=True)
    cover_image = Column(String(500))
    gallery = Column(JSON, default=list)
    is_featured = Column(Boolean, default=False)
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
