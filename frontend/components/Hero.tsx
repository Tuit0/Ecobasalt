"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
      className="relative hero-fullscreen min-h-[600px] flex items-end overflow-hidden bg-onyx-900"
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

        {/* Cinematic overlay — MINIMAL: rasm dominant qoladi */}
        {/* Faqat pastki 60% da yumshoq gradient — kontent joyi */}
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-b from-transparent via-onyx-950/50 to-onyx-950/95" />
        {/* Nozik tepa darken — faqat navbar joyi */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-onyx-950/40 to-transparent" />
      </div>

      {/* Subtle accent orbs */}
      <div className="orb orb-warm w-[700px] h-[700px] top-1/3 -left-60 opacity-60" />
      <div className="orb orb-red w-[500px] h-[500px] bottom-1/4 -right-40 opacity-40" />

      {/* Cursor-follow gradient (desktop only) */}
      <CursorGradient size={700} color="rgba(169, 29, 42, 0.2)" />

      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="max-w-7xl w-full mx-auto px-5 sm:px-8 lg:px-12 xl:px-16 relative z-10 pt-28 pb-14 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24"
      >
        <div className="max-w-3xl">
          {/* Eyebrow — kichkina qizil label, luxury feel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="mb-5 sm:mb-6"
          >
            <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-gold-400">
              <span className="w-8 h-px bg-gold-400" />
              ECO BASALT
            </span>
          </motion.div>

          {/* Title — clean, elegant, no gradient boxes */}
          <h1 className="h-display text-pearl-50 text-4xl xs:text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-[76px] mb-5 sm:mb-6 lg:mb-7 text-balance whitespace-pre-line leading-[1.02] tracking-tight"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.6), 0 4px 40px rgba(0,0,0,0.4)" }}>
            {title.split("\n").map((line, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                {line}
              </motion.span>
            ))}
          </h1>

          {/* Subtitle — clean text, no box, subtle shadow */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-pearl-100 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl mb-8 sm:mb-10 lg:mb-12 font-normal"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.9), 0 2px 24px rgba(0,0,0,0.6)" }}
          >
            {subtitle}
          </motion.p>

          {/* Single primary CTA — Tesla/Apple stili */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <MagneticButton strength={0.2}>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 px-7 sm:px-8 py-4 sm:py-4 rounded-full bg-pearl-50 hover:bg-pearl-100 text-onyx-900 font-semibold text-sm sm:text-base transition-all duration-300 shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-black/60 whitespace-nowrap"
              >
                {t(lang, "hero.cta_secondary")}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform" strokeWidth={2.5} />
              </Link>
            </MagneticButton>
            <MagneticButton strength={0.2}>
              <button
                onClick={() => showModal()}
                className="group inline-flex items-center gap-2 px-7 sm:px-8 py-4 sm:py-4 rounded-full bg-transparent hover:bg-pearl-100/10 text-pearl-50 font-semibold text-sm sm:text-base border border-pearl-100/40 hover:border-pearl-100/70 transition-all duration-300 backdrop-blur-sm whitespace-nowrap"
              >
                {t(lang, "hero.cta_primary")}
              </button>
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

      {/* Scroll indicator olib tashlandi — content 3 CTA karta bilan allaqachon jonli, indicator ortiqcha */}
    </section>
  );
}
