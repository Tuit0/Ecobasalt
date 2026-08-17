"use client";
import { motion } from "framer-motion";
import { Factory, Sprout, ShieldCheck, Globe2 } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { useSectionVisible } from "@/lib/section-visibility";

const PILLARS = [
  {
    icon: Factory,
    key: "modern",
    title_uz: "Zamonaviy ishlab chiqarish",
    title_ru: "Современное производство",
    title_en: "Modern Manufacturing",
    desc_uz: "Yevropa uskunalari va avtomatlashtirilgan liniyalar bilan jihozlangan yangi zavod.",
    desc_ru: "Новый завод с европейским оборудованием и автоматизированными линиями.",
    desc_en: "New facility equipped with European machinery and automated production lines.",
    color: "from-gold-500/25 to-gold-600/5",
    border: "border-gold-400/30",
    iconColor: "text-gold-400",
  },
  {
    icon: Sprout,
    key: "natural",
    title_uz: "Tabiiy xomashyo",
    title_ru: "Натуральное сырьё",
    title_en: "Natural Raw Material",
    desc_uz: "Faqat toza vulqon bazaltidan foydalanamiz — hech qanday kimyoviy qo'shimchalarsiz.",
    desc_ru: "Используем только чистый вулканический базальт — без химических добавок.",
    desc_en: "Only pure volcanic basalt — no chemical additives.",
    color: "from-emerald-500/25 to-emerald-600/5",
    border: "border-emerald-400/30",
    iconColor: "text-emerald-400",
  },
  {
    icon: ShieldCheck,
    key: "quality",
    title_uz: "Sifat nazorati",
    title_ru: "Контроль качества",
    title_en: "Quality Control",
    desc_uz: "Har bir partiya laboratoriya sinovidan o'tadi — xalqaro standartlarga to'liq mos.",
    desc_ru: "Каждая партия проходит лабораторные испытания — полное соответствие международным стандартам.",
    desc_en: "Every batch undergoes lab testing — full compliance with international standards.",
    color: "from-sky-500/25 to-sky-600/5",
    border: "border-sky-400/30",
    iconColor: "text-sky-400",
  },
  {
    icon: Globe2,
    key: "logistics",
    title_uz: "Logistika va eksport",
    title_ru: "Логистика и экспорт",
    title_en: "Logistics & Export",
    desc_uz: "O'zbekiston bo'ylab yetkazib berish va xalqaro yo'nalishlarga eksport.",
    desc_ru: "Готовность к внутренним поставкам по Узбекистану и международным экспортным направлениям.",
    desc_en: "Ready for domestic delivery across Uzbekistan and international export routes.",
    color: "from-violet-500/25 to-violet-600/5",
    border: "border-violet-400/30",
    iconColor: "text-violet-400",
  },
];

export default function WhyEcoBasalt() {
  const { lang } = useLang();
  const visible = useSectionVisible("why_eco_basalt");
  if (!visible) return null;

  return (
    <section id="why-eco-basalt" className="py-14 sm:py-20 lg:py-28 xl:py-32 bg-onyx-900 relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-40" />
      <div className="orb orb-warm w-[600px] h-[600px] -top-40 -left-40 opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mb-14 sm:mb-16"
        >
          <span className="badge-pill mb-5">
            {t(lang, "why.eyebrow")}
          </span>
          <h2 className="h-display text-pearl-100 text-4xl sm:text-5xl md:text-6xl mb-5 text-balance">
            {t(lang, "why.title").split(" ")[0]}{" "}
            <span className="text-gradient-red">{t(lang, "why.title").split(" ").slice(1).join(" ")}</span>
          </h2>
          <p className="text-pearl-200 text-base sm:text-lg leading-relaxed max-w-2xl">
            {t(lang, "why.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            const title = (p as any)[`title_${lang}`] || p.title_ru;
            const desc = (p as any)[`desc_${lang}`] || p.desc_ru;
            return (
              <motion.div
                key={p.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: (i % 2) * 0.1, duration: 0.6 }}
                whileHover={{ y: -6 }}
                className="feature-card p-7 sm:p-9 group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${p.color} border ${p.border} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <Icon className={`w-7 h-7 ${p.iconColor}`} strokeWidth={1.8} />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs text-pearl-300 tracking-wider">
                    0{i + 1}
                  </span>
                  <div className="h-px flex-1 bg-pearl-100/10" />
                </div>
                <h3 className="h-display text-pearl-100 text-2xl sm:text-3xl mb-3 group-hover:text-gradient-red transition-all">
                  {title}
                </h3>
                <p className="text-pearl-200 text-sm sm:text-base leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
