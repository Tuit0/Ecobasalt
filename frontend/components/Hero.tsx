"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { ArrowRight, Factory, Sprout, Layers3 } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { fetcher, blocksToMap, pickLang } from "@/lib/api";
import { t } from "@/lib/i18n";
import { useApplicationModal } from "@/lib/application-modal";
import CursorGradient from "./CursorGradient";
import MagneticButton from "./MagneticButton";

type HeroSlide = {
  id: number;
  image: string;
  title_uz?: string; title_ru?: string; title_en?: string;
  subtitle_uz?: string; subtitle_ru?: string; subtitle_en?: string;
};

export default function Hero() {
  const { lang } = useLang();
  const { show: showModal } = useApplicationModal();
  const { data } = useSWR("/api/content/blocks?section=hero", fetcher);
  const blocks = blocksToMap(data || []);

  const title = pickLang(blocks["hero.title"], lang) || t(lang, "hero.title");
  const subtitle = pickLang(blocks["hero.subtitle"], lang) || t(lang, "hero.subtitle");
  const eyebrow = pickLang(blocks["hero.eyebrow"], lang) || t(lang, "hero.eyebrow");

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 100]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.4]);

  // Hero slides — DB'dan
  const { data: slidesData, isLoading } = useSWR<HeroSlide[]>("/api/content/hero-slides", fetcher, {
    revalidateOnFocus: false,
  });
  const slides = useMemo(
    () => (slidesData && slidesData.length > 0 ? slidesData.map((s) => s.image) : []),
    [slidesData]
  );

  // Preload — barcha rasmlarni browser cache'ga yuklash
  const [loadedSet, setLoadedSet] = useState<Set<string>>(new Set());
  useEffect(() => {
    slides.forEach((src) => {
      if (loadedSet.has(src)) return;
      const img = new window.Image();
      const finish = () => setLoadedSet((s) => new Set(s).add(src));
      img.onload = finish;
      img.onerror = finish;
      img.src = src;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides]);

  // Background slide auto-rotation — faqat keyingi rasm preload bo'lganda o'tadi
  const [bgIdx, setBgIdx] = useState(0);
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setBgIdx((current) => {
        const next = (current + 1) % slides.length;
        return loadedSet.has(slides[next]) ? next : current;
      });
    }, 6000);
    return () => clearInterval(timer);
  }, [slides, loadedSet]);

  const ready = slides.length > 0 && loadedSet.has(slides[0]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative hero-fullscreen min-h-[560px] flex items-end lg:items-center overflow-hidden bg-onyx-900"
    >
      {/* Background image carousel — cross-fade + slow zoom-in (no reverse) */}
      <div className="absolute inset-0">
        {ready ? (
          <AnimatePresence>
            <motion.img
              key={bgIdx}
              src={slides[bgIdx]}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1.1 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 2.4, ease: "easeInOut" },
                scale: { duration: 9, ease: "easeOut" },
              }}
              style={{ willChange: "opacity, transform" }}
            />
          </AnimatePresence>
        ) : (
          // Loading state — markazda katta logo
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-onyx-950"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src="/logo.png?v=4"
                alt="ECO BASALT"
                width={240}
                height={240}
                style={{ objectFit: "contain", filter: "drop-shadow(0 0 60px rgba(169, 29, 42, 0.4))" }}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Cinematic overlay — content ostiga qora scrim, tepada navbar uchun subtle darken */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 lg:h-1/3 bg-gradient-to-b from-transparent via-onyx-950/70 to-onyx-950" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-onyx-950/50 to-transparent" />
      </div>

      {/* Subtle accent orbs */}
      <div className="orb orb-warm w-[700px] h-[700px] top-1/3 -left-60 opacity-60" />
      <div className="orb orb-red w-[500px] h-[500px] bottom-1/4 -right-40 opacity-40" />

      {/* Cursor-follow gradient (desktop only) */}
      <CursorGradient size={700} color="rgba(169, 29, 42, 0.2)" />

      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 pb-10 sm:pt-28 sm:pb-14 lg:pt-32 lg:pb-20 w-full"
      >
        <div className="max-w-4xl">
          {/* Title — 2 lines, solid white with backing gradient for readability */}
          <h1 className="h-display text-pearl-100 text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-6 sm:mb-8 lg:mb-10 text-balance text-shadow whitespace-pre-line leading-[1.05]">
            {title.split("\n").map((line, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                {line}
              </motion.span>
            ))}
          </h1>

          {/* Subtitle — semi-transparent dark backing pill for readability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 sm:mb-12 lg:mb-14 max-w-2xl"
          >
            <p className="inline-block text-pearl-50 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-medium bg-gradient-to-b from-onyx-400/45 via-onyx-500/50 to-onyx-500/45 rounded-2xl px-4 sm:px-6 lg:px-7 py-3 sm:py-4 lg:py-5 text-shadow">
              {subtitle}
            </p>
          </motion.div>

          {/* Three product CTAs — oq shaffof stil, bir xil ko'rinish */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-5xl"
          >
            {[
              { href: "/products?cat=thermal",     Icon: Factory, title: t(lang, "hero.cta_thermal"),     desc: t(lang, "hero.cta_thermal_desc") },
              { href: "/products?cat=hydroponics", Icon: Sprout,  title: t(lang, "hero.cta_hydroponics"), desc: t(lang, "hero.cta_hydroponics_desc") },
              { href: "/products?cat=panels",      Icon: Layers3, title: t(lang, "hero.cta_panels"),      desc: t(lang, "hero.cta_panels_desc") },
            ].map((c, i) => {
              const Icon = c.Icon;
              return (
                <MagneticButton key={i} strength={0.1}>
                  <Link
                    href={c.href}
                    className="group block px-5 sm:px-6 py-5 sm:py-6 rounded-3xl bg-pearl-100/8 hover:bg-pearl-100/14 border border-pearl-100/18 hover:border-pearl-100/35 transition-all duration-300 w-full text-left h-full"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-pearl-100/12 border border-pearl-100/20 flex items-center justify-center group-hover:bg-pearl-100/20 group-hover:scale-105 transition-all">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-pearl-50" strokeWidth={1.8} />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="text-pearl-50 font-bold text-base sm:text-lg leading-tight">
                          {c.title}
                        </div>
                      </div>
                    </div>
                    <p className="text-pearl-200 text-xs sm:text-sm leading-snug mb-4 min-h-[2.5rem]">
                      {c.desc}
                    </p>
                    <div className="text-pearl-100 font-semibold text-xs sm:text-sm flex items-center gap-1.5 group-hover:gap-3 transition-all">
                      {t(lang, "hero.cta_view_catalog")}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                    </div>
                  </Link>
                </MagneticButton>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* Slide indicator — bottom right (hidden on small) */}
      <div className="absolute bottom-8 right-6 sm:right-8 hidden sm:flex flex-col items-end gap-2 z-10">
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setBgIdx(i)}
              className={`h-px transition-all ${
                i === bgIdx ? "w-12 bg-gold-400" : "w-6 bg-pearl-100/40 hover:bg-pearl-100/70"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <div className="text-[10px] font-mono text-pearl-100 tracking-[0.2em] font-semibold">
          {String(bgIdx + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </div>
      </div>

      {/* Scroll indicator — faqat lg+ da (mobile'da content bilan overlap qilmasin) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-pearl-300 z-10"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">{t(lang, "hero.scroll")}</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gold-400"
        />
      </motion.div>
    </section>
  );
}
