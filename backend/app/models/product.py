"""Mahsulotlar modeli — sendvich panellar, bazalt izolyatsiya, va h.k."""
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Category(Base):
    """Kategoriya: Sendvich panellar / Izolyatsiya / Tola va h.k."""
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True)
    slug = Column(String(120), unique=True, nullable=False, index=True)
    name_uz = Column(String(200), nullable=False)
    name_ru = Column(String(200), nullable=False)
    name_en = Column(String(200), nullable=False)
    description_uz = Column(Text)
    description_ru = Column(Text)
    description_en = Column(Text)
    icon = Column(String(255))  # icon nomi (lucide-react)
    cover_image = Column(String(500))
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    products = relationship("Product", back_populates="category", cascade="all, delete-orphan")


class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True)
    slug = Column(String(160), unique=True, nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"))

    # Ko'p tilli
    name_uz = Column(String(255), nullable=False)
    name_ru = Column(String(255), nullable=False)
    name_en = Column(String(255), nullable=False)
    short_uz = Column(Text)
    short_ru = Column(Text)
    short_en = Column(Text)
    description_uz = Column(Text)
    description_ru = Column(Text)
    description_en = Column(Text)

    # Asosiy afzalliklar va qo'llanish sohasi — har bir til uchun satrlar ro'yxati
    advantages_uz = Column(JSON, default=list)
    advantages_ru = Column(JSON, default=list)
    advantages_en = Column(JSON, default=list)
    applications_uz = Column(JSON, default=list)
    applications_ru = Column(JSON, default=list)
    applications_en = Column(JSON, default=list)

    # Texnik xususiyatlar JSON formatida
    # Misol: {"qalinligi_mm": 100, "zichlik_kg_m3": 120, "yong'inga_chidamlilik": "EI 90"}
    specs = Column(JSON, default=dict)

    # Rasm va galereya
    cover_image = Column(String(500))
    gallery = Column(JSON, default=list)  # rasm URL'lari ro'yxati

    price_from = Column(Float, nullable=True)  # "narxi" — UZS yoki USD
    price_currency = Column(String(10), default="USD")

    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    views = Column(Integer, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    category = relationship("Category", back_populates="products")
