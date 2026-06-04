# Basalt UZ — Sandvich panellar va bazalt izolyatsiya saytı

Zamonaviy landing page + admin panel + backend + Telegram bot. Hammasi bitta `docker-compose` orqali ishga tushadi.

## 🎨 Texnologiyalar

| Qism | Stack |
|---|---|
| **Backend** | Python 3.12, FastAPI, SQLAlchemy 2 (async), PostgreSQL 16, Redis |
| **Sayt (Frontend)** | Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion |
| **Admin panel** | Next.js 14, Recharts, SWR |
| **Bot** | aiogram 3 (FastAPI bilan bitta jarayonda) |
| **Chat** | WebSocket + Telegram bilan sinxron |
| **Reverse proxy** | nginx |

## 🚀 Tez ishga tushirish

### 1. Konfiguratsiya
```bash
cp .env.example .env
nano .env   # Telegram token va parollarni kiriting
```

`.env` faylidagi quyidagilarni o'zgartiring:
- `SECRET_KEY` — JWT uchun maxfiy kalit (uzun va tasodifiy)
- `ADMIN_PASSWORD` — admin panel paroli
- `POSTGRES_PASSWORD` — bazaning paroli
- `TELEGRAM_BOT_TOKEN` — @BotFather'dan olingan token
- `TELEGRAM_ADMIN_CHAT_ID` — arizalar kelguvchi chat ID

### 2. Build & Up
```bash
docker compose build
docker compose up -d
```

Birinchi marta ishga tushirilganda baza avtomatik yaratilib, namunaviy ma'lumotlar bilan to'ldiriladi.

### 3. Tekshirish
```bash
docker compose ps
docker compose logs -f backend
```

## 🌐 Ochiq manzillar

`HTTP_PORT=80` bo'lganda:

| Sahifa | URL |
|---|---|
| Asosiy sayt | http://localhost/ |
| Admin panel | http://localhost/admin/ |
| API hujjatlar | http://localhost/api/docs |

Yoki to'g'ridan-to'g'ri:
- Frontend → http://localhost:3000
- Admin → http://localhost:3001
- Backend → http://localhost:8000

## 🔐 Admin paneliga kirish

URL: **http://localhost/admin/**

Standart kirish ma'lumotlari `.env`'dan o'qiladi:
- Login: `admin`
- Parol: `admin123` (ishlab chiqarishda albatta o'zgartiring!)

## 📱 Telegram bot sozlash

1. [@BotFather](https://t.me/BotFather) bilan yangi bot yarating
2. Tokenni `.env`'dagi `TELEGRAM_BOT_TOKEN`'ga qo'ying
3. [@userinfobot](https://t.me/userinfobot) yordamida o'z Telegram ID'ingizni bilib oling
4. ID'ni `TELEGRAM_ADMIN_CHAT_ID`'ga qo'ying
5. `docker compose restart backend`

Bot quyidagilarni qiladi:
- Botga `/start` yuborilsa, ariza qoldirish dialogini boshlaydi (ism → telefon → mahsulot → izoh)
- Saytdan kelgan arizalarni admin chatga jo'natadi
- Saytdagi chat widgetidan kelgan xabarlarni admin chatga jo'natadi va javoblarni qaytaradi

## 🌍 Til (multilingual)

Sayt 3 tilda: **O'zbekcha**, **Русский**, **English**.

Har bir matn admin panelda 3 ta til uchun alohida tahrirlanadi. Hududan boshqa yangi til qo'shish uchun modellardagi `_uz` / `_ru` / `_en` ustunlariga yana bittasini qo'shish va frontend i18n'da tilni ulash kifoya.

## 📊 Analitika

Admin panel quyidagi statistikalarni ko'rsatadi:
- **Hozir saytda** — oxirgi 5 daqiqada faol foydalanuvchilar
- **Sahifa ko'rishlar** — kunlik dinamika, top 10 sahifa
- **Top mahsulotlar** — eng ko'p ochilgan mahsulotlar
- **Qurilmalar** — desktop / mobile / tablet ulushi
- **Soatlik faollik**

Maxfiylik: IP manzillar SHA-256 bilan xeshlanadi, sessiya ID'lar anonim.

## 🛠 Ishlab chiqarishdan oldin

```bash
# Maxfiy kalit yaratish
openssl rand -hex 32

# Parolni o'zgartirish (admin panel orqali ham mumkin)
docker compose exec backend python -c "
from app.services.auth import hash_password
print(hash_password('NEW_PASSWORD'))
"

# Bazadan zaxira nusxa
docker compose exec db pg_dump -U basalt basalt > backup_$(date +%Y%m%d).sql
```

## 📁 Loyiha tuzilishi

```
basalt-project/
├── backend/              # FastAPI + bot
│   ├── app/
│   │   ├── api/          # Endpointlar (auth, products, applications, content...)
│   │   ├── bot/          # aiogram bot
│   │   ├── core/         # config, database
│   │   ├── models/       # SQLAlchemy modellari
│   │   ├── schemas/      # Pydantic sxemalari
│   │   ├── services/     # auth, seeder
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/             # Asosiy sayt (port 3000)
│   ├── app/              # Next.js App Router
│   ├── components/       # Navbar, Hero, Products, ...
│   ├── lib/              # api, i18n, lang-context
│   └── Dockerfile
├── admin/                # Admin panel (port 3001)
│   ├── app/              # dashboard, content, products, applications, ...
│   ├── components/       # Sidebar, AuthLayout
│   ├── lib/
│   └── Dockerfile
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🔧 Tez-tez uchraydigan vazifalar

**Loglarni ko'rish:**
```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f admin
```

**Qayta build qilish (kod o'zgartirilgandan keyin):**
```bash
docker compose up -d --build backend
docker compose up -d --build frontend admin
```

**Bazani tozalash va qaytadan boshlash:**
```bash
docker compose down -v
docker compose up -d --build
```

**Faqat backend'ni restart qilish:**
```bash
docker compose restart backend
```

## 🐛 Muammolarni hal qilish

**"Bot ishlamayapti" — admin chatga arizalar kelmayapti**
- `.env`'dagi `TELEGRAM_BOT_TOKEN` to'g'ri ekanligini tekshiring
- `TELEGRAM_ADMIN_CHAT_ID`'ni qayta tekshiring (boshida `-100...` bo'lishi mumkin guruh uchun)
- Botga avval `/start` yuborgan bo'lishingiz kerak (shaxsiy chat uchun)
- `docker compose logs backend | grep -i telegram`

**"Admin paneliga kira olmayapman"**
- `.env`'dagi `ADMIN_USERNAME` va `ADMIN_PASSWORD` to'g'ri yozilganini tekshiring
- Brauzerda `localStorage.clear()` qiling

**"Rasm yuklanmayapti"**
- `MAX_UPLOAD_SIZE_MB` ni oshiring
- `docker compose exec backend ls -la /app/media` orqali papkani tekshiring
- nginx `client_max_body_size` (default 25M) limitini tekshiring

## 📝 Litsenziya

Mualliflik huquqi © Basalt UZ. Barcha huquqlar himoyalangan.
