"""Rasm va boshqa fayllarni yuklash"""
import os
import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.services.auth import require_admin

router = APIRouter()

ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".pdf", ".mp4"}


@router.post("/upload", dependencies=[Depends(require_admin)])
async def upload_file(file: UploadFile = File(...)):
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXT:
        raise HTTPException(400, f"Ruxsat etilmagan format: {ext}")

    # hajmi
    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(400, f"Fayl juda katta (>{settings.MAX_UPLOAD_SIZE_MB}MB)")

    # unique nom
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = Path(settings.MEDIA_DIR) / filename
    filepath.parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, "wb") as f:
        f.write(contents)

    return {
        "filename": filename,
        "url": f"/media/{filename}",
        "size": len(contents),
    }


@router.get("/list", dependencies=[Depends(require_admin)])
async def list_files():
    media_dir = Path(settings.MEDIA_DIR)
    files = []
    if media_dir.exists():
        for f in sorted(media_dir.iterdir(), key=lambda x: x.stat().st_mtime, reverse=True):
            if f.is_file():
                files.append({
                    "filename": f.name,
                    "url": f"/media/{f.name}",
                    "size": f.stat().st_size,
                })
    return files


@router.delete("/{filename}", dependencies=[Depends(require_admin)])
async def delete_file(filename: str):
    filepath = Path(settings.MEDIA_DIR) / filename
    if not filepath.exists() or not filepath.is_file():
        raise HTTPException(404)
    # path traversal himoyasi
    if not str(filepath.resolve()).startswith(str(Path(settings.MEDIA_DIR).resolve())):
        raise HTTPException(400)
    filepath.unlink()
    return {"ok": True}
