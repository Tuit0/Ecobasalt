"use client";
import useSWR from "swr";
import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import { fetcher, blocksToMap, pickLang } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { useSectionVisible } from "@/lib/section-visibility";

export default function About() {
  const { lang } = useLang();
  const visible = useSectionVisible("about");
  const { data } = useSWR("/api/content/blocks?section=about", fetcher);
  if (!visible) return null;
  const blocks = blocksToMap(data || []);

  const title = pickLang(blocks["about.title"], lang) || t(lang, "about.title");
  const body1 = pickLang(blocks["about.body1"], lang) || t(lang, "about.body1");
  const body2 = pickLang(blocks["about.body2"], lang) || t(lang, "about.body2");
  const factoryImage = pickLang(blocks["about.image"], lang) || "";

  return (
    <section id="about" className="py-14 sm:py-20 lg:py-28 xl:py-32 bg-onyx-900 relative overflow-hidden">
      <div className="orb orb-warm w-[500px] h-[500px] top-1/4 -left-40 opacity-40" />
      <div className="orb orb-red w-[400px] h-[400px] bottom-1/4 -right-40 opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16 items-center">
          {/* Left — Factory photo placeholder (admin CMS orqali `about.image` bloki bilan almashadi) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/3] sm:aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-onyx-800 to-onyx-950 border border-pearl-100/10 shadow-2xl shadow-black/40 max-w-md mx-auto lg:max-w-none">
              {factoryImage ? (
                <img
                  src={factoryImage}
                  alt="ECO BASALT"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-pearl-300/40 gap-3">
                  <ImageIcon className="w-16 h-16" strokeWidth={1.2} />
                  <span className="text-xs uppercase tracking-widest font-mono">
                    {lang === "uz" ? "korxona rasmi" : lang === "ru" ? "фото предприятия" : "factory photo"}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right — Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="lg:col-span-7"
          >
            <span className="badge-pill mb-4">{t(lang, "about.eyebrow")}</span>

            <h2 className="h-display text-pearl-100 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 sm:mb-6 text-balance leading-tight">
              {title}
            </h2>

            <p className="text-pearl-200 text-sm sm:text-base lg:text-lg leading-relaxed mb-4 sm:mb-5 max-w-2xl">
              {body1}
            </p>

            <p className="text-pearl-200 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
              {body2}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
