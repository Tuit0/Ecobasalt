"use client";
import useSWR from "swr";
import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";
import { fetcher, pickLang } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

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
    type === "good" ? "text-forest-400" :
    type === "bad" ? "text-gold-400" :
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
  const { data: rows = [], isLoading } = useSWR<Row[]>("/api/comparison/rows", fetcher);

  return (
    <section id="comparison" className="py-16 sm:py-20 lg:py-24 bg-onyx-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mb-12"
        >
          <div className="ornament mb-6">
            <span className="text-[11px] tracking-[0.2em] uppercase font-semibold">{t(lang, "comparison.eyebrow")}</span>
          </div>
          <h2 className="h-display text-pearl-100 text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-balance">
            {t(lang, "comparison.title")}
          </h2>
          <p className="text-pearl-200 text-base sm:text-lg leading-relaxed">{t(lang, "comparison.subtitle")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="overflow-x-auto"
        >
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="bg-onyx-800 border-b border-onyx-700">
                <th className="text-left p-4 sm:p-5 text-[10px] tracking-[0.15em] uppercase text-pearl-300 font-semibold border-r border-onyx-700">
                  {t(lang, "comparison.feature")}
                </th>
                <th className="p-4 sm:p-5 text-center bg-gold-400 relative">
                  <div className="text-pearl-100 font-bold text-xs sm:text-sm">{t(lang, "comparison.basalt")}</div>
                  <div className="text-[9px] tracking-[0.15em] uppercase text-pearl-100/80 mt-1 font-semibold">★ Tavsiya</div>
                </th>
                <th className="p-4 sm:p-5 text-center border-r border-onyx-700 text-pearl-200 font-bold text-xs sm:text-sm">
                  {t(lang, "comparison.pir")}
                </th>
                <th className="p-4 sm:p-5 text-center border-r border-onyx-700 text-pearl-200 font-bold text-xs sm:text-sm">
                  {t(lang, "comparison.pur")}
                </th>
                <th className="p-4 sm:p-5 text-center text-pearl-200 font-bold text-xs sm:text-sm">
                  {t(lang, "comparison.eps")}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-onyx-700 last:border-b-0">
                    <td colSpan={5} className="p-5">
                      <div className="h-5 bg-onyx-800 animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-onyx-700 last:border-b-0 hover:bg-onyx-900/50 transition-colors"
                  >
                    <td className="p-3 sm:p-4 text-pearl-100 text-xs sm:text-sm font-medium border-r border-onyx-700">
                      {pickLang(r, lang, "feature")}
                    </td>
                    <td className="bg-gold-400/5 border-x border-gold-400/30">
                      <Cell value={pickLang(r, lang, "basalt_value")} type={r.basalt_type} />
                    </td>
                    <td className="border-r border-onyx-700">
                      <Cell value={pickLang(r, lang, "pir_value")} type={r.pir_type} />
                    </td>
                    <td className="border-r border-onyx-700">
                      <Cell value={pickLang(r, lang, "pur_value")} type={r.pur_type} />
                    </td>
                    <td>
                      <Cell value={pickLang(r, lang, "eps_value")} type={r.eps_type} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
