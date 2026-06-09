"""
Basalt Engineering Backend — FastAPI
Bazalt sendvich panellar va izolyatsiya uchun backend
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import asyncio
import logging

from app.core.config import settings
from app.core.database import init_db, close_db
from app.api import products, content, applications, analytics, admin, auth, media, chat, blog, cms, sections
from app.bot.bot import start_bot, stop_bot

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("basalt")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    log.info("🪨  Basalt backend ishga tushmoqda...")
    await init_db()
    # Telegram botni background taskda ishga tushuramiz
    bot_task = asyncio.create_task(start_bot())
    log.info("✅ Backend tayyor!")
    yield
    # Shutdown
    log.info("Backend to'xtatilmoqda...")
    await stop_bot()
    bot_task.cancel()
    try:
        await bot_task
    except asyncio.CancelledError:
        pass
    await close_db()


app = FastAPI(
    title="Basalt Engineering API",
    description="Sendvich panellar va bazalt izolyatsiya uchun API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files (yuklangan rasmlar)
app.mount("/media", StaticFiles(directory=settings.MEDIA_DIR), name="media")

# API routerlar
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(applications.router, prefix="/api/applications", tags=["applications"])
app.include_router(content.router, prefix="/api/content", tags=["content"])
app.include_router(media.router, prefix="/api/media", tags=["media"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(blog.router, prefix="/api")
app.include_router(cms.router, prefix="/api")
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(sections.router, prefix="/api/sections", tags=["sections"])


@app.get("/")
async def root():
    return {"app": "Basalt Engineering API", "status": "ok", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


# Tracking middleware — har bir API so'rovini kuzatish
@app.middleware("http")
async def track_visits(request: Request, call_next):
    response = await call_next(request)
    # Faqat sahifa ko'rishlarni hisoblash (frontend tracking endpoint orqali)
    return response
