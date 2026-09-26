"""Boshlang'ich kontent — birinchi ishga tushganda yuklanadi (ECO BASALT)"""
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.models.content import ContentBlock, HeroSlide, Project
from app.models.product import Category, Product
from app.models.cms import BlogPost, FAQ, Feature, Client, CalculatorProduct, ComparisonRow


# Bu ro'yxatga qo'shilgan keylar seeder ishga tushganda mavjud bo'lsa ham
# majburiy yangi qiymat bilan yoziladi. Odatda bo'sh bo'ladi — admin panelidagi
# tahrirlar saqlanib qolishi uchun. Faqat vaqtinchalik "hotfix" holatida ishlatiladi:
# kerakli kalitni qo'shib deploy qiling → keyingi deploy'da qaytadan bo'shatib qo'ying.
# HOZIR: mijoz feedback bo'yicha hero.subtitle va about matnlarini yangilash uchun majburiy.
FORCED_UPDATE_KEYS: set[str] = {
    "hero.subtitle",
    "about.eyebrow",
    "about.title",
}

# True bo'lsa: DEFAULT_FEATURES bilan Feature jadvali to'liq sinxronlashtiriladi
# (mavjud kalitlar yangi qiymatga yoziladi, ro'yxatdagi yo'q bo'lganlar deaktiv qilinadi).
# Deploy'dan so'ng bo'shatib qo'ying, aks holda admin tahrirlari qaytariladi.
# HOZIR: True — chunki Features tartibi va tavsiflari yangilangan.
FORCE_SYNC_FEATURES: bool = True


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
     "value": {"uz": "Tabiiy bazalt asosida issiqlik izolyatsiya materiallari va gidroponika substratlarini ishlab chiqarish",
               "ru": "Производство теплоизоляционных материалов и гидропонных субстратов на основе природного базальта",
               "en": "Manufacturing thermal insulation materials and hydroponic substrates based on natural basalt"}},

    # About
    {"key": "about.eyebrow", "section": "about", "label": "About — kichik label", "block_type": "multilang",
     "value": {"uz": "KOMPANIYA HAQIDA", "ru": "О КОМПАНИИ", "en": "ABOUT US"}},
    {"key": "about.title", "section": "about", "label": "About — sarlavha", "block_type": "multilang",
     "value": {"uz": "Sifat mustahkam asosdan boshlanadi",
               "ru": "Качество начинается с надёжной основы",
               "en": "Quality starts with a solid foundation"}},
    {"key": "about.body1", "section": "about", "label": "About — 1-abzats", "block_type": "multilang",
     "value": {"uz": "ECO BASALT — tabiiy bazalt asosidagi issiqlik izolyatsiya materiallari va gidroponika substratlarini ishlab chiqaruvchi zamonaviy korxona. Kompaniya zamonaviy texnologiyalar, Yevropa uskunalari va ishlab chiqarishga professional yondashuvni birlashtirib, sifatli mahsulot chiqarish uchun ishonchli asos yaratmoqda.",
               "ru": "ECO BASALT — современный производитель теплоизоляционных материалов и гидропонных субстратов на основе природного базальта. Компания сочетает современные технологии, европейское оборудование и профессиональный подход к производству, создавая надёжную основу для выпуска качественной продукции.",
               "en": "ECO BASALT is a modern manufacturer of thermal insulation materials and hydroponic substrates based on natural basalt. The company combines modern technology, European equipment and a professional approach to production, creating a solid foundation for delivering quality products."}},
    {"key": "about.body2", "section": "about", "label": "About — 2-abzats", "block_type": "multilang",
     "value": {"uz": "Biz bozorning zamonaviy talablariga javob beradigan sifatli, ekologik toza va energiya samarali mahsulot ishlab chiqaramiz. Ishlab chiqarishni rivojlantirish, zamonaviy texnologiyalarni joriy etish va hamkorlar bilan uzoq muddatli hamkorlik ECO BASALT faoliyatining asosini tashkil etadi.",
               "ru": "Мы выпускаем качественную, экологичную и энергоэффективную продукцию, соответствующую современным требованиям рынка. Развитие производства, внедрение современных технологий и долгосрочное сотрудничество с партнёрами лежат в основе деятельности ECO BASALT.",
               "en": "We produce quality, environmentally friendly and energy-efficient products that meet the modern demands of the market. Developing production, implementing modern technology and long-term cooperation with partners form the core of ECO BASALT's operations."}},
    {"key": "about.image", "section": "about", "label": "About — korxona rasmi (URL)", "block_type": "image", "value": ""},

    # FinalCTA (pastdagi "Готовы к сотрудничеству?" bloki)
    {"key": "final_cta.bg_image", "section": "final_cta", "label": "FinalCTA — orqa fon rasmi (URL)", "block_type": "image", "value": ""},

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


