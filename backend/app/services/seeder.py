"""Boshlang'ich kontent — birinchi ishga tushganda yuklanadi (ECO BASALT)"""
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.content import ContentBlock, HeroSlide, Project
from app.models.product import Category, Product
from app.models.cms import BlogPost, FAQ, Feature, Client, CalculatorProduct, ComparisonRow


# Bu keylar mavjud bo'lsa ham majburiy yangilanadi (mijoz feedback'i asosida)
# Buni saqlash — agar admin CMS'dan aynan shu blokni tahrirlasa, oldindan kelishilgan
# yangilanish qaytmasligi uchun kalitni bu ro'yxatdan olib tashlash kerak.
FORCED_UPDATE_KEYS = {
    "hero.title",
    "hero.subtitle",
}


DEFAULT_CONTENT = [
    # Hero
    {"key": "hero.eyebrow", "section": "hero", "label": "Hero — kichik label", "block_type": "multilang",
     "value": {"uz": "BAZALT TEXNOLOGIYALARI",
               "ru": "БАЗАЛЬТОВЫЕ ТЕХНОЛОГИИ",
               "en": "BASALT TECHNOLOGIES"}},
    {"key": "hero.title", "section": "hero", "label": "Hero — sarlavha", "block_type": "multilang",
     "value": {"uz": "Tabiat kuchi\nzamonaviy texnologiyalarda",
               "ru": "Сила природы\nв современных технологиях",
               "en": "The power of nature\nin modern technology"}},
    {"key": "hero.subtitle", "section": "hero", "label": "Hero — qisqacha matn", "block_type": "multilang",
     "value": {"uz": "Tabiiy bazalt asosida issiqlik izolyatsiya materiallari va gidroponika substratlarini ishlab chiqarish.",
               "ru": "Производство теплоизоляционных материалов и гидропонных субстратов на основе природного базальта.",
               "en": "Manufacturing thermal insulation materials and hydroponic substrates based on natural basalt."}},

    # About
    {"key": "about.eyebrow", "section": "about", "label": "About — kichik label", "block_type": "multilang",
     "value": {"uz": "BIZ HAQIMIZDA", "ru": "О КОМПАНИИ", "en": "ABOUT US"}},
    {"key": "about.title", "section": "about", "label": "About — sarlavha", "block_type": "multilang",
     "value": {"uz": "O'zbekistondagi yetakchi bazalt mahsulotlari ishlab chiqaruvchisi",
               "ru": "Ведущий производитель базальтовой продукции в Узбекистане",
               "en": "The leading basalt-products manufacturer in Uzbekistan"}},
    {"key": "about.body", "section": "about", "label": "About — asosiy matn", "block_type": "multilang",
     "value": {"uz": "15 yildan ortiq tajribamiz bilan biz sanoat ob'ektlari, omborlar, ishlab chiqarish binolari va xususiy uy-joylar uchun yuqori sifatli sendvich panellar, bazalt izolyatsiya va bazalt tola taqdim etamiz. Bizning mahsulotlarimiz Yevropa standartlariga javob beradi.",
               "ru": "Более 15 лет мы поставляем высококачественные сэндвич-панели, базальтовую изоляцию и базальтовое волокно для промышленных объектов, складов, производственных зданий и частных домов. Наша продукция соответствует европейским стандартам.",
               "en": "With more than 15 years of experience, we deliver premium sandwich panels, basalt insulation and basalt fiber for industrial facilities, warehouses, production plants and private housing. Our products meet European quality standards."}},

    # Stats
    {"key": "stats.years", "section": "stats", "label": "Statistika — Yillar (raqam)", "block_type": "text", "value": "15"},
    {"key": "stats.years_label", "section": "stats", "label": "Statistika — Yillar (label)", "block_type": "multilang",
     "value": {"uz": "yillik tajriba", "ru": "лет опыта", "en": "years of experience"}},
    {"key": "stats.projects", "section": "stats", "label": "Statistika — Loyihalar (raqam)", "block_type": "text", "value": "2500"},
    {"key": "stats.projects_label", "section": "stats", "label": "Statistika — Loyihalar (label)", "block_type": "multilang",
     "value": {"uz": "tugatilgan loyihalar", "ru": "завершённых проектов", "en": "completed projects"}},
    {"key": "stats.area", "section": "stats", "label": "Statistika — Maydon (raqam)", "block_type": "text", "value": "850000"},
    {"key": "stats.area_label", "section": "stats", "label": "Statistika — Maydon (label)", "block_type": "multilang",
     "value": {"uz": "qoplangan maydon m²", "ru": "покрытая площадь м²", "en": "area covered m²"}},
    {"key": "stats.clients", "section": "stats", "label": "Statistika — Mijozlar (raqam)", "block_type": "text", "value": "320"},
    {"key": "stats.clients_label", "section": "stats", "label": "Statistika — Mijozlar (label)", "block_type": "multilang",
     "value": {"uz": "doimiy mijozlar", "ru": "постоянных клиентов", "en": "loyal clients"}},

    # Contact
    {"key": "contact.phone", "section": "contact", "label": "Telefon", "block_type": "text", "value": "+998 90 123 45 67"},
    {"key": "contact.email", "section": "contact", "label": "Email", "block_type": "text", "value": "info@ecobasalt.uz"},
    {"key": "contact.address", "section": "contact", "label": "Manzil", "block_type": "multilang",
     "value": {"uz": "Toshkent sh., Yangihayot tumani, Sanoat ko'chasi 12",
               "ru": "г. Ташкент, Янгихаётский район, ул. Промышленная 12",
               "en": "Tashkent, Yangihayot district, Industrial st. 12"}},
    {"key": "contact.telegram", "section": "contact", "label": "Telegram link", "block_type": "text", "value": "https://t.me/eco_basalt"},
    {"key": "contact.instagram", "section": "contact", "label": "Instagram", "block_type": "text", "value": "https://instagram.com/eco.basalt"},
    {"key": "contact.youtube", "section": "contact", "label": "YouTube", "block_type": "text", "value": "https://youtube.com/@ecobasalt"},
    {"key": "contact.facebook", "section": "contact", "label": "Facebook", "block_type": "text", "value": "#"},
    {"key": "contact.working_hours", "section": "contact", "label": "Ish vaqti", "block_type": "multilang",
     "value": {"uz": "Du-Sh: 9:00 — 18:00", "ru": "Пн-Сб: 9:00 — 18:00", "en": "Mon-Sat: 9:00 — 18:00"}},

    # SEO
    {"key": "seo.title", "section": "seo", "label": "Sayt sarlavhasi (title)", "block_type": "multilang",
     "value": {"uz": "ECO BASALT — Sendvich panellar va bazalt izolyatsiya",
               "ru": "ECO BASALT — Сэндвич-панели и базальтовая изоляция",
               "en": "ECO BASALT — Sandwich panels & basalt insulation"}},
    {"key": "seo.description", "section": "seo", "label": "Meta tavsif", "block_type": "multilang",
     "value": {"uz": "Yong'inga chidamli sendvich panellar, bazalt izolyatsiya va tola. O'zbekistondagi yetakchi ishlab chiqaruvchi.",
               "ru": "Огнестойкие сэндвич-панели, базальтовая изоляция и волокно. Ведущий производитель в Узбекистане.",
               "en": "Fire-resistant sandwich panels, basalt insulation and fiber. Leading manufacturer in Uzbekistan."}},
]


