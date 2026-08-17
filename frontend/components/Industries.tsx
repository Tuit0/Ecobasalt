"use client";
import { motion } from "framer-motion";
import { Snowflake, Warehouse, Factory, ShoppingBag, Heart, Tractor } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { useSectionVisible } from "@/lib/section-visibility";

const INDUSTRIES = [
  {
    icon: Snowflake,
    color: "from-sky-500/20 to-sky-500/5",
    border: "border-sky-500/30",
    iconColor: "text-sky-400",
    title_uz: "Soviqxonalar", title_ru: "Холодильники", title_en: "Cold Storage",
    desc_uz: "−25°C dan +30°C gacha sterile sharoit",
    desc_ru: "От −25°C до +30°C стерильные условия",
    desc_en: "From −25°C to +30°C sterile environment",
  },
  {
    icon: Warehouse,
    color: "from-amber-500/20 to-amber-500/5",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
    title_uz: "Logistika", title_ru: "Логистика", title_en: "Logistics",
    desc_uz: "Omborlar va distribyutsiya markazlari",
    desc_ru: "Склады и распределительные центры",
    desc_en: "Warehouses and distribution centers",
  },
  {
    icon: Factory,
    color: "from-purple-500/20 to-purple-500/5",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
    title_uz: "Sanoat", title_ru: "Промышленность", title_en: "Industrial",
    desc_uz: "Zavod va ishlab chiqarish maydonlari",
    desc_ru: "Заводы и производственные площади",
    desc_en: "Factories and production facilities",
  },
  {
    icon: ShoppingBag,
    color: "from-rose-500/20 to-rose-500/5",
    border: "border-rose-500/30",
    iconColor: "text-rose-400",
    title_uz: "Savdo", title_ru: "Ретейл", title_en: "Retail",
    desc_uz: "Savdo markazlari va do'konlar",
    desc_ru: "Торговые центры и магазины",
    desc_en: "Shopping malls and stores",
  },
  {
    icon: Heart,
    color: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    title_uz: "Farmatsevtika", title_ru: "Фармацевтика", title_en: "Pharma",
    desc_uz: "GMP standartlari va toza xonalar",
    desc_ru: "Стандарты GMP и чистые помещения",
    desc_en: "GMP standards and clean rooms",
  },
  {
    icon: Tractor,
    color: "from-lime-500/20 to-lime-500/5",
    border: "border-lime-500/30",
    iconColor: "text-lime-400",
    title_uz: "Qishloq xo'jaligi", title_ru: "Агро", title_en: "Agriculture",
    desc_uz: "Fermalar va don omborlari",
    desc_ru: "Фермы и зернохранилища",
    desc_en: "Farms and grain storage",
  },
];

export default function Industries() {
  const { lang } = useLang();
  const visible = useSectionVisible("industries");
  if (!visible) return null;

  return (
    <section className="py-14 sm:py-20 lg:py-28 xl:py-32 bg-onyx-900 relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-40" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <span className="badge-pill mb-5">
            {lang === "uz" ? "SOHALAR" : lang === "ru" ? "ОТРАСЛИ" : "INDUSTRIES"}
          </span>
          <h2 className="h-display text-pearl-100 text-4xl sm:text-5xl md:text-6xl mb-5 text-balance leading-tight">
            {lang === "uz" ? (
              <>Biz <span className="text-gradient-red">6 ta sohada</span> ishlaymiz</>
            ) : lang === "ru" ? (
              <>Мы работаем в <span className="text-gradient-red">6 отраслях</span></>
            ) : (
              <>We serve <span className="text-gradient-red">6 industries</span></>
            )}
          </h2>
          <p className="text-pearl-200 text-base sm:text-lg">
            {lang === "uz" ? "Har bir soha — o'z talablari va biz ularning hammasiga tayyormiz." : lang === "ru" ? "Каждая отрасль — свои требования, и мы готовы к каждой из них." : "Each industry has unique requirements — we're ready for them all."}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {INDUSTRIES.map((ind, i) => {
            const Icon = ind.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="lux-card p-5 sm:p-6 cursor-pointer group"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${ind.color} border ${ind.border} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${ind.iconColor}`} strokeWidth={1.8} />
                </div>
                <h3 className="h-display text-pearl-100 text-lg sm:text-xl mb-2">
                  {lang === "uz" ? ind.title_uz : lang === "ru" ? ind.title_ru : ind.title_en}
                </h3>
                <p className="text-pearl-200 text-xs sm:text-sm leading-relaxed">
                  {lang === "uz" ? ind.desc_uz : lang === "ru" ? ind.desc_ru : ind.desc_en}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
