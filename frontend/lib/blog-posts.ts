import type { Lang } from "./i18n";

export type BlogPost = {
  id: number;
  slug: string;
  cat: "tech" | "industry" | "project" | "eco";
  date: string;
  minRead: number;
  title: Record<Lang, string>;
  excerpt: Record<Lang, string>;
  body: Record<Lang, string>;
  variant: "fire" | "thermal" | "compare" | "standard" | "eco";
};

export const POSTS: BlogPost[] = [
  {
    id: 1,
    slug: "fire-resistance-ei-240",
    cat: "tech",
    date: "2026-04-28",
    minRead: 7,
    title: {
      uz: "Yong'inga chidamlilik EI 240 — nima degani va qachon kerak",
      ru: "Огнестойкость EI 240 — что значит и когда нужна",
      en: "Fire resistance EI 240 — what it means and when it's needed",
    },
    excerpt: {
      uz: "EI 240 sertifikati ko'pchilik qurilish loyihalarda majburiy. Ushbu standart nima va u sizning binoingiz uchun nima beradi — batafsil tushuntiramiz.",
      ru: "Сертификат EI 240 обязателен для многих строительных проектов. Подробно объясняем, что это за стандарт и что он даёт вашему зданию.",
      en: "The EI 240 certification is mandatory for many construction projects. We explain in detail what this standard means and what it provides for your building.",
    },
    body: {
      uz: `EI 240 — bu Yevropa standartiga ko'ra yong'inga chidamlilik darajasi. "E" — yong'inning ikkinchi tomonga o'tib ketmasligi (Integrity), "I" — issiqlik izolyatsiyasi (Insulation), "240" esa minutlarda chidamlilik vaqti.

**Nima beradi?**
- 4 soat (240 daqiqa) ichida yong'in narigi tomonga o'tmaydi
- Issiqlik bir tomondan ikkinchisiga taqsimlanmaydi
- Bino strukturasi va inson hayoti himoyalanadi

**Qachon kerak?**
- Sanoat obektlari (zavod, ombor)
- Yong'in xavfi yuqori (kimyo, neft-gaz)
- Yirik savdo markazlari (1000+ m²)
- Uzoq dehqonchilik omborlari (oziq-ovqat)

**Sertifikatlash jarayoni:**
1. Mahsulot akkreditatsiyalangan laboratoriyaga yuboriladi
2. Standart shartlarda (1000°C dan yuqori) sinov o'tkaziladi
3. EN 13501-2 hujjati beriladi

**Bazalt yadroli panellar nega EI 240?**
Bazalt tabiiy vulqon toshidir — 1450°C eriydi. PUR/PIR poliuretan esa 150-200°C da o'z holatini yo'qotadi. Shuning uchun bazalt panellar 4 soatga, ko'pchilik kimyoviy izolyatsiya esa atigi 30 daqiqaga chidaydi.`,
      ru: `EI 240 — это уровень огнестойкости по европейскому стандарту. "E" — нераспространение огня на другую сторону (Integrity), "I" — теплоизоляция (Insulation), "240" — время сопротивления в минутах.

**Что даёт?**
- В течение 4 часов (240 минут) огонь не переходит на другую сторону
- Тепло не передаётся с одной стороны на другую
- Защищается структура здания и жизни людей

**Когда нужно?**
- Промышленные объекты (заводы, склады)
- Высокий пожарный риск (химия, нефтегаз)
- Крупные торговые центры (1000+ м²)
- Долгосрочные сельскохозяйственные склады

**Процесс сертификации:**
1. Продукт отправляется в аккредитованную лабораторию
2. Проводится испытание в стандартных условиях (выше 1000°C)
3. Выдаётся документ EN 13501-2

**Почему панели с базальтовым ядром EI 240?**
Базальт — натуральный вулканический камень, плавится при 1450°C. PUR/PIR полиуретан теряет свойства при 150-200°C. Поэтому базальтовые панели выдерживают 4 часа, а большинство химических изоляций — всего 30 минут.`,
      en: `EI 240 is a European standard fire resistance rating. "E" — Integrity (fire doesn't spread to the other side), "I" — Insulation (heat transfer), "240" — resistance time in minutes.

**What it provides:**
- For 4 hours (240 minutes), fire won't pass through
- Heat doesn't transfer from one side to the other
- Building structure and human lives are protected

**When it's needed:**
- Industrial facilities (factories, warehouses)
- High fire risk (chemicals, oil-gas)
- Large shopping centers (1000+ m²)
- Long-term agricultural storage (food)

**Certification process:**
1. Product sent to accredited laboratory
2. Standard conditions testing (above 1000°C)
3. EN 13501-2 document issued

**Why basalt-core panels achieve EI 240?**
Basalt is natural volcanic stone — melts at 1450°C. PUR/PIR polyurethane loses properties at 150-200°C. So basalt panels withstand 4 hours, while most chemical insulations — only 30 minutes.`,
    },
    variant: "fire",
  },
  {
    id: 2,
    slug: "basalt-vs-pir-pur-eps",
    cat: "tech",
    date: "2026-04-15",
    minRead: 9,
    title: {
      uz: "Bazalt vs PIR vs PUR vs EPS — qaysi sendvich panelni tanlash",
      ru: "Базальт vs PIR vs PUR vs EPS — какую сэндвич-панель выбрать",
      en: "Basalt vs PIR vs PUR vs EPS — which sandwich panel to choose",
    },
    excerpt: {
      uz: "4 ta asosiy sendvich panel turini taqqoslaymiz: yong'in xavfsizligi, narx, ekologiya va xizmat muddati. Qaysi sizning loyiha uchun mos?",
      ru: "Сравниваем 4 основных типа сэндвич-панелей: пожарная безопасность, цена, экология и срок службы. Какая подходит для вашего проекта?",
      en: "We compare the 4 main types of sandwich panels: fire safety, price, ecology and service life. Which suits your project?",
    },
    body: {
      uz: `Bozorda asosan 4 turdagi sendvich panel mavjud: bazalt, PIR, PUR va EPS. Har birining o'z afzalligi va kamchiligi bor.

**1. Bazalt (Mineralwool)**
- ✅ Yong'in: EI 240 (4 soat) — eng yaxshi
- ✅ Ekologiya: 100% tabiiy
- ⚠️ Issiqlik: 0.035-0.040 W/m·K
- ✅ Akustika: 45 dB
- ✅ Xizmat: 50+ yil
- 💰 Narx: o'rta

**2. PIR (poliizosianurat)**
- ⚠️ Yong'in: EI 30
- ❌ Ekologiya: kimyoviy
- ✅ Issiqlik: 0.022 W/m·K (eng yaxshi)
- ⚠️ Akustika: 25 dB
- ⚠️ Xizmat: 25 yil
- 💰 Narx: yuqori

**3. PUR (poliuretan)**
- ❌ Yong'in: yonadi (B-s2)
- ❌ Ekologiya: kimyoviy
- ✅ Issiqlik: 0.024 W/m·K
- ⚠️ Akustika: 22 dB
- ⚠️ Xizmat: 20 yil
- 💰 Narx: arzon

**4. EPS (penoplast)**
- ❌ Yong'in: yonadi (E)
- ❌ Ekologiya: plastmas
- ⚠️ Issiqlik: 0.038 W/m·K
- ❌ Akustika: 20 dB
- ❌ Xizmat: 15 yil
- 💰 Narx: eng arzon

**Qaysi qachon tanlash?**

**Sanoat / ombor / GMP** → Bazalt (yong'in xavfsizligi)
**Soviqxona** → PIR (eng past λ)
**Vaqtinchalik / arzon** → EPS yoki PUR
**Premium / uzoq muddatli** → Bazalt`,
      ru: `На рынке в основном 4 типа сэндвич-панелей: базальт, PIR, PUR и EPS. У каждого свои плюсы и минусы.

**1. Базальт (Mineralwool)**
- ✅ Огонь: EI 240 (4 часа) — лучший
- ✅ Экология: 100% натуральный
- ⚠️ Тепло: 0.035-0.040 Вт/м·К
- ✅ Акустика: 45 дБ
- ✅ Срок: 50+ лет
- 💰 Цена: средняя

**2. PIR (полиизоцианурат)**
- ⚠️ Огонь: EI 30
- ❌ Экология: химия
- ✅ Тепло: 0.022 Вт/м·К (лучший)
- ⚠️ Акустика: 25 дБ
- ⚠️ Срок: 25 лет
- 💰 Цена: высокая

**3. PUR (полиуретан)**
- ❌ Огонь: горит (B-s2)
- ❌ Экология: химия
- ✅ Тепло: 0.024 Вт/м·К
- ⚠️ Акустика: 22 дБ
- ⚠️ Срок: 20 лет
- 💰 Цена: дешёвая

**4. EPS (пенопласт)**
- ❌ Огонь: горит (E)
- ❌ Экология: пластик
- ⚠️ Тепло: 0.038 Вт/м·К
- ❌ Акустика: 20 дБ
- ❌ Срок: 15 лет
- 💰 Цена: самая дешёвая

**Что выбрать?**

**Промышленность / склад / GMP** → Базальт (пожарная безопасность)
**Холодильник** → PIR (минимальный λ)
**Временное / дешёвое** → EPS или PUR
**Премиум / долгосрочное** → Базальт`,
      en: `The market mainly offers 4 types of sandwich panels: basalt, PIR, PUR and EPS. Each has its pros and cons.

**1. Basalt (Mineralwool)**
- ✅ Fire: EI 240 (4 hours) — best
- ✅ Ecology: 100% natural
- ⚠️ Thermal: 0.035-0.040 W/m·K
- ✅ Acoustic: 45 dB
- ✅ Service: 50+ years
- 💰 Price: medium

**2. PIR (polyisocyanurate)**
- ⚠️ Fire: EI 30
- ❌ Ecology: chemical
- ✅ Thermal: 0.022 W/m·K (best)
- ⚠️ Acoustic: 25 dB
- ⚠️ Service: 25 years
- 💰 Price: high

**3. PUR (polyurethane)**
- ❌ Fire: burns (B-s2)
- ❌ Ecology: chemical
- ✅ Thermal: 0.024 W/m·K
- ⚠️ Acoustic: 22 dB
- ⚠️ Service: 20 years
- 💰 Price: cheap

**4. EPS (polystyrene)**
- ❌ Fire: burns (E)
- ❌ Ecology: plastic
- ⚠️ Thermal: 0.038 W/m·K
- ❌ Acoustic: 20 dB
- ❌ Service: 15 years
- 💰 Price: cheapest

**What to choose?**

**Industry / warehouse / GMP** → Basalt (fire safety)
**Cold storage** → PIR (lowest λ)
**Temporary / cheap** → EPS or PUR
**Premium / long-term** → Basalt`,
    },
    variant: "compare",
  },
  {
    id: 3,
    slug: "2026-uzbekistan-standards",
    cat: "industry",
    date: "2026-03-22",
    minRead: 5,
    title: {
      uz: "2026 yilda O'zbekistonda yangi qurilish standartlari",
      ru: "Новые строительные стандарты в Узбекистане в 2026 году",
      en: "New construction standards in Uzbekistan in 2026",
    },
    excerpt: {
      uz: "ShNQ va GOST hujjatlariga so'nggi o'zgartirishlar. Energiya samaradorligi va yong'in xavfsizligiga yangi talablar.",
      ru: "Последние изменения в ШНК и ГОСТ. Новые требования к энергоэффективности и пожарной безопасности.",
      en: "Latest changes to ShNQ and GOST documents. New requirements for energy efficiency and fire safety.",
    },
    body: {
      uz: "2026 yil boshidan kuchga kirgan yangi qurilish standartlari haqida batafsil ma'lumot.",
      ru: "Подробная информация о новых строительных стандартах, вступивших в силу с начала 2026 года.",
      en: "Detailed information on new construction standards effective from early 2026.",
    },
    variant: "standard",
  },
  {
    id: 4,
    slug: "cold-storage-250mm",
    cat: "project",
    date: "2026-03-08",
    minRead: 6,
    title: {
      uz: "Soviqxona qurilishi: 250mm sendvich panel tanlash",
      ru: "Строительство холодильника: выбор сэндвич-панелей 250мм",
      en: "Cold storage construction: choosing 250mm sandwich panels",
    },
    excerpt: {
      uz: "−25°C dan +30°C gacha haroratda ishlaydigan soviqxona uchun panel hisoblari va montaj texnologiyasi. Toshkentdagi 5000 m² loyiha tajribasi.",
      ru: "Расчёт панелей и технология монтажа для холодильника, работающего при -25°C до +30°C. Опыт проекта 5000 м² в Ташкенте.",
      en: "Panel calculations and installation technology for cold storage operating at -25°C to +30°C. Experience from a 5000 m² project in Tashkent.",
    },
    body: {
      uz: "5000 m² loyiha bo'yicha batafsil case study.",
      ru: "Подробный case study по проекту 5000 м².",
      en: "Detailed case study of a 5000 m² project.",
    },
    variant: "thermal",
  },
  {
    id: 5,
    slug: "basalt-eco-insulation",
    cat: "eco",
    date: "2026-02-19",
    minRead: 4,
    title: {
      uz: "Nima uchun bazalt — eng ekologik izolyatsiya materiali?",
      ru: "Почему базальт — самая экологичная теплоизоляция?",
      en: "Why basalt is the most eco-friendly insulation material",
    },
    excerpt: {
      uz: "100% tabiiy vulqon toshidan tayyorlanadi. Qayta ishlanadi, zararli emas, atrof-muhitga zarar yetkazmaydi. EU eko-sertifikatlari.",
      ru: "Производится из 100% натурального вулканического камня. Перерабатывается, безопасен. ЕС эко-сертификаты.",
      en: "Made from 100% natural volcanic rock. Recyclable, safe, environmentally harmless. EU eco-certifications.",
    },
    body: {
      uz: "Bazalt tola — vulqon toshidan eritilib tayyorlanadi. Hech qanday kimyoviy qo'shimcha yo'q.",
      ru: "Базальтовое волокно производится из плавленого вулканического камня. Без химических добавок.",
      en: "Basalt fiber is made from melted volcanic rock. No chemical additives.",
    },
    variant: "eco",
  },
  {
    id: 6,
    slug: "installation-mistakes",
    cat: "tech",
    date: "2026-02-05",
    minRead: 8,
    title: {
      uz: "Sendvich panel montaji: 7 ta asosiy xato",
      ru: "Монтаж сэндвич-панелей: 7 основных ошибок",
      en: "Sandwich panel installation: 7 common mistakes",
    },
    excerpt: {
      uz: "Tajribali quruvchilar ham qiladigan xatolar — va ulardan qanday qochish kerak. Suvga bo'lib yiqilish, qiya panel, montaj keti.",
      ru: "Ошибки, которые делают даже опытные строители — и как их избежать. Затекание, перекос панелей, последствия монтажа.",
      en: "Mistakes even experienced builders make — and how to avoid them. Water ingress, panel misalignment, post-installation issues.",
    },
    body: {
      uz: "7 ta eng ko'p uchragan montaj xatolari va ulardan qanday qochish.",
      ru: "7 самых распространённых ошибок монтажа и как их избежать.",
      en: "7 most common installation mistakes and how to avoid them.",
    },
    variant: "fire",
  },
];
