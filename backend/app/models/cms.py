"""CMS modellari — Blog, FAQ, Features, Clients"""
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON, Date, Float
from sqlalchemy.sql import func
from app.core.database import Base


class BlogPost(Base):
    """Blog maqolalar"""
    __tablename__ = "blog_posts"
    id = Column(Integer, primary_key=True)
    slug = Column(String(200), unique=True, nullable=False, index=True)
    category = Column(String(40), index=True)  # tech, industry, project, eco
    cover_image = Column(String(500))

    # Multi-lang
    title_uz = Column(String(255), nullable=False)
    title_ru = Column(String(255))
    title_en = Column(String(255))
    excerpt_uz = Column(Text)
    excerpt_ru = Column(Text)
    excerpt_en = Column(Text)
    body_uz = Column(Text)
    body_ru = Column(Text)
    body_en = Column(Text)

    min_read = Column(Integer, default=5)
    published_at = Column(Date)
    is_featured = Column(Boolean, default=False)
    is_published = Column(Boolean, default=True, index=True)
    views = Column(Integer, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class FAQ(Base):
    """Tez-tez so'raladigan savollar"""
    __tablename__ = "faqs"
    id = Column(Integer, primary_key=True)
    category = Column(String(40), index=True)  # general, technical, pricing, delivery

    question_uz = Column(Text, nullable=False)
    question_ru = Column(Text)
    question_en = Column(Text)
    answer_uz = Column(Text)
    answer_ru = Column(Text)
    answer_en = Column(Text)

    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Feature(Base):
    """Sayt xususiyatlari (Features section)"""
    __tablename__ = "features"
    id = Column(Integer, primary_key=True)
    key = Column(String(40), unique=True, index=True)
    icon = Column(String(40))  # lucide-react icon name (Flame, Leaf, Shield, etc.)

    title_uz = Column(String(200), nullable=False)
    title_ru = Column(String(200))
    title_en = Column(String(200))
    description_uz = Column(Text)
    description_ru = Column(Text)
    description_en = Column(Text)

    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True, index=True)


class Client(Base):
    """Mijozlar logotipi (TrustBar uchun)"""
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    logo_url = Column(String(500))
    website = Column(String(500))
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class CalculatorProduct(Base):
    """Calculator uchun panel turlari va narxlar"""
    __tablename__ = "calculator_products"
    id = Column(Integer, primary_key=True)
    code = Column(String(40), unique=True, index=True)  # wall, roof, fridge
    label_uz = Column(String(200), nullable=False)
    label_ru = Column(String(200))
    label_en = Column(String(200))
    base_price = Column(Float, nullable=False)  # 100mm uchun USD/m²
    unit = Column(String(20), default="USD/m²")
    thicknesses = Column(JSON, default=list)  # [50, 80, 100, 120, 150, 200, 250]
    default_thickness = Column(Integer, default=100)
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True, index=True)


class ComparisonRow(Base):
    """Sandwich panel turlarini taqqoslash qator"""
    __tablename__ = "comparison_rows"
    id = Column(Integer, primary_key=True)

    feature_uz = Column(String(255), nullable=False)
    feature_ru = Column(String(255))
    feature_en = Column(String(255))

    # Har bir kolonna uchun value + type (good/neutral/bad)
    basalt_value_uz = Column(String(120)); basalt_value_ru = Column(String(120)); basalt_value_en = Column(String(120))
    basalt_type = Column(String(10), default="good")

    pir_value_uz = Column(String(120)); pir_value_ru = Column(String(120)); pir_value_en = Column(String(120))
    pir_type = Column(String(10), default="neutral")

    pur_value_uz = Column(String(120)); pur_value_ru = Column(String(120)); pur_value_en = Column(String(120))
    pur_type = Column(String(10), default="neutral")

    eps_value_uz = Column(String(120)); eps_value_ru = Column(String(120)); eps_value_en = Column(String(120))
    eps_type = Column(String(10), default="bad")

    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True, index=True)