DEFAULT_CATEGORIES = [
    {"slug": "sandwich-panels", "name_uz": "Sendvich panellar", "name_ru": "Сэндвич-панели", "name_en": "Sandwich panels",
     "description_uz": "Devor va tom uchun sendvich panellar — bazalt tola yadrosi bilan.",
     "description_ru": "Сэндвич-панели для стен и кровли — с базальтовым волокном.",
     "description_en": "Wall and roof sandwich panels — with basalt fiber core.",
     "icon": "Layers", "order": 1},
    {"slug": "rockwool-insulation", "name_uz": "Bazalt izolyatsiya", "name_ru": "Базальтовая изоляция", "name_en": "Basalt insulation",
     "description_uz": "Quvur, devor va shaxta uchun bazalt tola izolyatsiyasi.",
     "description_ru": "Базальтовая изоляция для труб, стен и шахт.",
     "description_en": "Basalt fiber insulation for pipes, walls and shafts.",
     "icon": "Flame", "order": 2},
    {"slug": "basalt-fiber", "name_uz": "Bazalt tola", "name_ru": "Базальтовое волокно", "name_en": "Basalt fiber",
     "description_uz": "Texnik to'qimachilik va kompozitlar uchun bazalt tola.",
     "description_ru": "Базальтовое волокно для технического текстиля и композитов.",
     "description_en": "Basalt fiber for technical textiles and composites.",
     "icon": "Atom", "order": 3},
    {"slug": "accessories", "name_uz": "Aksessuarlar", "name_ru": "Аксессуары", "name_en": "Accessories",
     "description_uz": "O'rnatish uchun vintlar, profillar va yordamchi materiallar.",
     "description_ru": "Винты, профили и вспомогательные материалы для монтажа.",
     "description_en": "Screws, profiles and accessories for installation.",
     "icon": "Wrench", "order": 4},
]


