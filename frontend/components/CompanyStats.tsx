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
  unit_uz?: string; unit_ru?: string; unit_en?: string;
  label_uz: string; label_ru: string; label_en: string;
};

// Number va unit alohida — birlik shriftini raqamdan ~15-20% kichik ko'rsatish uchun
const DEFAULTS: Stat[] = [
  {
    icon: MapPin,
    key: "area",
    value_uz: "7,8", value_ru: "7,8", value_en: "7.8",
    unit_uz: "ga", unit_ru: "га", unit_en: "ha",
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
    value_uz: "50 000", value_ru: "50 000", value_en: "50,000",
    unit_uz: "t", unit_ru: "т", unit_en: "t",
    label_uz: "Yillik ishlab chiqarish quvvati",
    label_ru: "Годовая мощность производства",
    label_en: "Annual production capacity",
  },
  {
    icon: DollarSign,
    key: "investment",
    value_uz: "68 000 000", value_ru: "68 000 000", value_en: "68,000,000",
    unit_uz: "$", unit_ru: "$", unit_en: "$",
    label_uz: "Loyihaga investitsiya",
    label_ru: "Инвестиции в проект",
    label_en: "Project investment",
  },
  {
    icon: Boxes,
    key: "assortment",
    value_uz: "Tez orada", value_ru: "Скоро", value_en: "Soon",
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

  const items = DEFAULTS.map((s) => ({
    ...s,
    value: pickLang(blocks[`company_stats.${s.key}.value`], lang) || pickLang(s, lang, "value"),
    unit: (s.unit_uz || s.unit_ru || s.unit_en)
      ? (pickLang(blocks[`company_stats.${s.key}.unit`], lang) || pickLang(s, lang, "unit"))
      : "",
    label: pickLang(blocks[`company_stats.${s.key}.label`], lang) || pickLang(s, lang, "label"),
  }));

  return (
    <section id="company-stats" className="py-20 sm:py-28 lg:py-32 bg-onyx-950 relative overflow-hidden border-y border-pearl-100/5">
      <div className="orb orb-red w-[500px] h-[500px] top-0 -left-40 opacity-25" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header — left-aligned (mos ravishda Features bilan) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mb-8"
        >
          <span className="badge-pill mb-4">
            {t(lang, "company_stats.eyebrow")}
          </span>
          <h2 className="h-display text-pearl-100 text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4">
            {t(lang, "company_stats.title")}
          </h2>
          <p className="text-pearl-200 text-base sm:text-lg leading-relaxed max-w-3xl">
            {t(lang, "company_stats.subtitle").replace(/ECO BASALT/g, "ECO BASALT")}
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
                {/* Raqam va birlik: birlik shrifti ~15-20% kichkina, NBSP wrap-siz */}
                <div className="mb-2 flex items-baseline justify-center gap-2 flex-wrap">
                  <span className="h-display text-3xl sm:text-4xl md:text-5xl text-pearl-100 group-hover:text-gradient-red transition-all leading-none whitespace-nowrap">
                    {s.value.replace(/ /g, " ")}
                  </span>
                  {s.unit && (
                    <span className="h-display text-2xl sm:text-[1.75rem] md:text-3xl text-pearl-100/85 group-hover:text-gradient-red transition-all leading-none">
                      {s.unit}
                    </span>
                  )}
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
