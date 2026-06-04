# ECO BASALT — Server Deploy

## Port arxitekturasi

| Servis | Container port | Host port | URL |
|---|---|---|---|
| Backend (FastAPI) | 8000 | **7000** | `http://localhost:7000` |
| Frontend (Next.js) | 3000 | **7001** | `http://localhost:7001` |
| Admin (Next.js) | 3001 | **7002** | `http://localhost:7002` |
| Nginx (ixtiyoriy) | 80 | 7080 | faqat `--profile with-nginx` bilan |

## 1. Loyihani serverga ko'chirish

```bash
git clone <your-repo> /opt/eco-basalt
cd /opt/eco-basalt
cp .env.example .env
nano .env   # SECRET_KEY, ADMIN_PASSWORD, TELEGRAM_BOT_TOKEN, DOMAIN ni yangilang
```

`SECRET_KEY` ni qayta tasodifiy yarating:
```bash
openssl rand -hex 32
```

## 2. Docker ishga tushirish

```bash
docker compose up -d --build
docker compose ps
# Backend 0.0.0.0:7000->8000
# Frontend 0.0.0.0:7001->3000
# Admin 0.0.0.0:7002->3001
```

Tekshirish:
```bash
curl http://localhost:7000/health     # {"status":"healthy"}
curl -I http://localhost:7001         # HTTP/1.1 200
curl -I http://localhost:7002         # HTTP/1.1 200
```

## 3. Host nginx (domain ulash)

Server'da nginx mavjud bo'lsa, `/etc/nginx/sites-available/eco-basalt.conf`:

```nginx
# Frontend (asosiy sayt)
server {
    listen 80;
    listen [::]:80;
    server_name ecobasalt.uz www.ecobasalt.uz;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:7001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # API frontend orqali proxy bo'ladi (Next.js rewrites)
    # Lekin to'g'ridan-to'g'ri /api yo'lini backend'ga yuborish ham mumkin:
    location /api/ {
        proxy_pass http://127.0.0.1:7000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # WebSocket (live chat)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }

    location /media/ {
        proxy_pass http://127.0.0.1:7000/media/;
        proxy_set_header Host $host;
    }
}

# Admin panel
server {
    listen 80;
    listen [::]:80;
    server_name admin.ecobasalt.uz;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:7002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /api/ {
        proxy_pass http://127.0.0.1:7000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /media/ {
        proxy_pass http://127.0.0.1:7000/media/;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/eco-basalt.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 4. HTTPS (Certbot — Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ecobasalt.uz -d www.ecobasalt.uz -d admin.ecobasalt.uz
```

Certbot avtomatik nginx config'ni HTTPS'ga o'tkazadi va auto-renewal sozlaydi.

## 5. DNS sozlash (domain registrator'da)

| Type | Name | Value |
|---|---|---|
| A | @ | <server-IP> |
| A | www | <server-IP> |
| A | admin | <server-IP> |

## 6. Foydali komandalar

```bash
# Loglar
docker compose logs -f backend
docker compose logs -f frontend

# Restart
docker compose restart backend

# Update (yangi kodga)
git pull
docker compose up -d --build

# Volume backup (DB + media)
docker run --rm -v basalt_data:/data -v $(pwd):/backup alpine tar czf /backup/basalt-data-$(date +%F).tar.gz -C /data .
docker run --rm -v basalt_media:/data -v $(pwd):/backup alpine tar czf /backup/basalt-media-$(date +%F).tar.gz -C /data .

# Stop (volume saqlanadi)
docker compose down

# To'liq tozalash (DIQQAT — volume ham o'chadi!)
docker compose down -v
```

## Xavfsizlik tekshiruvi

- [ ] `.env` da `SECRET_KEY` yangi tasodifiy (32+ belgi)
- [ ] `ADMIN_PASSWORD` o'zgartirilgan
- [ ] `CORS_ORIGINS` faqat real domenlardan iborat (`*` yo'q)
- [ ] HTTPS yoqilgan (Certbot)
- [ ] Server firewall (faqat 22, 80, 443 ochiq; 7000-7002 ichki)
- [ ] `docker compose` user (sudo'siz) sozlangan
- [ ] Volume backup'i jadval bilan (cron)
