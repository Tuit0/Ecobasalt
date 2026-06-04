"""Mijoz arizalari modeli"""
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class ApplicationStatus(str, enum.Enum):
    NEW = "new"
    IN_PROGRESS = "in_progress"
    DONE = "done"
    REJECTED = "rejected"


class Application(Base):
    """Mijoz arizasi — landing pagedan yoki Telegram botdan keladi"""
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    phone = Column(String(50), nullable=False, index=True)
    email = Column(String(200), nullable=True)
    company = Column(String(255), nullable=True)
    message = Column(Text)
    product_interest = Column(String(255), nullable=True)  # qaysi mahsulotga qiziqish
    source = Column(String(50), default="website")  # website, telegram, chat
    status = Column(String(20), default=ApplicationStatus.NEW.value, index=True)
    extra_data = Column(JSON, default=dict)  # qo'shimcha (UTM, page, va h.k.)
    notes = Column(Text)  # admin yozuvlari
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
