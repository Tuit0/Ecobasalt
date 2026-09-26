"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { fetcher, blocksToMap, pickLang } from "@/lib/api";
import { t } from "@/lib/i18n";
import CursorGradient from "./CursorGradient";
import { ThermalIcon, HydroponicsIcon, PanelsIcon } from "./BrandIcons";

type HeroSlide = {
  id: number;
  image: string;
  title_uz?: string; title_ru?: string; title_en?: string;
  subtitle_uz?: string; subtitle_ru?: string; subtitle_en?: string;
};

export default function Hero() {
  const { lang } = useLang();
  const { data } = useSWR("/api/content/blocks?section=hero", fetcher);
  const blocks = blocksToMap(data || []);

  const title = pickLang(blocks["hero.title"], lang) || t(lang, "hero.title");
  const subtitle = pickLang(blocks["hero.subtitle"], lang) || t(lang, "hero.subtitle");

  const directions = [
    { href: "/products?cat=thermal", Icon: ThermalIcon, title: t(lang, "hero.cta_thermal"), desc: t(lang, "hero.cta_thermal_desc") },
    { href: "/products?cat=hydroponics", Icon: HydroponicsIcon, title: t(lang, "hero.cta_hydroponics"), desc: t(lang, "hero.cta_hydroponics_desc") },
    { href: "/products?cat=panels", Icon: PanelsIcon, title: t(lang, "hero.cta_panels"), desc: t(lang, "hero.cta_panels_desc") },
  ];

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
      className="relative min-h-svh flex items-end overflow-hidden bg-onyx-900"
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
        className="max-w-[1500px] w-full mx-auto px-5 sm:px-8 lg:px-12 relative z-10 pt-28 pb-10 sm:pt-32 sm:pb-12 lg:pt-36 lg:pb-14"
      >
        {/* Slogan + qisqa matn — kulrang shaffof plashka ichida */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8 }}
          className="w-fit max-w-full rounded-3xl border border-pearl-100/15 bg-gradient-to-b from-onyx-400/40 via-onyx-500/45 to-onyx-500/40 backdrop-blur-sm px-5 py-5 sm:px-8 sm:py-7 lg:px-10 lg:py-8 shadow-2xl shadow-black/30 mb-6 sm:mb-8"
        >
          <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-gold-300 mb-4">
            <span className="w-8 h-px bg-gold-300" />
            ECO BASALT
          </span>

          <h1 className="h-display text-pearl-50 text-[34px] xs:text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] mb-4 sm:mb-5 leading-[1.05] tracking-tight"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.45)" }}>
            {title.split("\n").map((line, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="block md:whitespace-nowrap"
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-pearl-50 text-base sm:text-lg lg:text-xl xl:text-[clamp(17px,1.38vw,22px)] leading-snug font-medium xl:whitespace-nowrap"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* 3 yo'nalish kartochkasi — shior ostida */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {directions.map((c, i) => {
            const Icon = c.Icon;
            return (
              <motion.div
                key={c.href}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95 + i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={c.href}
                  className="group flex md:flex-col gap-4 md:gap-5 h-full p-4 sm:p-5 lg:p-6 rounded-3xl bg-onyx-950/55 hover:bg-onyx-950/75 border border-pearl-100/15 hover:border-gold-400/50 backdrop-blur-md transition-all duration-500"
                >
                  <div className="relative shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-gold-400/25 via-onyx-800/80 to-onyx-900 border border-gold-400/30 flex items-center justify-center shadow-lg shadow-gold-900/40 group-hover:scale-105 transition-transform duration-500">
                    <Icon className="w-10 h-10 lg:w-12 lg:h-12 text-pearl-50" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <h3 className="h-display text-pearl-50 text-lg lg:text-xl leading-tight mb-1.5">{c.title}</h3>
                    <p className="text-pearl-200 text-sm leading-snug mb-3 line-clamp-2">{c.desc}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 text-pearl-100 group-hover:text-gold-300 font-semibold text-sm transition-colors">
                      {t(lang, "hero.cta_view_catalog")}
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2.5} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Slide indicator — bottom right (hidden on small) */}
      <div className="absolute top-28 lg:top-32 right-6 sm:right-8 hidden sm:flex flex-col items-end gap-2 z-10">
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

    </section>
  );
}