DEFAULT_PRODUCTS = [
    # Sandwich Panels (3 ta)
    {
        "slug": "roof-sandwich-panel", "category_slug": "sandwich-panels",
        "name_uz": "Tom sendvich panel (RAL 5005)", "name_ru": "Кровельная сэндвич-панель (RAL 5005)", "name_en": "Roof sandwich panel (RAL 5005)",
        "short_uz": "Bazalt tola yadroli ko'k tomli panel",
        "short_ru": "Кровельная панель с базальтовым волокном",
        "short_en": "Roof panel with basalt fiber core",
        "description_uz": "Sanoat va omborlar uchun tomli sendvich panel. Beshta to'lqinli profil, ko'k rang.",
        "description_ru": "Кровельная сэндвич-панель для промышленности и складов. Пятиволновой профиль.",
        "description_en": "Roof sandwich panel for industry and warehouses. Five-wave profile.",
        "specs": {"qalinligi": "50-200mm", "EI": "240", "λ": "0.035 W/m·K", "kenglik": "1000mm"},
        "is_featured": True, "price_from": 25, "price_currency": "USD/m²", "order": 1
    },
    {
        "slug": "wall-sandwich-panel", "category_slug": "sandwich-panels",
        "name_uz": "Devor sendvich panel", "name_ru": "Стеновая сэндвич-панель", "name_en": "Wall sandwich panel",
        "short_uz": "Yashirin biriktirgichli devor paneli",
        "short_ru": "Стеновая панель со скрытым креплением",
        "short_en": "Wall panel with hidden fastening",
        "description_uz": "Sovuq saqlash xonalari va sanoat ob'ektlari uchun. Yashirin biriktirish.",
        "description_ru": "Для холодильных камер и промышленных объектов. Скрытое крепление.",
        "description_en": "For cold storage and industrial facilities. Hidden fastening.",
        "specs": {"qalinligi": "50-250mm", "EI": "240", "λ": "0.034 W/m·K", "kenglik": "1190mm"},
        "is_featured": True, "price_from": 28, "price_currency": "USD/m²", "order": 2
    },
    {
        "slug": "fridge-sandwich-panel", "category_slug": "sandwich-panels",
        "name_uz": "Soviqxona paneli (250mm)", "name_ru": "Холодильная панель (250мм)", "name_en": "Cold storage panel (250mm)",
        "short_uz": "Past haroratlar uchun maxsus panel",
        "short_ru": "Специальная панель для низких температур",
        "short_en": "Specialised panel for low temperatures",
        "description_uz": "-25°C dan +50°C gacha. Soviqxona, muzlatkich, oziq-ovqat ombori.",
        "description_ru": "От -25°C до +50°C. Холодильники, морозильники, пищевые склады.",
        "description_en": "From -25°C to +50°C. Refrigerators, freezers, food storage.",
        "specs": {"qalinligi": "150-250mm", "EI": "240", "harorat": "-25...+50°C", "λ": "0.033"},
        "is_featured": True, "price_from": 42, "price_currency": "USD/m²", "order": 3
    },

    # Rockwool Insulation (2 ta)
    {
        "slug": "pipe-insulation-cylinder", "category_slug": "rockwool-insulation",
        "name_uz": "Quvur izolyatsiya silindrlari", "name_ru": "Цилиндры для изоляции труб", "name_en": "Pipe insulation cylinders",
        "short_uz": "Silindr shaklidagi quvur izolyatsiyasi",
        "short_ru": "Цилиндры для изоляции труб",
        "short_en": "Cylindrical pipe insulation",
        "description_uz": "Issiqlik va sovuq quvurlari uchun bazalt silindrlar.",
        "description_ru": "Базальтовые цилиндры для тепловых и холодных труб.",
        "description_en": "Basalt cylinders for hot and cold pipelines.",
        "specs": {"diametri": "18-273mm", "qalinligi": "20-100mm", "harorat": "-180...+650°C", "zichlik": "100 kg/m³"},
        "is_featured": True, "price_from": 4, "price_currency": "USD/m", "order": 4
    },
    {
        "slug": "rockwool-slab", "category_slug": "rockwool-insulation",
        "name_uz": "Bazalt izolyatsiya plitalari", "name_ru": "Базальтовые плиты", "name_en": "Basalt insulation slabs",
        "short_uz": "Devor va shift uchun bazalt plitalar",
        "short_ru": "Базальтовые плиты для стен и потолков",
        "short_en": "Basalt slabs for walls and ceilings",
        "description_uz": "100-200kg/m³ zichlikdagi plitalar. Bino izolyatsiyasi uchun.",
        "description_ru": "Плиты плотностью 100-200кг/м³. Для теплоизоляции зданий.",
        "description_en": "Slabs with density 100-200kg/m³. For building insulation.",
        "specs": {"qalinligi": "50-200mm", "zichlik": "100-200 kg/m³", "λ": "0.036 W/m·K", "yongin": "A1"},
        "is_featured": False, "price_from": 6, "price_currency": "USD/m²", "order": 5
    },

    # Basalt Fiber (2 ta)
    {
        "slug": "basalt-roving", "category_slug": "basalt-fiber",
        "name_uz": "Bazalt roving", "name_ru": "Базальтовый ровинг", "name_en": "Basalt roving",
        "short_uz": "Kompozit materiallar uchun uzluksiz tola",
        "short_ru": "Непрерывное волокно для композитов",
        "short_en": "Continuous fiber for composites",
        "description_uz": "Yuqori mustahkamlikdagi bazalt roving. Beton armaturasi, kompozit materiallar.",
        "description_ru": "Высокопрочный базальтовый ровинг. Армирование бетона, композиты.",
        "description_en": "High-strength basalt roving. Concrete reinforcement, composites.",
        "specs": {"tex": "300-4800", "diametri": "9-17μm", "mustahkamlik": "4000 MPa"},
        "is_featured": True, "price_from": 3.5, "price_currency": "USD/kg", "order": 6
    },
    {
        "slug": "basalt-chopped", "category_slug": "basalt-fiber",
        "name_uz": "Maydalangan bazalt tola", "name_ru": "Рубленое базальтовое волокно", "name_en": "Chopped basalt fiber",
        "short_uz": "Beton va asfalt uchun mikro tola",
        "short_ru": "Микроволокно для бетона и асфальта",
        "short_en": "Microfiber for concrete and asphalt",
        "description_uz": "3-24mm uzunlikdagi maydalangan bazalt tola. Beton mustahkamlash.",
        "description_ru": "Рубленое базальтовое волокно длиной 3-24мм. Усиление бетона.",
        "description_en": "Chopped basalt fiber 3-24mm. Concrete reinforcement.",
        "specs": {"uzunligi": "3-24mm", "diametri": "13-17μm", "kg_qop": "20kg"},
        "is_featured": False, "price_from": 4, "price_currency": "USD/kg", "order": 7
    },

    # Accessories (1 ta)
    {
        "slug": "fasteners-set", "category_slug": "accessories",
        "name_uz": "O'rnatish to'plamlari", "name_ru": "Монтажные наборы", "name_en": "Installation kits",
        "short_uz": "Sendvich panel uchun vintlar va profillar",
        "short_ru": "Винты и профили для сэндвич-панелей",
        "short_en": "Screws and profiles for sandwich panels",
        "description_uz": "Sendvich panel o'rnatish uchun barcha kerakli aksessuarlar.",
        "description_ru": "Все необходимые аксессуары для монтажа сэндвич-панелей.",
        "description_en": "All necessary accessories for sandwich panel installation.",
        "specs": {"vint": "5.5×60", "profil": "U/Z/L", "rang": "RAL"},
        "is_featured": False, "price_from": 0.2, "price_currency": "USD/dona", "order": 8
    },
]