# Katalog (mijoz feedback #04): 3 yo'nalish × 2 mahsulot.
# Slug'lar frontend havolalari bilan mos: /products?cat=thermal|hydroponics|panels
DEFAULT_CATEGORIES = [
    {"slug": "thermal", "name_uz": "Issiqlik izolyatsiyasi", "name_ru": "Теплоизоляция", "name_en": "Thermal insulation",
     "description_uz": "Bazalt asosidagi issiqlik izolyatsiya materiallari.",
     "description_ru": "Теплоизоляционные материалы на основе базальта.",
     "description_en": "Basalt-based thermal insulation materials.",
     "icon": "thermal", "order": 1},
    {"slug": "hydroponics", "name_uz": "Gidroponika", "name_ru": "Гидропоника", "name_en": "Hydroponics",
     "description_uz": "Issiqxonalar uchun tosh paxtadan gidroponik substratlar.",
     "description_ru": "Гидропонные субстраты из каменной ваты для тепличных комплексов.",
     "description_en": "Stone wool hydroponic substrates for greenhouses.",
     "icon": "hydroponics", "order": 2},
    {"slug": "panels", "name_uz": "Sendvich panellar", "name_ru": "Сэндвич-панели", "name_en": "Sandwich panels",
     "description_uz": "Devor va tom uchun sendvich panellar.",
     "description_ru": "Стеновые и кровельные сэндвич-панели.",
     "description_en": "Wall and roof sandwich panels.",
     "icon": "panels", "order": 3},
]


