"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { ArrowRight, Factory, Sprout } from "lucide-react";
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
      className="relative min-h-screen flex items-center overflow-hidden bg-onyx-900"
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

        {/* Minimal overlay — faqat pastki vignette (Navbar va keyingi bo'lim bilan smooth o'tish) */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-onyx-950" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-onyx-950/40 to-transparent" />
      </div>

      {/* Subtle accent orbs */}
      <div className="orb orb-warm w-[700px] h-[700px] top-1/3 -left-60 opacity-60" />
      <div className="orb orb-red w-[500px] h-[500px] bottom-1/4 -right-40 opacity-40" />

      {/* Cursor-follow gradient (desktop only) */}
      <CursorGradient size={700} color="rgba(169, 29, 42, 0.2)" />

      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-28 pb-16 sm:pt-36 sm:pb-24"
      >
        <div className="max-w-4xl">
          {/* Title — 2 lines, solid white with backing gradient for readability */}
          <h1 className="h-display text-pearl-100 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-8 sm:mb-10 text-balance text-shadow whitespace-pre-line leading-[1.05]">
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
            className="mb-10 sm:mb-14 max-w-2xl"
          >
            <p className="inline-block text-pearl-50 text-lg sm:text-xl md:text-2xl leading-relaxed font-medium bg-gradient-to-b from-onyx-400/45 via-onyx-500/50 to-onyx-500/45 rounded-2xl px-5 sm:px-7 py-4 sm:py-5 text-shadow">
              {subtitle}
            </p>
          </motion.div>

          {/* Two big product CTAs — with descriptions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-4xl"
          >
            <MagneticButton strength={0.12}>
              <Link
                href="/products?cat=thermal"
                className="group block px-6 sm:px-8 py-6 sm:py-7 rounded-3xl bg-gradient-to-br from-gold-500/95 to-gold-600 hover:from-gold-400 hover:to-gold-500 border border-gold-400/50 transition-all duration-300 shadow-xl shadow-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/45 w-full text-left"
              >
                <div className="flex items-start gap-3 sm:gap-4 mb-3">
                  <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-pearl-100/15 flex items-center justify-center">
                    <Factory className="w-6 h-6 sm:w-7 sm:h-7 text-pearl-100" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="text-pearl-100 font-bold text-lg sm:text-xl leading-tight">
                      {t(lang, "hero.cta_thermal")}
                    </div>
                  </div>
                </div>
                <p className="text-pearl-100/85 text-sm sm:text-[15px] leading-snug mb-4">
                  {t(lang, "hero.cta_thermal_desc")}
                </p>
                <div className="text-pearl-100 font-semibold text-sm sm:text-base flex items-center gap-1.5 group-hover:gap-3 transition-all">
                  {t(lang, "hero.cta_view_catalog")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                </div>
              </Link>
            </MagneticButton>
            <MagneticButton strength={0.12}>
              <Link
                href="/products?cat=hydroponics"
                className="group block px-6 sm:px-8 py-6 sm:py-7 rounded-3xl bg-onyx-950/70 backdrop-blur-xl border border-pearl-100/15 hover:border-forest-400/40 hover:bg-onyx-950/85 transition-all duration-300 w-full text-left"
              >
                <div className="flex items-start gap-3 sm:gap-4 mb-3">
                  <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-forest-500/20 border border-forest-400/30 flex items-center justify-center">
                    <Sprout className="w-6 h-6 sm:w-7 sm:h-7 text-forest-400" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="text-pearl-100 font-bold text-lg sm:text-xl leading-tight">
                      {t(lang, "hero.cta_hydroponics")}
                    </div>
                  </div>
                </div>
                <p className="text-pearl-200 text-sm sm:text-[15px] leading-snug mb-4">
                  {t(lang, "hero.cta_hydroponics_desc")}
                </p>
                <div className="text-pearl-100 font-semibold text-sm sm:text-base flex items-center gap-1.5 group-hover:gap-3 transition-all">
                  {t(lang, "hero.cta_view_catalog")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                </div>
              </Link>
            </MagneticButton>
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

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-pearl-300 z-10"
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