DEFAULT_PROJECTS = [
    {
        "slug": "magnit-warehouse",
        "title_uz": "Magnit logistika markazi", "title_ru": "Логистический центр Magnit", "title_en": "Magnit logistics center",
        "description_uz": "12 000 m² maydonli ombor binosi. Devor va tom uchun 150mm bazalt sendvich panellari ishlatildi.",
        "description_ru": "Складское здание площадью 12 000 м². Использованы базальтовые сэндвич-панели 150мм для стен и кровли.",
        "description_en": "12,000 m² warehouse facility. 150mm basalt sandwich panels used for walls and roof.",
        "location": "Toshkent", "year": 2024, "area_m2": 12000, "is_featured": True, "order": 1
    },
    {
        "slug": "artel-factory",
        "title_uz": "Artel ishlab chiqarish sexi", "title_ru": "Производственный цех Artel", "title_en": "Artel production plant",
        "description_uz": "Maishiy texnika ishlab chiqarish zavodi. 8500 m² sendvich panel devorlar va tomlar.",
        "description_ru": "Завод по производству бытовой техники. 8500 м² сэндвич-панельные стены и кровля.",
        "description_en": "Home appliance manufacturing plant. 8500 m² sandwich panel walls and roof.",
        "location": "Toshkent", "year": 2023, "area_m2": 8500, "is_featured": True, "order": 2
    },
    {
        "slug": "agro-cold-storage",
        "title_uz": "Agro Cold meva-sabzavot ombori", "title_ru": "Холодильное хранилище Agro Cold", "title_en": "Agro Cold fruit storage",
        "description_uz": "Sovuq saqlash kompleksi. 250mm qalinlikdagi soviqxona panellari, -2°C harorat.",
        "description_ru": "Комплекс холодильного хранения. Холодильные панели 250мм, температура -2°C.",
        "description_en": "Cold storage complex. 250mm cold-storage panels, -2°C operating temp.",
        "location": "Samarqand", "year": 2024, "area_m2": 4200, "is_featured": True, "order": 3
    },
    {
        "slug": "kia-service-center",
        "title_uz": "Korea Auto servis markazi", "title_ru": "Сервисный центр Korea Auto", "title_en": "Korea Auto service center",
        "description_uz": "Avtomobil servisi va omborlari. Yong'inga chidamli EI 240 panellar.",
        "description_ru": "Автомобильный сервис и склады. Огнестойкие панели EI 240.",
        "description_en": "Automotive service and warehouses. Fire-resistant EI 240 panels.",
        "location": "Andijon", "year": 2023, "area_m2": 6800, "is_featured": False, "order": 4
    },
    {
        "slug": "biofarm-plant",
        "title_uz": "Biokimyo farmatsevtika zavodi", "title_ru": "Фармацевтический завод Biokimyo", "title_en": "Biokimyo pharmaceutical plant",
        "description_uz": "GMP standartiga mos farmatsevtika ishlab chiqarish. Toza xonalar uchun sterile panellar.",
        "description_ru": "Фармпроизводство GMP. Стерильные панели для чистых помещений.",
        "description_en": "GMP-compliant pharma production. Sterile panels for clean rooms.",
        "location": "Toshkent", "year": 2025, "area_m2": 5500, "is_featured": True, "order": 5
    },
    {
        "slug": "ferghana-mall",
        "title_uz": "Farg'ona savdo markazi", "title_ru": "Торговый центр Фергана", "title_en": "Fergana shopping mall",
        "description_uz": "Zamonaviy savdo majmuasi fasadi. 100mm dekorativ sendvich panellari, RAL ranglar.",
        "description_ru": "Фасад современного ТРЦ. Декоративные сэндвич-панели 100мм, цвета RAL.",
        "description_en": "Modern shopping mall facade. 100mm decorative sandwich panels, RAL colors.",
        "location": "Farg'ona", "year": 2024, "area_m2": 9200, "is_featured": False, "order": 6
    },
]


DEFAULT_FEATURES = [
    {"key": "fire", "icon": "Flame", "order": 1,
     "title_uz": "Yong'inga chidamli", "title_ru": "Огнестойкость", "title_en": "Fire Resistant",
     "description_uz": "EI 60 – EI 240 darajagacha yong'inga chidamlilik. 1000°C dan yuqori haroratga bardosh beradi.",
     "description_ru": "Стойкость к огню до EI 60 – EI 240. Выдерживает температуры выше 1000°C.",
     "description_en": "Fire resistance rated EI 60 – EI 240. Withstands temperatures above 1000°C."},
    {"key": "eco", "icon": "Leaf", "order": 2,
     "title_uz": "Ekologik toza", "title_ru": "Экологичность", "title_en": "Eco-Friendly",
     "description_uz": "100% tabiiy bazalt toshidan. Zararli moddalardan xoli, qayta ishlanadi.",
     "description_ru": "100% натуральный базальт. Без вредных веществ, перерабатывается.",
     "description_en": "100% natural basalt rock. Free of harmful substances, recyclable."},
    {"key": "strong", "icon": "Shield", "order": 3,
     "title_uz": "Mustahkam tuzilma", "title_ru": "Прочная конструкция", "title_en": "Strong Structure",
     "description_uz": "Po'lat qoplamali sendvich panellar — yuqori qattiqlik va mexanik bardoshlik.",
     "description_ru": "Сэндвич-панели со стальным покрытием — высокая жёсткость.",
     "description_en": "Steel-clad sandwich panels — high rigidity and durability."},
    {"key": "thermal", "icon": "Snowflake", "order": 4,
     "title_uz": "Issiqlik izolyatsiyasi", "title_ru": "Теплоизоляция", "title_en": "Thermal Insulation",
     "description_uz": "λ = 0.035–0.040 W/m·K. Qishda issiq, yozda salqin — energiya tejash.",
     "description_ru": "λ = 0.035–0.040 Вт/м·К. Тепло зимой, прохладно летом.",
     "description_en": "λ = 0.035–0.040 W/m·K. Warm in winter, cool in summer."},
    {"key": "acoustic", "icon": "Volume2", "order": 5,
     "title_uz": "Ovoz yutish", "title_ru": "Звукопоглощение", "title_en": "Sound Absorption",
     "description_uz": "Tovushni 45 dB gacha yutadi — sanoat va ofis binolari uchun ideal.",
     "description_ru": "Поглощает шум до 45 дБ — идеально для зданий.",
     "description_en": "Absorbs up to 45 dB of noise — ideal for buildings."},
    {"key": "durable", "icon": "Hourglass", "order": 6,
     "title_uz": "Uzoq xizmat", "title_ru": "Долговечность", "title_en": "Long Service Life",
     "description_uz": "50+ yil xizmat muddati. Chirimaydi, zang bosmaydi.",
     "description_ru": "Срок службы 50+ лет. Не гниёт, не ржавеет.",
     "description_en": "50+ year service life. Doesn't rot or rust."},
]


