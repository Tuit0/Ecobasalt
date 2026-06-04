"""Pydantic schemas — API request/response validation"""
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, Any
from datetime import datetime, date


# ─────────── Auth ───────────
class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


# ─────────── Category ───────────
class CategoryBase(BaseModel):
    slug: str
    name_uz: str
    name_ru: str
    name_en: str
    description_uz: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    icon: Optional[str] = None
    cover_image: Optional[str] = None
    order: int = 0
    is_active: bool = True


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    slug: Optional[str] = None
    name_uz: Optional[str] = None
    name_ru: Optional[str] = None
    name_en: Optional[str] = None
    description_uz: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    icon: Optional[str] = None
    cover_image: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class CategoryOut(CategoryBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True


# ─────────── Product ───────────
class ProductBase(BaseModel):
    slug: str
    category_id: int
    name_uz: str
    name_ru: str
    name_en: str
    short_uz: Optional[str] = None
    short_ru: Optional[str] = None
    short_en: Optional[str] = None
    description_uz: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    specs: dict = Field(default_factory=dict)
    cover_image: Optional[str] = None
    gallery: list[str] = Field(default_factory=list)
    price_from: Optional[float] = None
    price_currency: str = "USD"
    is_featured: bool = False
    is_active: bool = True
    order: int = 0


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    slug: Optional[str] = None
    category_id: Optional[int] = None
    name_uz: Optional[str] = None
    name_ru: Optional[str] = None
    name_en: Optional[str] = None
    short_uz: Optional[str] = None
    short_ru: Optional[str] = None
    short_en: Optional[str] = None
    description_uz: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    specs: Optional[dict] = None
    cover_image: Optional[str] = None
    gallery: Optional[list[str]] = None
    price_from: Optional[float] = None
    price_currency: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None


class ProductOut(ProductBase):
    id: int
    views: int = 0
    created_at: datetime
    class Config:
        from_attributes = True


# ─────────── Application ───────────
class ApplicationCreate(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    phone: str = Field(min_length=4, max_length=50)
    email: Optional[str] = None
    company: Optional[str] = None
    message: Optional[str] = None
    product_interest: Optional[str] = None
    source: str = "website"
    extra_data: dict = Field(default_factory=dict)


class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


class ApplicationOut(BaseModel):
    id: int
    name: str
    phone: str
    email: Optional[str]
    company: Optional[str]
    message: Optional[str]
    product_interest: Optional[str]
    source: str
    status: str
    extra_data: dict
    notes: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True


# ─────────── Content Blocks ───────────
class ContentBlockUpdate(BaseModel):
    value: Any
    label: Optional[str] = None
    section: Optional[str] = None
    block_type: Optional[str] = None


class ContentBlockOut(BaseModel):
    id: int
    key: str
    section: Optional[str]
    label: Optional[str]
    value: Any
    block_type: str
    order: int
    updated_at: datetime
    class Config:
        from_attributes = True


# ─────────── Hero Slides ───────────
class HeroSlideBase(BaseModel):
    title_uz: Optional[str] = None
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    subtitle_uz: Optional[str] = None
    subtitle_ru: Optional[str] = None
    subtitle_en: Optional[str] = None
    image: Optional[str] = None
    cta_text_uz: Optional[str] = None
    cta_text_ru: Optional[str] = None
    cta_text_en: Optional[str] = None
    cta_link: Optional[str] = None
    order: int = 0
    is_active: bool = True


class HeroSlideCreate(HeroSlideBase):
    pass


class HeroSlideOut(HeroSlideBase):
    id: int
    class Config:
        from_attributes = True


# ─────────── Project ───────────
class ProjectBase(BaseModel):
    slug: Optional[str] = None
    title_uz: Optional[str] = None
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    description_uz: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    location: Optional[str] = None
    year: Optional[int] = None
    area_m2: Optional[int] = None
    cover_image: Optional[str] = None
    gallery: list[str] = Field(default_factory=list)
    is_featured: bool = False
    order: int = 0
    is_active: bool = True


class ProjectCreate(ProjectBase):
    pass


class ProjectOut(ProjectBase):
    id: int
    class Config:
        from_attributes = True


# ─────────── BlogPost ───────────
class BlogPostBase(BaseModel):
    slug: str
    category: Optional[str] = None
    cover_image: Optional[str] = None
    title_uz: str
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    excerpt_uz: Optional[str] = None
    excerpt_ru: Optional[str] = None
    excerpt_en: Optional[str] = None
    body_uz: Optional[str] = None
    body_ru: Optional[str] = None
    body_en: Optional[str] = None
    min_read: int = 5
    published_at: Optional[date] = None
    is_featured: bool = False
    is_published: bool = True


class BlogPostCreate(BlogPostBase):
    pass


class BlogPostUpdate(BaseModel):
    slug: Optional[str] = None
    category: Optional[str] = None
    cover_image: Optional[str] = None
    title_uz: Optional[str] = None
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    excerpt_uz: Optional[str] = None
    excerpt_ru: Optional[str] = None
    excerpt_en: Optional[str] = None
    body_uz: Optional[str] = None
    body_ru: Optional[str] = None
    body_en: Optional[str] = None
    min_read: Optional[int] = None
    published_at: Optional[date] = None
    is_featured: Optional[bool] = None
    is_published: Optional[bool] = None


class BlogPostOut(BlogPostBase):
    id: int
    views: int = 0
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True


# ─────────── FAQ ───────────
class FAQBase(BaseModel):
    category: Optional[str] = None
    question_uz: str
    question_ru: Optional[str] = None
    question_en: Optional[str] = None
    answer_uz: Optional[str] = None
    answer_ru: Optional[str] = None
    answer_en: Optional[str] = None
    order: int = 0
    is_active: bool = True


class FAQCreate(FAQBase):
    pass


class FAQUpdate(BaseModel):
    category: Optional[str] = None
    question_uz: Optional[str] = None
    question_ru: Optional[str] = None
    question_en: Optional[str] = None
    answer_uz: Optional[str] = None
    answer_ru: Optional[str] = None
    answer_en: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class FAQOut(FAQBase):
    id: int
    class Config:
        from_attributes = True


# ─────────── Feature ───────────
class FeatureBase(BaseModel):
    key: str
    icon: Optional[str] = None
    title_uz: str
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    description_uz: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    order: int = 0
    is_active: bool = True


class FeatureCreate(FeatureBase):
    pass


class FeatureUpdate(BaseModel):
    key: Optional[str] = None
    icon: Optional[str] = None
    title_uz: Optional[str] = None
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    description_uz: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class FeatureOut(FeatureBase):
    id: int
    class Config:
        from_attributes = True


# ─────────── Client ───────────
class ClientBase(BaseModel):
    name: str
    logo_url: Optional[str] = None
    website: Optional[str] = None
    order: int = 0
    is_active: bool = True


class ClientCreate(ClientBase):
    pass


class ClientUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    website: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class ClientOut(ClientBase):
    id: int
    class Config:
        from_attributes = True


# ─────────── Calculator Product ───────────
class CalcProductBase(BaseModel):
    code: str
    label_uz: str
    label_ru: Optional[str] = None
    label_en: Optional[str] = None
    base_price: float
    unit: str = "USD/m²"
    thicknesses: list[int] = Field(default_factory=lambda: [50, 80, 100, 120, 150, 200, 250])
    default_thickness: int = 100
    order: int = 0
    is_active: bool = True


class CalcProductCreate(CalcProductBase):
    pass


class CalcProductUpdate(BaseModel):
    code: Optional[str] = None
    label_uz: Optional[str] = None
    label_ru: Optional[str] = None
    label_en: Optional[str] = None
    base_price: Optional[float] = None
    unit: Optional[str] = None
    thicknesses: Optional[list[int]] = None
    default_thickness: Optional[int] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class CalcProductOut(CalcProductBase):
    id: int
    class Config:
        from_attributes = True


# ─────────── Comparison Row ───────────
class ComparisonRowBase(BaseModel):
    feature_uz: str
    feature_ru: Optional[str] = None
    feature_en: Optional[str] = None
    basalt_value_uz: Optional[str] = None
    basalt_value_ru: Optional[str] = None
    basalt_value_en: Optional[str] = None
    basalt_type: str = "good"
    pir_value_uz: Optional[str] = None
    pir_value_ru: Optional[str] = None
    pir_value_en: Optional[str] = None
    pir_type: str = "neutral"
    pur_value_uz: Optional[str] = None
    pur_value_ru: Optional[str] = None
    pur_value_en: Optional[str] = None
    pur_type: str = "neutral"
    eps_value_uz: Optional[str] = None
    eps_value_ru: Optional[str] = None
    eps_value_en: Optional[str] = None
    eps_type: str = "bad"
    order: int = 0
    is_active: bool = True


class ComparisonRowCreate(ComparisonRowBase):
    pass


class ComparisonRowUpdate(BaseModel):
    feature_uz: Optional[str] = None
    feature_ru: Optional[str] = None
    feature_en: Optional[str] = None
    basalt_value_uz: Optional[str] = None
    basalt_value_ru: Optional[str] = None
    basalt_value_en: Optional[str] = None
    basalt_type: Optional[str] = None
    pir_value_uz: Optional[str] = None
    pir_value_ru: Optional[str] = None
    pir_value_en: Optional[str] = None
    pir_type: Optional[str] = None
    pur_value_uz: Optional[str] = None
    pur_value_ru: Optional[str] = None
    pur_value_en: Optional[str] = None
    pur_type: Optional[str] = None
    eps_value_uz: Optional[str] = None
    eps_value_ru: Optional[str] = None
    eps_value_en: Optional[str] = None
    eps_type: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class ComparisonRowOut(ComparisonRowBase):
    id: int
    class Config:
        from_attributes = True


# ─────────── Analytics ───────────
class TrackView(BaseModel):
    session_id: str
    path: str
    referrer: Optional[str] = None
    user_agent: Optional[str] = None
    device: Optional[str] = None
    duration_sec: int = 0
    utm: dict = Field(default_factory=dict)


class Heartbeat(BaseModel):
    session_id: str
    path: str
    device: Optional[str] = None


class AnalyticsStats(BaseModel):
    total_views: int
    unique_sessions: int
    applications_total: int
    applications_today: int
    active_now: int
    top_pages: list[dict]
    views_by_day: list[dict]
    top_products: list[dict]
    devices: dict


# ─────────── Chat ───────────
class ChatMessageCreate(BaseModel):
    session_id: str
    sender: str = "user"
    text: str
    name: Optional[str] = None
    phone: Optional[str] = None


class ChatMessageOut(BaseModel):
    id: int
    session_id: str
    sender: str
    text: str
    is_read: bool
    created_at: datetime
    class Config:
        from_attributes = True


class ChatSessionOut(BaseModel):
    session_id: str
    name: Optional[str]
    phone: Optional[str]
    unread_count: int
    last_message_at: datetime
    class Config:
        from_attributes = True
