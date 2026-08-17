"use client";
import useSWR from "swr";
import { motion } from "framer-motion";
import { Check, X, Minus, Star } from "lucide-react";
import { fetcher, pickLang } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { useSectionVisible } from "@/lib/section-visibility";

type CellType = "good" | "neutral" | "bad";

type Row = {
  id: number;
  feature_uz: string; feature_ru: string; feature_en: string;
  basalt_value_uz: string; basalt_value_ru: string; basalt_value_en: string; basalt_type: CellType;
  pir_value_uz: string; pir_value_ru: string; pir_value_en: string; pir_type: CellType;
  pur_value_uz: string; pur_value_ru: string; pur_value_en: string; pur_type: CellType;
  eps_value_uz: string; eps_value_ru: string; eps_value_en: string; eps_type: CellType;
};

function Cell({ value, type }: { value: string; type: CellType }) {
  const icon = type === "good" ? Check : type === "bad" ? X : Minus;
  const Icon = icon;
  const color =
    type === "good" ? "text-emerald-400" :
    type === "bad" ? "text-red-400" :
    "text-pearl-300";

  return (
    <td className="px-3 sm:px-4 py-4 sm:py-5 text-center">
      <div className="flex items-center justify-center gap-2">
        <Icon className={`w-4 h-4 ${color} flex-shrink-0`} strokeWidth={2.5} />
        <span className="text-pearl-100 text-xs sm:text-sm font-medium">{value}</span>
      </div>
    </td>
  );
}

export default function Comparison() {
  const { lang } = useLang();
  const visible = useSectionVisible("comparison");
  const { data: rows = [], isLoading } = useSWR<Row[]>("/api/comparison/rows", fetcher);

  if (!visible) return null;

  return (
    <section id="comparison" className="py-14 sm:py-20 lg:py-28 xl:py-32 bg-onyx-950 relative overflow-hidden">
      <div className="orb orb-red w-[500px] h-[500px] top-0 right-0 opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mb-12 sm:mb-14"
        >
          <span className="badge-pill mb-5">{t(lang, "comparison.eyebrow")}</span>
          <h2 className="h-display text-pearl-100 text-4xl sm:text-5xl md:text-6xl mb-4 text-balance leading-tight">
            {t(lang, "comparison.title").split(" ")[0]}{" "}
            <span className="text-gradient-red">{t(lang, "comparison.title").split(" ").slice(1).join(" ")}</span>
          </h2>
          <p className="text-pearl-200 text-base sm:text-lg leading-relaxed">{t(lang, "comparison.subtitle")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-3xl overflow-hidden border border-pearl-100/5 backdrop-blur-sm bg-onyx-900/50"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="bg-onyx-900/60 border-b border-pearl-100/8">
                  <th className="text-left p-5 text-xs font-semibold text-pearl-300 uppercase tracking-wider">
                    {t(lang, "comparison.feature")}
                  </th>
                  <th className="p-5 text-center bg-gradient-to-b from-gold-400/15 to-gold-400/5 border-x border-gold-400/30 relative">
                    <div className="flex flex-col items-center gap-1.5">
                      <Star className="w-4 h-4 text-gold-400 fill-current" />
                      <div className="text-pearl-100 font-bold text-sm">{t(lang, "comparison.basalt")}</div>
                      <div className="text-[10px] text-gold-400 font-semibold">
                        {lang === "uz" ? "TAVSIYA" : lang === "ru" ? "РЕКОМЕНДУЕМ" : "RECOMMENDED"}
                      </div>
                    </div>
                  </th>
                  <th className="p-5 text-center text-pearl-200 font-bold text-sm">{t(lang, "comparison.pir")}</th>
                  <th className="p-5 text-center text-pearl-200 font-bold text-sm">{t(lang, "comparison.pur")}</th>
                  <th className="p-5 text-center text-pearl-200 font-bold text-sm">{t(lang, "comparison.eps")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-pearl-100/5 last:border-b-0">
                      <td colSpan={5} className="p-5">
                        <div className="skeleton h-5" />
                      </td>
                    </tr>
                  ))
                ) : (
                  rows.map((r, idx) => (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.06, duration: 0.4 }}
                      className="border-b border-pearl-100/5 last:border-b-0 hover:bg-pearl-100/[0.02] transition-colors"
                    >
                      <td className="p-4 text-pearl-100 text-sm font-medium">
                        {pickLang(r, lang, "feature")}
                      </td>
                      <td className="bg-gold-400/5 border-x border-gold-400/30">
                        <Cell value={pickLang(r, lang, "basalt_value")} type={r.basalt_type} />
                      </td>
                      <td><Cell value={pickLang(r, lang, "pir_value")} type={r.pir_type} /></td>
                      <td><Cell value={pickLang(r, lang, "pur_value")} type={r.pur_type} /></td>
                      <td><Cell value={pickLang(r, lang, "eps_value")} type={r.eps_type} /></td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