DEFAULT_FAQS = [
    {"category": "general", "order": 1,
     "question_uz": "Sendvich panel umumi xizmat muddati qancha?",
     "question_ru": "Какой срок службы сэндвич-панелей?",
     "question_en": "What is the service life of sandwich panels?",
     "answer_uz": "To'g'ri montaj va parvarish qilingan holda bazalt yadroli sendvich panellar 50+ yil xizmat qiladi.",
     "answer_ru": "При правильном монтаже базальтовые сэндвич-панели служат 50+ лет.",
     "answer_en": "With proper installation, basalt-core sandwich panels last 50+ years."},
    {"category": "technical", "order": 2,
     "question_uz": "Yong'inga chidamlilik darajasi nima?",
     "question_ru": "Какая степень огнестойкости?",
     "question_en": "What is the fire resistance rating?",
     "answer_uz": "Bazalt asosli panellarimiz EI 240 darajagacha sertifikatlangan — 4 soatgacha yong'inga chidaydi. A1 yong'in klassi.",
     "answer_ru": "Наши панели сертифицированы до EI 240 — выдерживают 4 часа огня. Класс A1.",
     "answer_en": "Our basalt panels are certified up to EI 240 — withstand fire for 4 hours. Class A1."},
    {"category": "delivery", "order": 3,
     "question_uz": "Yetkazib berish va montaj muddati?",
     "question_ru": "Сроки доставки и монтажа?",
     "question_en": "What are delivery and installation timelines?",
     "answer_uz": "Standart mahsulotlar uchun 3-5 ish kuni, maxsus o'lchamlar 10-14 kun. Montaj 7-30 kun.",
     "answer_ru": "Стандартные: 3-5 дней, индивидуальные: 10-14 дней. Монтаж 7-30 дней.",
     "answer_en": "Standard: 3-5 days, custom: 10-14 days. Installation 7-30 days."},
    {"category": "pricing", "order": 4,
     "question_uz": "Minimal buyurtma hajmi bormi?",
     "question_ru": "Есть ли минимальный объём заказа?",
     "question_en": "Is there a minimum order quantity?",
     "answer_uz": "Yo'q, biz 50 m² dan 10,000+ m² gacha loyihalar bilan ishlaymiz.",
     "answer_ru": "Нет, работаем с проектами от 50 м² до 10,000+ м².",
     "answer_en": "No, we work with projects from 50 m² to 10,000+ m²."},
    {"category": "general", "order": 5,
     "question_uz": "Qanday sertifikatlaringiz bor?",
     "question_ru": "Какие у вас сертификаты?",
     "question_en": "What certifications do you have?",
     "answer_uz": "GOST 30247, ISO 9001:2015, EN 14509, DSTU 9001, sanitar-gigiyena sertifikatlari.",
     "answer_ru": "ГОСТ 30247, ISO 9001:2015, EN 14509, ДСТУ 9001.",
     "answer_en": "GOST 30247, ISO 9001:2015, EN 14509, DSTU 9001."},
    {"category": "general", "order": 6,
     "question_uz": "Kafolat muddati qancha?",
     "question_ru": "Какой срок гарантии?",
     "question_en": "What is the warranty period?",
     "answer_uz": "Mahsulotga 10 yillik kafolat, montaj ishlariga 3 yillik kafolat.",
     "answer_ru": "10 лет гарантии на продукцию, 3 года на монтаж.",
     "answer_en": "10-year product warranty, 3-year installation warranty."},
]


DEFAULT_CLIENTS = [
    {"name": "ARTEL", "order": 1},
    {"name": "AKFA", "order": 2},
    {"name": "UZBEKINVEST", "order": 3},
    {"name": "MAGNIT", "order": 4},
    {"name": "KOREA AUTO", "order": 5},
    {"name": "BIOKIMYO", "order": 6},
    {"name": "UZAVTOSANOAT", "order": 7},
    {"name": "POYTAKHT", "order": 8},
]


DEFAULT_CALC_PRODUCTS = [
    {
        "code": "wall", "order": 1,
        "label_uz": "Devor paneli", "label_ru": "Стеновая панель", "label_en": "Wall panel",
        "base_price": 18.0, "unit": "USD/m²",
        "thicknesses": [50, 80, 100, 120, 150, 200, 250],
        "default_thickness": 100,
    },
    {
        "code": "roof", "order": 2,
        "label_uz": "Tom paneli", "label_ru": "Кровельная панель", "label_en": "Roof panel",
        "base_price": 22.0, "unit": "USD/m²",
        "thicknesses": [50, 80, 100, 120, 150, 200, 250],
        "default_thickness": 100,
    },
    {
        "code": "fridge", "order": 3,
        "label_uz": "Soviqxona paneli", "label_ru": "Холодильная панель", "label_en": "Cold storage panel",
        "base_price": 28.0, "unit": "USD/m²",
        "thicknesses": [100, 120, 150, 200, 250],
        "default_thickness": 150,
    },
    {
        "code": "rockwool", "order": 4,
        "label_uz": "Bazalt izolyatsiya", "label_ru": "Базальтовая изоляция", "label_en": "Basalt insulation",
        "base_price": 6.0, "unit": "USD/m²",
        "thicknesses": [50, 80, 100, 150, 200],
        "default_thickness": 100,
    },
]


