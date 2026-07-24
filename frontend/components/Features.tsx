"use client";
import useSWR from "swr";
import { motion } from "framer-motion";
import {
  Flame, Leaf, Shield, Snowflake, Volume2, Hourglass,
  Sparkles, Award, Zap, Lock, Globe, Thermometer,
} from "lucide-react";
import { fetcher, pickLang } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { useSectionVisible } from "@/lib/section-visibility";

type Feature = {
  id: number;
  key: string;
  icon: string;
  title_uz: string; title_ru: string; title_en: string;
  description_uz: string; description_ru: string; description_en: string;
  order: number;
};

const ICONS: Record<string, any> = {
  Flame, Leaf, Shield, Snowflake, Volume2, Hourglass,
  Sparkles, Award, Zap, Lock, Globe, Thermometer,
};

const COLORS = [
  { bg: "from-red-500/20 to-red-500/5", border: "border-red-500/30", icon: "text-red-400" },
  { bg: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/30", icon: "text-emerald-400" },
  { bg: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/30", icon: "text-amber-400" },
  { bg: "from-sky-500/20 to-sky-500/5", border: "border-sky-500/30", icon: "text-sky-400" },
  { bg: "from-violet-500/20 to-violet-500/5", border: "border-violet-500/30", icon: "text-violet-400" },
  { bg: "from-rose-500/20 to-rose-500/5", border: "border-rose-500/30", icon: "text-rose-400" },
];

// Fallback "Почему выбирают ECO BASALT" — 6 ta karta (mijoz feedback)
const FALLBACK_FEATURES: Feature[] = [
  {
    id: -1, key: "fire", icon: "Flame", order: 1,
    title_uz: "Yong'inbardoshlik",
    title_ru: "Огнестойкость",
    title_en: "Fire Resistance",
    description_uz: "Ekstremal haroratlar bilan sinovdan o'tgan xavfsizlik.",
    description_ru: "Безопасность, проверенная экстремальными температурами.",
    description_en: "Safety proven by extreme temperatures.",
  },
  {
    id: -2, key: "thermal", icon: "Thermometer", order: 2,
    title_uz: "Samarali issiqlik izolyatsiyasi",
    title_ru: "Эффективная теплоизоляция",
    title_en: "Effective Thermal Insulation",
    description_uz: "Issiqlik yo'qotishlarini kamaytiradi va binolarning energiya samaradorligini oshiradi.",
    description_ru: "Снижает теплопотери и повышает энергоэффективность объектов.",
    description_en: "Reduces heat loss and improves energy efficiency of buildings.",
  },
  {
    id: -3, key: "eco", icon: "Leaf", order: 3,
    title_uz: "Ekologik toza",
    title_ru: "Экологичность",
    title_en: "Eco-Friendly",
    description_uz: "Tabiiy kelib chiqishi va ekologik xavfsizligi.",
    description_ru: "Природное происхождение и экологическая безопасность.",
    description_en: "Natural origin and environmental safety.",
  },
  {
    id: -4, key: "sound", icon: "Volume2", order: 4,
    title_uz: "Ovoz yutish",
    title_ru: "Звукопоглощение",
    title_en: "Sound Absorption",
    description_uz: "Xonalarning akustik qulayligini oshiradi.",
    description_ru: "Повышает акустический комфорт помещений.",
    description_en: "Improves acoustic comfort of spaces.",
  },
  {
    id: -5, key: "durable", icon: "Hourglass", order: 5,
    title_uz: "Uzoq umr",
    title_ru: "Долговечность",
    title_en: "Longevity",
    description_uz: "O'nlab yillar davomida ish xususiyatlarini saqlab qoladi.",
    description_ru: "Сохраняет эксплуатационные характеристики на протяжении десятилетий.",
    description_en: "Retains performance characteristics for decades.",
  },
  {
    id: -6, key: "european_tech", icon: "Award", order: 6,
    title_uz: "Yevropa ishlab chiqarish texnologiyalari",
    title_ru: "Европейские технологии производства",
    title_en: "European Manufacturing Technology",
    description_uz: "Italyan ishlab chiqarilgan zamonaviy uskunalar mahsulotning yuqori va barqaror sifatini ta'minlaydi.",
    description_ru: "Современное оборудование итальянского производства обеспечивает высокое и стабильное качество продукции.",
    description_en: "Modern Italian-made equipment ensures consistently high product quality.",
  },
];

export default function Features() {
  const { lang } = useLang();
  const visible = useSectionVisible("features");
  const { data, isLoading } = useSWR<Feature[]>("/api/features", fetcher);
  const features: Feature[] = data && data.length > 0 ? data : FALLBACK_FEATURES;

  if (!visible) return null;

  return (
    <section id="features" className="py-20 sm:py-28 lg:py-32 bg-onyx-900 relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-50" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mb-12 sm:mb-16"
        >
          <span className="badge-pill mb-5">
            {t(lang, "features.eyebrow")}
          </span>
          <h2 className="h-display text-pearl-100 text-4xl sm:text-5xl md:text-6xl mb-5 text-balance">
            {t(lang, "features.title")}
          </h2>
          <p className="text-pearl-200 text-base sm:text-lg leading-relaxed">
            {t(lang, "features.subtitle")}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="feature-card p-7">
                <div className="skeleton w-14 h-14 mb-5" />
                <div className="skeleton h-6 w-2/3 mb-3" />
                <div className="skeleton h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {features.map((f, i) => {
              const Icon = ICONS[f.icon] || Shield;
              const c = COLORS[i % COLORS.length];
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: (i % 3) * 0.08, duration: 0.6 }}
                  whileHover={{ y: -8 }}
                  className="feature-card p-7 sm:p-8 group"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.bg} border ${c.border} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <Icon className={`w-6 h-6 ${c.icon}`} strokeWidth={1.8} />
                  </div>

                  <h3 className="h-display text-pearl-100 text-xl sm:text-2xl mb-3 group-hover:text-gradient-red transition-all">
                    {pickLang(f, lang, "title")}
                  </h3>

                  <p className="text-pearl-200 text-sm sm:text-base leading-relaxed">
                    {pickLang(f, lang, "description")}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
