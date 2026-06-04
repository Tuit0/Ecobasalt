"""Konfiguratsiya — env'dan o'qiladi"""
from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    # Database — SQLite (fayl-bazasi)
    DATABASE_URL: str = "sqlite+aiosqlite:////app/data/basalt.db"

    # Security
    SECRET_KEY: str = "change-me-in-production-very-long-random-string"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 1 hafta

    # Admin (birinchi ishga tushishda yaratiladi)
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "admin123"

    # CORS — vergul bilan ajratilgan string sifatida qabul qilinadi
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001,http://localhost,*"

    @property
    def cors_origins_list(self) -> list[str]:
        return [s.strip() for s in self.CORS_ORIGINS.split(",") if s.strip()]

    # Media
    MEDIA_DIR: str = "/app/media"
    MAX_UPLOAD_SIZE_MB: int = 20

    # Telegram bot
    TELEGRAM_BOT_TOKEN: str = ""
    TELEGRAM_ADMIN_CHAT_ID: str = ""  # arizalar shu chatga keladi

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()

# Media va data papkalarini yaratib qo'yamiz
Path(settings.MEDIA_DIR).mkdir(parents=True, exist_ok=True)
# SQLite fayl uchun papka (sqlite+aiosqlite:////app/data/basalt.db formatidan yo'lni olamiz)
if settings.DATABASE_URL.startswith("sqlite"):
    db_path = settings.DATABASE_URL.split("///")[-1]
    Path(db_path).parent.mkdir(parents=True, exist_ok=True)