DEFAULT_COMPARISON_ROWS = [
    {
        "feature_uz": "Yong'inga chidamlilik", "feature_ru": "Огнестойкость", "feature_en": "Fire resistance",
        "basalt_value_uz": "EI 240 (A1)", "basalt_value_ru": "EI 240 (A1)", "basalt_value_en": "EI 240 (Class A1)", "basalt_type": "good",
        "pir_value_uz": "EI 30", "pir_value_ru": "EI 30", "pir_value_en": "EI 30", "pir_type": "neutral",
        "pur_value_uz": "Yonadi (B-s2)", "pur_value_ru": "Горит (B-s2)", "pur_value_en": "Burns (B-s2)", "pur_type": "bad",
        "eps_value_uz": "Yonadi (E)", "eps_value_ru": "Горит (E)", "eps_value_en": "Burns (E)", "eps_type": "bad",
        "order": 1,
    },
    {
        "feature_uz": "Issiqlik o'tkazuvchanligi (W/m·K)", "feature_ru": "Теплопроводность (Вт/м·К)", "feature_en": "Thermal conductivity (W/m·K)",
        "basalt_value_uz": "0.035-0.040", "basalt_value_ru": "0.035-0.040", "basalt_value_en": "0.035-0.040", "basalt_type": "good",
        "pir_value_uz": "0.022", "pir_value_ru": "0.022", "pir_value_en": "0.022", "pir_type": "good",
        "pur_value_uz": "0.024", "pur_value_ru": "0.024", "pur_value_en": "0.024", "pur_type": "good",
        "eps_value_uz": "0.038", "eps_value_ru": "0.038", "eps_value_en": "0.038", "eps_type": "neutral",
        "order": 2,
    },
    {
        "feature_uz": "Xizmat muddati", "feature_ru": "Срок службы", "feature_en": "Service life",
        "basalt_value_uz": "50+ yil", "basalt_value_ru": "50+ лет", "basalt_value_en": "50+ years", "basalt_type": "good",
        "pir_value_uz": "25 yil", "pir_value_ru": "25 лет", "pir_value_en": "25 years", "pir_type": "neutral",
        "pur_value_uz": "20 yil", "pur_value_ru": "20 лет", "pur_value_en": "20 years", "pur_type": "neutral",
        "eps_value_uz": "15 yil", "eps_value_ru": "15 лет", "eps_value_en": "15 years", "eps_type": "bad",
        "order": 3,
    },
    {
        "feature_uz": "Tovush izolatsiyasi", "feature_ru": "Звукоизоляция", "feature_en": "Sound insulation",
        "basalt_value_uz": "45 dB", "basalt_value_ru": "45 дБ", "basalt_value_en": "45 dB", "basalt_type": "good",
        "pir_value_uz": "25 dB", "pir_value_ru": "25 дБ", "pir_value_en": "25 dB", "pir_type": "neutral",
        "pur_value_uz": "22 dB", "pur_value_ru": "22 дБ", "pur_value_en": "22 dB", "pur_type": "neutral",
        "eps_value_uz": "20 dB", "eps_value_ru": "20 дБ", "eps_value_en": "20 dB", "eps_type": "bad",
        "order": 4,
    },
    {
        "feature_uz": "Ekologiya", "feature_ru": "Экологичность", "feature_en": "Eco-friendliness",
        "basalt_value_uz": "100% tabiiy", "basalt_value_ru": "100% натуральный", "basalt_value_en": "100% natural", "basalt_type": "good",
        "pir_value_uz": "Kimyoviy", "pir_value_ru": "Химия", "pir_value_en": "Chemical", "pir_type": "bad",
        "pur_value_uz": "Kimyoviy", "pur_value_ru": "Химия", "pur_value_en": "Chemical", "pur_type": "bad",
        "eps_value_uz": "Plastmas", "eps_value_ru": "Пластик", "eps_value_en": "Plastic", "eps_type": "bad",
        "order": 5,
    },
]


DEFAULT_HERO_SLIDES = [
    {
        "title_uz": "Sanoat majmualari", "title_ru": "Промышленные комплексы", "title_en": "Industrial complexes",
        "subtitle_uz": "Aerial view · 12 000 m²", "subtitle_ru": "Аэросъёмка · 12 000 м²", "subtitle_en": "Aerial view · 12,000 m²",
        "image": "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1920&q=85&auto=format&fit=crop",
        "order": 1, "is_active": True,
    },
    {
        "title_uz": "Sendvich panel binolari", "title_ru": "Здания из сэндвич-панелей", "title_en": "Sandwich panel buildings",
        "subtitle_uz": "Modern facade · 8 500 m²", "subtitle_ru": "Современный фасад · 8 500 м²", "subtitle_en": "Modern facade · 8,500 m²",
        "image": "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&q=85&auto=format&fit=crop",
        "order": 2, "is_active": True,
    },
    {
        "title_uz": "Logistika omborlari", "title_ru": "Логистические склады", "title_en": "Logistics warehouses",
        "subtitle_uz": "Interior · EI 240", "subtitle_ru": "Интерьер · EI 240", "subtitle_en": "Interior · EI 240",
        "image": "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1920&q=85&auto=format&fit=crop",
        "order": 3, "is_active": True,
    },
    {
        "title_uz": "Soviqxonalar", "title_ru": "Холодильные комплексы", "title_en": "Cold storage facilities",
        "subtitle_uz": "−25°C → +30°C", "subtitle_ru": "−25°C → +30°C", "subtitle_en": "−25°C → +30°C",
        "image": "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1920&q=85&auto=format&fit=crop",
        "order": 4, "is_active": True,
    },
]


