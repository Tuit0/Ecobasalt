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

export default function Features() {
  const { lang } = useLang();
  const { data: features = [], isLoading } = useSWR<Feature[]>("/api/features", fetcher);

  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24 bg-onyx-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mb-12 sm:mb-16"
        >
          <div className="ornament mb-5 sm:mb-6">
            <span className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-semibold">{t(lang, "features.eyebrow")}</span>
          </div>
          <h2 className="h-display text-pearl-100 text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 text-balance">
            {t(lang, "features.title")}
          </h2>
          <p className="text-pearl-200 text-base sm:text-lg leading-relaxed">
            {t(lang, "features.subtitle")}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-onyx-700">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-onyx-900 p-6 sm:p-8 animate-pulse">
                <div className="w-12 h-12 bg-onyx-800 mb-6" />
                <div className="h-6 bg-onyx-800 w-2/3 mb-3" />
                <div className="h-4 bg-onyx-800 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-onyx-700">
            {features.map((f, i) => {
              const Icon = ICONS[f.icon] || Shield;
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: (i % 3) * 0.08, duration: 0.6 }}
                  className="bg-onyx-900 p-6 sm:p-8 group hover:bg-onyx-800 transition-colors relative"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 flex items-center justify-center border border-onyx-700 group-hover:border-gold-400 group-hover:bg-gold-400/5 transition-colors">
                      <Icon className="w-5 h-5 text-gold-400" strokeWidth={1.8} />
                    </div>
                    <div className="text-[10px] font-mono text-pearl-300 tracking-[0.2em]">
                      {String(i + 1).padStart(2, "0")} / {String(features.length).padStart(2, "0")}
                    </div>
                  </div>

                  <h3 className="h-display text-pearl-100 text-2xl mb-3 group-hover:text-gold-400 transition-colors">
                    {pickLang(f, lang, "title")}
                  </h3>

                  <p className="text-pearl-200 text-base leading-relaxed">
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