DEFAULT_PRODUCTS = [
    # ── Issiqlik izolyatsiyasi ──
    {
        "slug": "basalt-thermal-slabs", "category_slug": "thermal", "order": 1,
        "name_uz": "Bazalt issiqlik izolyatsiya plitalari",
        "name_ru": "Базальтовые теплоизоляционные плиты",
        "name_en": "Basalt thermal insulation slabs",
        "short_uz": "Tabiiy bazalt asosidagi issiqlik va tovush izolyatsiyasi plitalari",
        "short_ru": "Плиты для тепло- и звукоизоляции на основе природного базальта",
        "short_en": "Thermal and acoustic insulation slabs made from natural basalt",
        "description_uz": "ECO BASALT bazalt issiqlik izolyatsiya plitalari — tabiiy bazalt asosida ishlab chiqarilgan zamonaviy issiqlik izolyatsiya materiali bo'lib, qurilish konstruksiyalarini samarali issiqlik va tovushdan himoyalash uchun mo'ljallangan. Mahsulot yuqori ekspluatatsion xususiyatlari, ishonchliligi bilan ajralib turadi va qurilish sohasining zamonaviy talablariga javob beradi.",
        "description_ru": "Базальтовые теплоизоляционные плиты ECO BASALT — современный теплоизоляционный материал на основе природного базальта, предназначенный для эффективной тепло- и звукоизоляции строительных конструкций. Продукция отличается высокими эксплуатационными характеристиками, надёжностью и соответствует современным требованиям строительной отрасли.",
        "description_en": "ECO BASALT basalt thermal insulation slabs are a modern insulation material made from natural basalt, designed for effective thermal and acoustic insulation of building structures. The product offers high performance and reliability and meets current construction industry requirements.",
        "advantages_uz": ["Yuqori issiqlik izolyatsiyasi samaradorligi", "Ekologik va yong'in xavfsizligi", "Samarali tovush yutish", "Xizmat muddati kamida 50 yil", "Bug' o'tkazuvchanlik", "Gidrofoblik"],
        "advantages_ru": ["Высокая теплоизоляционная эффективность", "Экологическая и пожарная безопасность", "Эффективное звукопоглощение", "Срок службы не менее 50 лет", "Паропроницаемость", "Гидрофобность"],
        "advantages_en": ["High thermal insulation performance", "Environmental and fire safety", "Effective sound absorption", "Service life of at least 50 years", "Vapour permeability", "Water repellency"],
        "applications_uz": ["Fasad tizimlari", "Devorlarni tashqi va ichki isitish", "Nishabli va tekis tomlar", "Qavatlararo yopmalar", "Ichki to'siqlar va to'suvchi konstruksiyalar", "Turar-joy, tijorat va sanoat inshootlari"],
        "applications_ru": ["Фасадные системы", "Наружное и внутреннее утепление стен", "Скатные и плоские кровли", "Межэтажные перекрытия", "Внутренние перегородки и ограждающие конструкции", "Жилые, коммерческие и промышленные сооружения"],
        "applications_en": ["Facade systems", "External and internal wall insulation", "Pitched and flat roofs", "Floor slabs", "Internal partitions and enclosing structures", "Residential, commercial and industrial buildings"],
    },
    {
        "slug": "basalt-lamella-mats", "category_slug": "thermal", "order": 2,
        "name_uz": "Bazalt lamel matlar",
        "name_ru": "Базальтовые ламельные маты",
        "name_en": "Basalt lamella mats",
        "short_uz": "Tolalari vertikal joylashgan tosh paxta matlari",
        "short_ru": "Маты из каменной ваты с вертикальным расположением волокон",
        "short_en": "Stone wool mats with vertically oriented fibres",
        "description_uz": "ECO BASALT bazalt lamel matlari tolalari vertikal joylashgan tosh paxta tasmalaridan tayyorlanadi, bu materialga yuqori mustahkamlik, egiluvchanlik va deformatsiyaga chidamlilik beradi. Mahsulot qurilish konstruksiyalari, sanoat uskunalari va muhandislik tizimlarini samarali issiqlik va tovushdan himoyalash uchun mo'ljallangan.",
        "description_ru": "Базальтовые ламельные маты ECO BASALT изготавливаются из полос каменной ваты с вертикальным расположением волокон, что обеспечивает материалу высокую прочность, гибкость и устойчивость к деформациям. Продукция предназначена для эффективной тепло- и звукоизоляции строительных конструкций, промышленного оборудования и инженерных систем.",
        "description_en": "ECO BASALT basalt lamella mats are made from strips of stone wool with vertically oriented fibres, giving the material high strength, flexibility and resistance to deformation. The product is designed for effective thermal and acoustic insulation of building structures, industrial equipment and engineering systems.",
        "advantages_uz": ["Yuqori issiqlik izolyatsiyasi samaradorligi", "Yuqori mustahkamlik va egiluvchanlik", "Mexanik ta'sirlarga chidamlilik", "Egri sirtlarga qulay o'rnatish", "Konstruksiyalarni harorat o'zgarishi va korroziyadan himoyalash", "Bug' o'tkazuvchanlik"],
        "advantages_ru": ["Высокая теплоизоляционная эффективность", "Высокая прочность и гибкость", "Устойчивость к механическим воздействиям", "Удобство монтажа на криволинейных поверхностях", "Защита конструкций от перепадов температур и коррозии", "Паропроницаемость"],
        "advantages_en": ["High thermal insulation performance", "High strength and flexibility", "Resistance to mechanical impact", "Easy installation on curved surfaces", "Protects structures from temperature changes and corrosion", "Vapour permeability"],
        "applications_uz": ["Havo o'tkazgichlar va ventilyatsiya tizimlari", "Quvurlar va muhandislik kommunikatsiyalari", "Rezervuarlar va texnologik idishlar", "Sanoat uskunalari", "Egri sirtlar", "Fasad tizimlari"],
        "applications_ru": ["Воздуховоды и вентиляционные системы", "Трубопроводы и инженерные коммуникации", "Резервуары и технологические ёмкости", "Промышленное оборудование", "Криволинейные поверхности", "Фасадные системы"],
        "applications_en": ["Air ducts and ventilation systems", "Pipelines and utility networks", "Tanks and process vessels", "Industrial equipment", "Curved surfaces", "Facade systems"],
    },
    # ── Sendvich panellar ──
    {
        "slug": "wall-sandwich-panels", "category_slug": "panels", "order": 3,
        "name_uz": "Devor sendvich panellari",
        "name_ru": "Стеновые сэндвич-панели",
        "name_en": "Wall sandwich panels",
        "short_uz": "Tashqi devorlarni tez barpo etish uchun ko'p qatlamli panellar",
        "short_ru": "Многослойные панели для быстрого возведения наружных стен",
        "short_en": "Multilayer panels for fast construction of external walls",
        "description_uz": "ECO BASALT devor sendvich panellari — sanoat, tijorat, ombor va qishloq xo'jaligi ob'ektlarining tashqi devorlarini tez barpo etish uchun mo'ljallangan zamonaviy ko'p qatlamli qurilish panellari. Panellar mustahkamlik, samarali issiqlik izolyatsiyasi va chiroyli tashqi ko'rinishni birlashtirib, qurilish konstruksiyalarining ishonchliligi va uzoq muddat xizmat qilishini ta'minlaydi.",
        "description_ru": "Стеновые сэндвич-панели ECO BASALT — современные многослойные строительные панели, предназначенные для быстрого возведения наружных стен промышленных, коммерческих, складских и сельскохозяйственных объектов. Панели сочетают прочность, эффективную теплоизоляцию и эстетичный внешний вид, обеспечивая надёжность и долговечность строительных конструкций.",
        "description_en": "ECO BASALT wall sandwich panels are modern multilayer building panels designed for fast construction of external walls of industrial, commercial, warehouse and agricultural facilities. The panels combine strength, effective thermal insulation and an attractive appearance, ensuring reliable and durable structures.",
        "advantages_uz": ["Energiya samaradorligi", "Konstruksiyaning ishonchliligi va mustahkamligi", "Yuqori montaj tezligi", "Atmosfera ta'sirlariga chidamlilik", "Mexanik yuklamalarga chidamlilik", "Zamonaviy tashqi ko'rinish"],
        "advantages_ru": ["Энергоэффективность", "Надёжность и прочность конструкции", "Высокая скорость монтажа", "Устойчивость к атмосферным воздействиям", "Устойчивость к механическим нагрузкам", "Современный внешний вид"],
        "advantages_en": ["Energy efficiency", "Reliable and strong structure", "Fast installation", "Weather resistance", "Resistance to mechanical loads", "Modern appearance"],
        "applications_uz": ["Ishlab chiqarish binolari", "Ombor majmualari", "Logistika markazlari", "Savdo binolari", "Qishloq xo'jaligi majmualari", "Ma'muriy binolar"],
        "applications_ru": ["Производственные здания", "Складские комплексы", "Логистические центры", "Торговые помещения", "Сельскохозяйственные комплексы", "Административные здания"],
        "applications_en": ["Production buildings", "Warehouse complexes", "Logistics centres", "Retail premises", "Agricultural complexes", "Administrative buildings"],
    },
    {
        "slug": "roof-sandwich-panels", "category_slug": "panels", "order": 4,
        "name_uz": "Tom sendvich panellari",
        "name_ru": "Кровельные сэндвич-панели",
        "name_en": "Roof sandwich panels",
        "short_uz": "Mustahkam va energiya tejamkor tomlar uchun ko'p qatlamli panellar",
        "short_ru": "Многослойные панели для прочных и энергоэффективных кровель",
        "short_en": "Multilayer panels for strong, energy-efficient roofs",
        "description_uz": "ECO BASALT tom sendvich panellari — mustahkam, energiya tejamkor va uzoq muddat xizmat qiladigan tom konstruksiyalarini yaratish uchun ishlab chiqilgan zamonaviy ko'p qatlamli panellar. Samarali issiqlik izolyatsiyasi va tashqi ta'sirlarga chidamliligi tufayli panellar binoni ishonchli himoya qiladi va qulay ekspluatatsiya sharoitlarini ta'minlaydi.",
        "description_ru": "Кровельные сэндвич-панели ECO BASALT — современные многослойные панели, разработанные для создания прочных, энергоэффективных и долговечных кровельных конструкций. Благодаря эффективной теплоизоляции и устойчивости к внешним воздействиям панели обеспечивают надёжную защиту здания и комфортные условия эксплуатации.",
        "description_en": "ECO BASALT roof sandwich panels are modern multilayer panels developed for strong, energy-efficient and durable roof structures. Thanks to effective thermal insulation and resistance to external impacts, the panels reliably protect the building and provide comfortable operating conditions.",
        "advantages_uz": ["Tom konstruksiyasining mustahkamligi", "Yuqori yuk ko'tarish qobiliyati", "Birikmalarning germetikligi", "Atmosfera ta'sirlariga chidamlilik", "Yil davomida montaj qilish imkoniyati"],
        "advantages_ru": ["Прочность кровельной конструкции", "Высокая несущая способность", "Герметичность соединений", "Устойчивость к атмосферным воздействиям", "Всесезонный монтаж"],
        "advantages_en": ["Strong roof structure", "High load-bearing capacity", "Sealed joints", "Weather resistance", "Year-round installation"],
        "applications_uz": ["Yangi tomlarni qurish", "Tomlarni almashtirish va rekonstruksiya qilish", "Sanoat, tijorat va qishloq xo'jaligi ob'ektlari"],
        "applications_ru": ["Устройство новых кровель", "Замена и реконструкция кровель", "Промышленные, коммерческие и сельскохозяйственные объекты"],
        "applications_en": ["New roof construction", "Roof replacement and reconstruction", "Industrial, commercial and agricultural facilities"],
    },
    # ── Gidroponika ──
    {
        "slug": "hydroponic-mats", "category_slug": "hydroponics", "order": 5,
        "name_uz": "Gidroponik matlar",
        "name_ru": "Гидропонные маты",
        "name_en": "Hydroponic slabs",
        "short_uz": "Gidroponik yetishtirish uchun tosh paxta substrati",
        "short_ru": "Субстрат из каменной ваты для гидропонного выращивания",
        "short_en": "Stone wool substrate for hydroponic growing",
        "description_uz": "ECO BASALT gidroponik matlari — sabzavot, rezavor meva va gul ekinlarini gidroponika usulida yetishtirish uchun mo'ljallangan tosh paxtadan tayyorlangan zamonaviy substrat. Materialning optimal tuzilishi namlik va havoning bir tekis taqsimlanishini ta'minlab, ildiz tizimining rivojlanishi, ozuqa moddalarining samarali o'zlashtirilishi va o'simliklarning barqaror o'sishi uchun qulay sharoit yaratadi.",
        "description_ru": "Гидропонные маты ECO BASALT — современный субстрат из каменной ваты, предназначенный для выращивания овощных, ягодных и цветочных культур методом гидропоники. Оптимальная структура материала обеспечивает равномерное распределение влаги и воздуха, создавая благоприятные условия для развития корневой системы, эффективного усвоения питательных веществ и стабильного роста растений.",
        "description_en": "ECO BASALT hydroponic slabs are a modern stone wool substrate for growing vegetables, berries and flowers hydroponically. The optimal structure of the material ensures even distribution of moisture and air, creating favourable conditions for root development, efficient nutrient uptake and stable plant growth.",
        "advantages_uz": ["Optimal suv-havo muvozanati", "Namlikning bir tekis taqsimlanishi", "Ildiz tizimi rivojlanishi uchun qulay sharoit", "Kimyoviy va biologik inertlik", "Foydalanishda soddalik", "Turli ekinlarni yetishtirish uchun mos"],
        "advantages_ru": ["Оптимальный водно-воздушный баланс", "Равномерное распределение влаги", "Благоприятные условия для развития корневой системы", "Химическая и биологическая инертность", "Простота эксплуатации", "Подходит для выращивания различных культур"],
        "advantages_en": ["Optimal water-air balance", "Even moisture distribution", "Favourable conditions for root development", "Chemically and biologically inert", "Easy to use", "Suitable for a wide range of crops"],
        "applications_uz": ["Issiqxona majmualari", "Sabzavot ekinlarini yetishtirish", "Rezavor meva ekinlarini yetishtirish", "Gulchilik"],
        "applications_ru": ["Тепличные комплексы", "Выращивание овощных культур", "Выращивание ягодных культур", "Цветоводство"],
        "applications_en": ["Greenhouse complexes", "Vegetable growing", "Berry growing", "Floriculture"],
    },
    {
        "slug": "hydroponic-plugs", "category_slug": "hydroponics", "order": 6,
        "name_uz": "Gidroponik tiqinlar (kubiklar)",
        "name_ru": "Гидропонные пробки (кубики)",
        "name_en": "Hydroponic plugs (cubes)",
        "short_uz": "Urug' undirish va ko'chat yetishtirish uchun tosh paxta substrati",
        "short_ru": "Субстрат из каменной ваты для проращивания семян и рассады",
        "short_en": "Stone wool substrate for seed germination and seedlings",
        "description_uz": "ECO BASALT gidroponik tiqinlari (kubiklari) — urug' undirish, qalamchalarni ildiz otdirish va ko'chat yetishtirish uchun mo'ljallangan tosh paxta substrati. Materialning optimal tuzilishi bir tekis namlanish, ildiz tizimiga havoning erkin kirishi va yosh o'simliklar rivojlanishi uchun qulay sharoitni ta'minlaydi.",
        "description_ru": "Гидропонные пробки (кубики) ECO BASALT — субстрат из каменной ваты, предназначенный для проращивания семян, укоренения черенков и выращивания рассады. Оптимальная структура материала обеспечивает равномерное увлажнение, свободный доступ воздуха к корневой системе и благоприятные условия для развития молодых растений.",
        "description_en": "ECO BASALT hydroponic plugs (cubes) are a stone wool substrate for seed germination, rooting cuttings and growing seedlings. The optimal structure of the material ensures even moistening, free air access to the roots and favourable conditions for young plants.",
        "advantages_uz": ["Optimal suv-havo muvozanati", "Urug' undirish uchun qulay sharoit", "Ildiz tizimining faol rivojlanishi", "Substratning bir tekis namlanishi", "O'simliklarni ko'chirib o'tkazish qulayligi", "Kimyoviy va biologik inertlik"],
        "advantages_ru": ["Оптимальный водно-воздушный баланс", "Благоприятные условия для проращивания семян", "Активное развитие корневой системы", "Равномерное увлажнение субстрата", "Удобство пересадки растений", "Химическая и биологическая инертность"],
        "advantages_en": ["Optimal water-air balance", "Favourable conditions for seed germination", "Active root development", "Even substrate moistening", "Easy transplanting", "Chemically and biologically inert"],
        "applications_uz": ["Urug' undirish", "Qalamchalarni ildiz otdirish", "Ko'chat yetishtirish", "O'simliklarni ko'chirib o'tkazishga tayyorlash"],
        "applications_ru": ["Проращивание семян", "Укоренение черенков", "Выращивание рассады", "Подготовка растений к пересадке"],
        "applications_en": ["Seed germination", "Rooting cuttings", "Growing seedlings", "Preparing plants for transplanting"],
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
    {"key": "fire", "icon": "FlameKindling", "order": 1,
     "title_uz": "Yong'inbardoshlik", "title_ru": "Огнестойкость", "title_en": "Fire Resistance",
     "description_uz": "Ekstremal haroratlar bilan sinovdan o'tgan xavfsizlik",
     "description_ru": "Безопасность, проверенная экстремальными температурами",
     "description_en": "Safety proven by extreme temperatures"},
    {"key": "thermal", "icon": "ThermometerSun", "order": 2,
     "title_uz": "Samarali issiqlik izolyatsiyasi", "title_ru": "Эффективная теплоизоляция", "title_en": "Effective Thermal Insulation",
     "description_uz": "Issiqlik yo'qotishlarini kamaytiradi va binolarning energiya samaradorligini oshiradi",
     "description_ru": "Снижает теплопотери и повышает энергоэффективность объектов",
     "description_en": "Reduces heat loss and improves energy efficiency of buildings"},
    {"key": "durable", "icon": "Infinity", "order": 3,
     "title_uz": "Uzoq umr", "title_ru": "Долговечность", "title_en": "Longevity",
     "description_uz": "O'nlab yillar davomida ish xususiyatlarini saqlab qoladi",
     "description_ru": "Сохраняет эксплуатационные характеристики на протяжении десятилетий",
     "description_en": "Retains performance characteristics for decades"},
    {"key": "european_tech", "icon": "BadgeCheck", "order": 4,
     "title_uz": "Yevropa ishlab chiqarish texnologiyalari", "title_ru": "Европейские технологии производства", "title_en": "European Manufacturing Technology",
     "description_uz": "Italyan ishlab chiqarilgan zamonaviy uskunalar mahsulotning yuqori va barqaror sifatini ta'minlaydi",
     "description_ru": "Современное оборудование итальянского производства обеспечивает высокое и стабильное качество продукции",
     "description_en": "Modern Italian-made equipment ensures consistently high product quality"},
    {"key": "eco", "icon": "TreePine", "order": 5,
     "title_uz": "Ekologik toza", "title_ru": "Экологичность", "title_en": "Eco-Friendly",
     "description_uz": "Tabiiy kelib chiqishi va ekologik xavfsizligi",
     "description_ru": "Природное происхождение и экологическая безопасность",
     "description_en": "Natural origin and environmental safety"},
    {"key": "acoustic", "icon": "AudioWaveform", "order": 6,
     "title_uz": "Ovoz yutish", "title_ru": "Звукопоглощение", "title_en": "Sound Absorption",
     "description_uz": "Xonalarning akustik qulayligini oshiradi",
     "description_ru": "Повышает акустический комфорт помещений",
     "description_en": "Improves acoustic comfort of spaces"},
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

    # Katalog v2 (feedback #04) — yangi mahsulotlardan hech biri bo'lmasa, bu birinchi ishga tushirish:
    # eski demo kategoriya/mahsulotlar yashiriladi (o'chirilmaydi), yangi 3 kategoriya yangilanadi.
    new_prod_slugs = [p["slug"] for p in DEFAULT_PRODUCTS]
    new_cat_slugs = [c["slug"] for c in DEFAULT_CATEGORIES]
    res = await session.execute(select(Product.id).where(Product.slug.in_(new_prod_slugs)))
    catalog_v2_first_run = res.first() is None
    if catalog_v2_first_run:
        await session.execute(
            update(Product).where(Product.slug.not_in(new_prod_slugs)).values(is_active=False)
        )
        await session.execute(
            update(Category).where(Category.slug.not_in(new_cat_slugs)).values(is_active=False)
        )

    # Categories
    cat_map = {}
    for cat_data in DEFAULT_CATEGORIES:
        res = await session.execute(select(Category).where(Category.slug == cat_data["slug"]))
        existing = res.scalar_one_or_none()
        if existing:
            if catalog_v2_first_run:
                for k, v in cat_data.items():
                    setattr(existing, k, v)
                existing.is_active = True
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
    if FORCE_SYNC_FEATURES:
        default_keys = {f["key"] for f in DEFAULT_FEATURES}
        # 1) Upsert: DEFAULT_FEATURES ni yozib qo'yish
        for feat in DEFAULT_FEATURES:
            res = await session.execute(select(Feature).where(Feature.key == feat["key"]))
            existing = res.scalar_one_or_none()
            if existing:
                for k, v in feat.items():
                    setattr(existing, k, v)
                existing.is_active = True
            else:
                session.add(Feature(**feat))
        # 2) Ro'yxatdagi yo'q kalitlarni deaktiv qilish (o'chirmaymiz — admin qaytarishi mumkin)
        res_all = await session.execute(select(Feature))
        for f in res_all.scalars().all():
            if f.key not in default_keys:
                f.is_active = False
    else:
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