DEFAULT_BLOG_POSTS = [
    {
        "slug": "fire-resistance-ei-240",
        "category": "tech", "min_read": 7, "is_featured": True,
        "published_at": date(2026, 4, 28),
        "title_uz": "Yong'inga chidamlilik EI 240 — nima degani va qachon kerak",
        "title_ru": "Огнестойкость EI 240 — что значит и когда нужна",
        "title_en": "Fire resistance EI 240 — what it means and when it's needed",
        "excerpt_uz": "EI 240 sertifikati ko'pchilik qurilish loyihalarda majburiy. Ushbu standart nima va u sizning binoingiz uchun nima beradi.",
        "excerpt_ru": "Сертификат EI 240 обязателен для многих проектов. Объясняем что это и что даёт зданию.",
        "excerpt_en": "EI 240 certification is mandatory for many projects. What it means and provides for buildings.",
        "body_uz": "EI 240 — bu Yevropa standartiga ko'ra yong'inga chidamlilik darajasi. \"E\" — yong'inning narigi tomonga o'tib ketmasligi, \"I\" — issiqlik izolyatsiyasi, \"240\" esa minutlarda chidamlilik vaqti.\n\n**Nima beradi?**\n- 4 soat (240 daqiqa) ichida yong'in narigi tomonga o'tmaydi\n- Bino strukturasi va inson hayoti himoyalanadi\n\n**Bazalt yadroli panellar nega EI 240?**\nBazalt tabiiy vulqon toshi — 1450°C eriydi. PUR/PIR polimerlar 150-200°C da o'z holatini yo'qotadi.",
        "body_ru": "EI 240 — европейский стандарт огнестойкости. \"E\" — нераспространение огня, \"I\" — теплоизоляция, \"240\" — минуты.\n\n**Что даёт?**\n- 4 часа защиты от огня\n- Защита структуры здания\n\n**Почему базальт EI 240?**\nБазальт плавится при 1450°C. Полимеры теряют свойства при 150-200°C.",
        "body_en": "EI 240 is a European fire resistance standard. \"E\" = integrity, \"I\" = insulation, \"240\" = minutes.\n\n**What it provides:**\n- 4 hours of fire protection\n- Building structure protection\n\n**Why basalt achieves EI 240?**\nBasalt melts at 1450°C. Polymers lose properties at 150-200°C.",
    },
    {
        "slug": "basalt-vs-pir-pur-eps",
        "category": "tech", "min_read": 9, "is_featured": True,
        "published_at": date(2026, 4, 15),
        "title_uz": "Bazalt vs PIR vs PUR vs EPS — qaysi sendvich panelni tanlash",
        "title_ru": "Базальт vs PIR vs PUR vs EPS — какую панель выбрать",
        "title_en": "Basalt vs PIR vs PUR vs EPS — which to choose",
        "excerpt_uz": "4 ta asosiy sendvich panel turini taqqoslaymiz: yong'in xavfsizligi, narx, ekologiya va xizmat muddati.",
        "excerpt_ru": "Сравниваем 4 типа сэндвич-панелей: безопасность, цена, экология, срок службы.",
        "excerpt_en": "Comparing 4 sandwich panel types: safety, price, ecology, lifespan.",
        "body_uz": "**Bazalt:** EI 240, 50+ yil, eng yaxshi yong'in xavfsizligi.\n**PIR:** EI 30, lekin eng yaxshi issiqlik izolyatsiyasi (0.022 W/m·K).\n**PUR:** Yonadi, kimyoviy.\n**EPS:** Eng arzon, lekin yonadi va atrof-muhitga zarar.",
        "body_ru": "**Базальт:** EI 240, 50+ лет, лучшая огнестойкость.\n**PIR:** EI 30, лучшая теплоизоляция (0.022).\n**PUR:** Горит, химия.\n**EPS:** Дешёвый, но горит.",
        "body_en": "**Basalt:** EI 240, 50+ years, best fire safety.\n**PIR:** EI 30, best thermal (0.022).\n**PUR:** Burns, chemical.\n**EPS:** Cheap but burns.",
    },
    {
        "slug": "2026-uzbekistan-standards",
        "category": "industry", "min_read": 5,
        "published_at": date(2026, 3, 22),
        "title_uz": "2026 yilda O'zbekistonda yangi qurilish standartlari",
        "title_ru": "Новые строительные стандарты в Узбекистане 2026",
        "title_en": "New construction standards in Uzbekistan 2026",
        "excerpt_uz": "ShNQ va GOST hujjatlariga so'nggi o'zgartirishlar. Energiya samaradorligi va yong'in xavfsizligiga yangi talablar.",
        "excerpt_ru": "Изменения в ШНК и ГОСТ. Новые требования к энергоэффективности.",
        "excerpt_en": "Updates to ShNQ and GOST. New energy efficiency requirements.",
        "body_uz": "2026 yil boshidan kuchga kirgan yangi standartlar.",
        "body_ru": "Новые стандарты, вступившие в силу с 2026.",
        "body_en": "New standards effective from 2026.",
    },
    {
        "slug": "cold-storage-250mm",
        "category": "project", "min_read": 6,
        "published_at": date(2026, 3, 8),
        "title_uz": "Soviqxona qurilishi: 250mm sendvich panel tanlash",
        "title_ru": "Строительство холодильника: выбор панелей 250мм",
        "title_en": "Cold storage: choosing 250mm panels",
        "excerpt_uz": "−25°C dan +30°C gacha haroratda ishlaydigan soviqxona uchun panel hisoblari. Toshkentdagi 5000 m² loyiha.",
        "excerpt_ru": "Холодильник от -25°C до +30°C. Проект 5000 м² в Ташкенте.",
        "excerpt_en": "Cold storage -25°C to +30°C. 5000 m² project in Tashkent.",
        "body_uz": "Loyiha bo'yicha batafsil case study: maydon hisobi, montaj texnologiyasi, natija.",
        "body_ru": "Подробный case study: расчёт, монтаж, результат.",
        "body_en": "Detailed case study: calculation, installation, result.",
    },
    {
        "slug": "basalt-eco-insulation",
        "category": "eco", "min_read": 4,
        "published_at": date(2026, 2, 19),
        "title_uz": "Nima uchun bazalt — eng ekologik izolyatsiya materiali?",
        "title_ru": "Почему базальт — самая экологичная изоляция?",
        "title_en": "Why basalt is the most eco-friendly insulation",
        "excerpt_uz": "100% tabiiy vulqon toshidan tayyorlanadi. Qayta ishlanadi, atrof-muhitga zarar yetkazmaydi.",
        "excerpt_ru": "100% натуральный вулканический камень. Перерабатывается.",
        "excerpt_en": "100% natural volcanic rock. Recyclable.",
        "body_uz": "Bazalt tola — vulqon toshidan eritilib tayyorlanadi. Hech qanday kimyoviy qo'shimcha yo'q.",
        "body_ru": "Базальтовое волокно — из плавленого вулканического камня.",
        "body_en": "Basalt fiber from melted volcanic rock.",
    },
    {
        "slug": "installation-mistakes",
        "category": "tech", "min_read": 8,
        "published_at": date(2026, 2, 5),
        "title_uz": "Sendvich panel montaji: 7 ta asosiy xato",
        "title_ru": "Монтаж сэндвич-панелей: 7 основных ошибок",
        "title_en": "Sandwich panel installation: 7 common mistakes",
        "excerpt_uz": "Tajribali quruvchilar ham qiladigan xatolar — va ulardan qanday qochish kerak.",
        "excerpt_ru": "Ошибки опытных строителей — как избежать.",
        "excerpt_en": "Mistakes experienced builders make — how to avoid.",
        "body_uz": "7 ta eng ko'p uchragan montaj xatolari va ulardan qanday qochish.",
        "body_ru": "7 распространённых ошибок монтажа.",
        "body_en": "7 most common installation mistakes.",
    },
]


