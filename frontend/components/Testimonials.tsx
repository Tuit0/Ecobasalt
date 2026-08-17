"use client";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { useSectionVisible } from "@/lib/section-visibility";

const TESTIMONIALS = [
  {
    name: "Akmal Karimov",
    role_uz: "Bosh muhandis", role_ru: "Главный инженер", role_en: "Chief Engineer",
    company: "ARTEL Manufacturing",
    avatar: "AK",
    rating: 5,
    quote_uz: "ECO BASALT bilan 3 yil hamkorlik qilmoqdamiz. Sifat va muddatlar — har doim so'zida turadigan kompaniya. EI 240 sertifikatli panellar ish vaqtimizni 30% qisqartirdi.",
    quote_ru: "Сотрудничаем 3 года. Качество и сроки — компания всегда держит слово. Панели с EI 240 сократили время монтажа на 30%.",
    quote_en: "Working with them for 3 years. Quality and timelines — they always keep their word. EI 240 panels cut installation time by 30%.",
  },
  {
    name: "Dilshod Yusupov",
    role_uz: "Loyiha direktori", role_ru: "Директор проектов", role_en: "Project Director",
    company: "Magnit Logistics",
    avatar: "DY",
    rating: 5,
    quote_uz: "12 000 m² omborni 6 hafta ichida yopdik. Texnik qo'llab-quvvatlash darajasi yuqori, sertifikatlar to'liq. Yana ishlaymiz albatta.",
    quote_ru: "Закрыли 12 000 м² склада за 6 недель. Высокий уровень техподдержки, все сертификаты на руках. Обязательно продолжим работу.",
    quote_en: "Covered 12,000 m² warehouse in 6 weeks. High level of tech support, all certificates in hand. Will definitely continue.",
  },
  {
    name: "Saodat Rasulova",
    role_uz: "CFO", role_ru: "Финансовый директор", role_en: "CFO",
    company: "Biokimyo Pharma",
    avatar: "SR",
    rating: 5,
    quote_uz: "GMP standartlariga mos toza xona qurish — qiyin vazifa edi. ECO BASALT mutaxassislari hamma narsani avval ishlab chiqib, montajni 5 hafta oldin tugatdi.",
    quote_ru: "Строительство чистых помещений по GMP — сложная задача. Специалисты ECO BASALT всё рассчитали и завершили монтаж на 5 недель раньше.",
    quote_en: "Building GMP-compliant clean rooms was challenging. ECO BASALT specialists pre-engineered everything and finished 5 weeks ahead.",
  },
];

export default function Testimonials() {
  const { lang } = useLang();
  const visible = useSectionVisible("testimonials");
  if (!visible) return null;

  return (
    <section className="py-14 sm:py-20 lg:py-28 xl:py-32 bg-onyx-950 relative overflow-hidden">
      <div className="orb orb-warm w-[500px] h-[500px] top-0 left-1/4 opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <span className="badge-pill mb-5">
            {lang === "uz" ? "MIJOZ FIKRLARI" : lang === "ru" ? "ОТЗЫВЫ" : "TESTIMONIALS"}
          </span>
          <h2 className="h-display text-pearl-100 text-4xl sm:text-5xl md:text-6xl mb-5 text-balance leading-tight">
            {lang === "uz" ? (
              <>Mijozlar <span className="text-gradient-red">biz haqimizda</span></>
            ) : lang === "ru" ? (
              <>Что говорят <span className="text-gradient-red">наши клиенты</span></>
            ) : (
              <>What <span className="text-gradient-red">clients say</span></>
            )}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              whileHover={{ y: -6 }}
              className="lux-card p-6 sm:p-8 relative group"
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 w-10 h-10 text-gold-400/10 group-hover:text-gold-400/20 transition-colors" strokeWidth={1.5} />

              {/* Rating */}
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-gold-400 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-pearl-100 text-base sm:text-lg leading-relaxed mb-7 relative">
                "{lang === "uz" ? t.quote_uz : lang === "ru" ? t.quote_ru : t.quote_en}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4 pt-5 border-t border-pearl-100/10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-pearl-100 font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-pearl-100 text-sm">{t.name}</div>
                  <div className="text-pearl-300 text-xs">
                    {lang === "uz" ? t.role_uz : lang === "ru" ? t.role_ru : t.role_en} · {t.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
