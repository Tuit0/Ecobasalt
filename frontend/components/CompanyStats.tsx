"use client";
import { motion } from "framer-motion";
import useSWR from "swr";
import { MapPin, Users, Factory, Package, Layers, Sprout, DollarSign, Boxes } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { fetcher, blocksToMap, pickLang } from "@/lib/api";
import { t } from "@/lib/i18n";
import { useSectionVisible } from "@/lib/section-visibility";

type Stat = {
  icon: any;
  key: string;
  value_uz: string; value_ru: string; value_en: string;
  label_uz: string; label_ru: string; label_en: string;
};

const DEFAULTS: Stat[] = [
  {
    icon: MapPin,
    key: "area",
    value_uz: "7,8 ga", value_ru: "7,8 га", value_en: "7.8 ha",
    label_uz: "Ishlab chiqarish maydoni",
    label_ru: "Территория производства",
    label_en: "Production area",
  },
  {
    icon: Users,
    key: "jobs",
    value_uz: "300", value_ru: "300", value_en: "300",
    label_uz: "Ish o'rinlari",
    label_ru: "Рабочие места",
    label_en: "Jobs created",
  },
  {
    icon: Factory,
    key: "capacity",
    value_uz: "50 000 t", value_ru: "50 000 т", value_en: "50,000 t",
    label_uz: "Yillik ishlab chiqarish quvvati",
    label_ru: "Годовая мощность производства",
    label_en: "Annual production capacity",
  },
  {
    icon: DollarSign,
    key: "investment",
    value_uz: "—", value_ru: "—", value_en: "—",
    label_uz: "Loyihaga investitsiya",
    label_ru: "Инвестиции в проект",
    label_en: "Project investment",
  },
  {
    icon: Boxes,
    key: "assortment",
    value_uz: "—", value_ru: "—", value_en: "—",
    label_uz: "Mahsulot kategoriyalari",
    label_ru: "Ассортимент продукции",
    label_en: "Product categories",
  },
  {
    icon: Layers,
    key: "directions",
    value_uz: "2", value_ru: "2", value_en: "2",
    label_uz: "Ishlab chiqarish yo'nalishi",
    label_ru: "Направления производства",
    label_en: "Production directions",
  },
];

export default function CompanyStats() {
  const { lang } = useLang();
  const visible = useSectionVisible("company_stats");
  const { data } = useSWR("/api/content/blocks?section=company_stats", fetcher);
  const blocks = blocksToMap(data || []);

  if (!visible) return null;

  // Har bir statistika uchun CMS override — masalan block "company_stats.area.value" bo'lsa
  const items = DEFAULTS.map((s) => ({
    ...s,
    value: pickLang(blocks[`company_stats.${s.key}.value`], lang) || pickLang(s, lang, "value"),
    label: pickLang(blocks[`company_stats.${s.key}.label`], lang) || pickLang(s, lang, "label"),
  }));

  return (
    <section id="company-stats" className="py-20 sm:py-28 lg:py-32 bg-onyx-950 relative overflow-hidden border-y border-pearl-100/5">
      <div className="orb orb-red w-[500px] h-[500px] top-0 left-1/2 -translate-x-1/2 opacity-25" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mb-12 sm:mb-16 text-center mx-auto"
        >
          <span className="badge-pill mb-5">
            {t(lang, "company_stats.eyebrow")}
          </span>
          <h2 className="h-display text-pearl-100 text-4xl sm:text-5xl md:text-6xl mb-5 text-balance">
            {t(lang, "company_stats.title")}
          </h2>
          <p className="text-pearl-200 text-base sm:text-lg leading-relaxed">
            {t(lang, "company_stats.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {items.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                whileHover={{ y: -6 }}
                className="group bg-onyx-800/40 backdrop-blur-xl border border-pearl-100/10 hover:border-gold-400/40 rounded-3xl p-6 sm:p-8 text-center transition-all duration-500"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-600/5 border border-gold-400/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Icon className="w-6 h-6 text-gold-400" strokeWidth={1.8} />
                </div>
                <div className="h-display text-3xl sm:text-4xl md:text-5xl text-pearl-100 mb-2 group-hover:text-gradient-red transition-all">
                  {s.value}
                </div>
                <div className="text-pearl-300 text-xs sm:text-sm leading-snug">
                  {s.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