async def seed_initial_content(session: AsyncSession):
    # Content blocks
    for block_data in DEFAULT_CONTENT:
        res = await session.execute(select(ContentBlock).where(ContentBlock.key == block_data["key"]))
        existing = res.scalar_one_or_none()
        if existing:
            # Majburiy yangilanadigan bloklar (mijoz feedback'iga muvofiq)
            if block_data["key"] in FORCED_UPDATE_KEYS:
                existing.value = block_data["value"]
            continue
        session.add(ContentBlock(**block_data))

    # Categories
    cat_map = {}
    for cat_data in DEFAULT_CATEGORIES:
        res = await session.execute(select(Category).where(Category.slug == cat_data["slug"]))
        existing = res.scalar_one_or_none()
        if existing:
            cat_map[cat_data["slug"]] = existing.id
            continue
        cat = Category(**cat_data)
        session.add(cat)
        await session.flush()
        cat_map[cat_data["slug"]] = cat.id

    # Products
    for prod_data in DEFAULT_PRODUCTS:
        res = await session.execute(select(Product).where(Product.slug == prod_data["slug"]))
        if res.scalar_one_or_none():
            continue
        data = dict(prod_data)
        cat_slug = data.pop("category_slug")
        data["category_id"] = cat_map.get(cat_slug)
        session.add(Product(**data))

    # Projects (portfolio)
    for proj_data in DEFAULT_PROJECTS:
        res = await session.execute(select(Project).where(Project.slug == proj_data["slug"]))
        if res.scalar_one_or_none():
            continue
        session.add(Project(**proj_data))

    # Features
    for feat in DEFAULT_FEATURES:
        res = await session.execute(select(Feature).where(Feature.key == feat["key"]))
        if res.scalar_one_or_none():
            continue
        session.add(Feature(**feat))

    # FAQs (no unique constraint — use a soft check)
    res = await session.execute(select(FAQ.id).limit(1))
    if not res.scalar_one_or_none():
        for faq in DEFAULT_FAQS:
            session.add(FAQ(**faq))

    # Clients
    for cl in DEFAULT_CLIENTS:
        res = await session.execute(select(Client).where(Client.name == cl["name"]))
        if res.scalar_one_or_none():
            continue
        session.add(Client(**cl))

    # Blog posts
    for post in DEFAULT_BLOG_POSTS:
        res = await session.execute(select(BlogPost).where(BlogPost.slug == post["slug"]))
        if res.scalar_one_or_none():
            continue
        session.add(BlogPost(**post))

    # Calculator products
    for cp in DEFAULT_CALC_PRODUCTS:
        res = await session.execute(select(CalculatorProduct).where(CalculatorProduct.code == cp["code"]))
        if res.scalar_one_or_none():
            continue
        session.add(CalculatorProduct(**cp))

    # Comparison rows (idempotent — soft check on empty table)
    res = await session.execute(select(ComparisonRow.id).limit(1))
    if not res.scalar_one_or_none():
        for row in DEFAULT_COMPARISON_ROWS:
            session.add(ComparisonRow(**row))

    # Hero slides
    res = await session.execute(select(HeroSlide.id).limit(1))
    if not res.scalar_one_or_none():
        for slide in DEFAULT_HERO_SLIDES:
            session.add(HeroSlide(**slide))

    await session.commit()
