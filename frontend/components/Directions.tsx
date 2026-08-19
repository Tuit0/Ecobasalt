"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Factory, Sprout, Layers3 } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { useSectionVisible } from "@/lib/section-visibility";

/**
 * 3 asosiy yo'nalish — hero'dan pastda alohida section
 * Premium magazine editorial stili
 */
export default function Directions() {
  const { lang } = useLang();
  const visible = useSectionVisible("directions");
  if (!visible) return null;

  const items = [
    {
      href: "/products?cat=thermal",
      Icon: Factory,
      title: t(lang, "hero.cta_thermal"),
      desc: t(lang, "hero.cta_thermal_desc"),
      accent: "text-gold-400",
      accentBg: "bg-gold-500/10 border-gold-400/20",
    },
    {
      href: "/products?cat=hydroponics",
      Icon: Sprout,
      title: t(lang, "hero.cta_hydroponics"),
      desc: t(lang, "hero.cta_hydroponics_desc"),
      accent: "text-forest-400",
      accentBg: "bg-forest-500/10 border-forest-400/20",
    },
    {
      href: "/products?cat=panels",
      Icon: Layers3,
      title: t(lang, "hero.cta_panels"),
      desc: t(lang, "hero.cta_panels_desc"),
      accent: "text-sky-400",
      accentBg: "bg-sky-500/10 border-sky-400/20",
    },
  ];

  return (
    <section className="relative bg-onyx-950 py-16 sm:py-20 lg:py-24 border-b border-pearl-100/5 overflow-hidden">
      <div className="orb orb-red w-[500px] h-[500px] -top-40 -left-40 opacity-20" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        {/* Section eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-8 sm:mb-12"
        >
          <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-gold-400 mb-3">
            <span className="w-8 h-px bg-gold-400" />
            {lang === "uz" ? "YO'NALISHLARIMIZ" : lang === "ru" ? "НАШИ НАПРАВЛЕНИЯ" : "OUR DIRECTIONS"}
          </span>
          <h2 className="h-display text-pearl-100 text-3xl sm:text-4xl lg:text-5xl max-w-2xl leading-tight">
            {lang === "uz"
              ? "3 ta asosiy mahsulot yo'nalishi"
              : lang === "ru"
              ? "3 ключевых направления продукции"
              : "3 core product directions"}
          </h2>
        </motion.div>

        {/* 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {items.map((c, i) => {
            const Icon = c.Icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={c.href}
                  className="group relative block p-6 sm:p-8 rounded-3xl bg-onyx-900/60 border border-pearl-100/10 hover:border-pearl-100/25 hover:bg-onyx-900/90 transition-all duration-500 h-full overflow-hidden"
                >
                  {/* Ekstra glow on hover */}
                  <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-pearl-100/[0.02] group-hover:bg-pearl-100/[0.06] blur-3xl transition-all duration-700" />

                  <div className="relative">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border ${c.accentBg} mb-6 group-hover:scale-105 transition-transform duration-500`}>
                      <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${c.accent}`} strokeWidth={1.6} />
                    </div>

                    {/* Number label */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-mono text-xs text-pearl-300 tracking-widest">0{i + 1}</span>
                      <div className="h-px flex-1 bg-pearl-100/10 group-hover:bg-pearl-100/25 transition-colors" />
                    </div>

                    {/* Title */}
                    <h3 className="h-display text-pearl-50 text-xl sm:text-2xl mb-3 leading-tight group-hover:text-gradient-red transition-all">
                      {c.title}
                    </h3>

                    {/* Description */}
                    <p className="text-pearl-200 text-sm sm:text-[15px] leading-relaxed mb-6 min-h-[3rem]">
                      {c.desc}
                    </p>

                    {/* CTA arrow */}
                    <div className="flex items-center gap-2 text-pearl-100 font-semibold text-sm group-hover:text-gold-400 transition-colors">
                      <span>{t(lang, "hero.cta_view_catalog")}</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" strokeWidth={2.5} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
