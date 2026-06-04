"""Analitika — sahifa ko'rishlari, davomiylik, va boshqalar"""
from sqlalchemy import Column, Integer, String, DateTime, Float, JSON, Index
from sqlalchemy.sql import func
from app.core.database import Base


class PageView(Base):
    """Har bir sahifa ko'rishi"""
    __tablename__ = "page_views"
    id = Column(Integer, primary_key=True)
    session_id = Column(String(64), index=True)  # anonim ID
    path = Column(String(500), index=True)  # /products/sandwich-panel
    referrer = Column(String(500))
    user_agent = Column(String(500))
    ip_hash = Column(String(64))  # IP hashi (GDPR'ga mos)
    country = Column(String(80))
    device = Column(String(40))  # mobile/desktop/tablet
    duration_sec = Column(Integer, default=0)  # sahifada nech soniya turgan
    utm = Column(JSON, default=dict)  # utm_source, utm_campaign, va h.k.
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    __table_args__ = (
        Index("ix_pageviews_session_path", "session_id", "path"),
    )


class ActiveSession(Base):
    """Hozir saytda kim, qaysi sahifada turgani"""
    __tablename__ = "active_sessions"
    session_id = Column(String(64), primary_key=True)
    path = Column(String(500))
    last_seen = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), index=True)
    country = Column(String(80))
    device = Column(String(40))
    user_agent = Column(String(500))
