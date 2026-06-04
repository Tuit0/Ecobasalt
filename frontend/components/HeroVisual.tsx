"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight, Pause } from "lucide-react";

const SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1400&q=85&auto=format&fit=crop",
    label: { uz: "Sanoat majmualari", ru: "Промышленные комплексы", en: "Industrial complexes" },
    sub: { uz: "Aerial view · 12 000 m²", ru: "Аэросъёмка · 12 000 м²", en: "Aerial view · 12,000 m²" },
  },
  {
    img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1400&q=85&auto=format&fit=crop",
    label: { uz: "Sendvich panel binolari", ru: "Здания из сэндвич-панелей", en: "Sandwich panel buildings" },
    sub: { uz: "Modern facade · 8 500 m²", ru: "Современный фасад · 8 500 м²", en: "Modern facade · 8,500 m²" },
  },
  {
    img: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1400&q=85&auto=format&fit=crop",
    label: { uz: "Logistika omborlari", ru: "Логистические склады", en: "Logistics warehouses" },
    sub: { uz: "Interior · EI 240", ru: "Интерьер · EI 240", en: "Interior · EI 240" },
  },
  {
    img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1400&q=85&auto=format&fit=crop",
    label: { uz: "Soviqxonalar", ru: "Холодильные комплексы", en: "Cold storage facilities" },
    sub: { uz: "−25°C → +30°C", ru: "−25°C → +30°C", en: "−25°C → +30°C" },
  },
];

// YouTube video ID — foydalanuvchi keyin almashtiradi
const VIDEO_ID = "ScMzIvxBSi4"; // generic factory tour placeholder

type Lang = "uz" | "ru" | "en";

export default function HeroVisual({ lang }: { lang: Lang }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, [paused]);

  const next = () => setIdx((i) => (i + 1) % SLIDES.length);
  const prev = () => setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length);

  return (
    <>
      <div className="relative h-full w-full">
        {/* Image stack */}
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <img
                src={SLIDES[idx].img}
                alt={SLIDES[idx].label[lang]}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-onyx-950/70 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-onyx-950/40" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Play button — center */}
        <button
          onClick={() => setVideoOpen(true)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group"
          aria-label="Play video"
        >
          {/* Pulse ring */}
          <span className="absolute inset-0 -m-2 border border-pearl-100/40 rounded-full animate-ping" />
          <span className="absolute inset-0 -m-4 border border-pearl-100/20 rounded-full animate-ping" style={{ animationDelay: "0.5s" }} />
          {/* Main button */}
          <span className="relative w-20 h-20 rounded-full bg-gold-400 hover:bg-gold-600 flex items-center justify-center transition-colors shadow-2xl">
            <Play className="w-7 h-7 text-pearl-100 ml-1" strokeWidth={1.5} fill="currentColor" />
          </span>
        </button>

        {/* Top-left meta */}
        <div className="absolute top-6 left-6 right-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="bg-onyx-900/80 backdrop-blur-md px-4 py-3 border border-pearl-100/10 inline-block"
            >
              <div className="text-[10px] tracking-[0.25em] uppercase text-gold-400 font-semibold mb-1">
                {SLIDES[idx].sub[lang]}
              </div>
              <div className="text-pearl-100 text-sm font-medium">
                {SLIDES[idx].label[lang]}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pause / play autoplay */}
        <button
          onClick={() => setPaused(!paused)}
          className="absolute top-6 right-6 w-10 h-10 bg-onyx-900/80 backdrop-blur-md border border-pearl-100/10 flex items-center justify-center hover:bg-onyx-800 transition-colors"
          aria-label={paused ? "Resume" : "Pause"}
        >
          {paused ? (
            <Play className="w-3 h-3 text-pearl-100 ml-0.5" strokeWidth={2} fill="currentColor" />
          ) : (
            <Pause className="w-3 h-3 text-pearl-100" strokeWidth={2} fill="currentColor" />
          )}
        </button>

        {/* Bottom controls */}
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
          {/* Pagination dots */}
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-1 transition-all ${
                  i === idx ? "w-8 bg-gold-400" : "w-4 bg-pearl-100/40 hover:bg-pearl-100/70"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Counter + arrows */}
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-pearl-100 tracking-[0.2em] font-semibold">
              {String(idx + 1).padStart(2, "0")}/{String(SLIDES.length).padStart(2, "0")}
            </span>
            <div className="flex gap-1">
              <button
                onClick={prev}
                className="w-9 h-9 bg-onyx-900/80 backdrop-blur-md border border-pearl-100/10 flex items-center justify-center hover:bg-gold-400 hover:border-gold-400 transition-colors group"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4 text-pearl-100" strokeWidth={2} />
              </button>
              <button
                onClick={next}
                className="w-9 h-9 bg-onyx-900/80 backdrop-blur-md border border-pearl-100/10 flex items-center justify-center hover:bg-gold-400 hover:border-gold-400 transition-colors group"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4 text-pearl-100" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* Floating badges */}
        <div className="absolute -top-3 -left-3 hidden xl:block">
          <div className="bg-gold-400 text-pearl-100 px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-bold">
            EI 240
          </div>
        </div>
        <div className="absolute -bottom-3 -right-3 hidden xl:block">
          <div className="bg-onyx-900 border border-gold-400 text-gold-400 px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-bold">
            A1 CLASS
          </div>
        </div>
      </div>

      {/* Video modal */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-onyx-950/90 backdrop-blur-md"
            onClick={() => setVideoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl aspect-video bg-onyx-950 border border-gold-400/30"
            >
              <iframe
                src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
                title="Factory Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
              <button
                onClick={() => setVideoOpen(false)}
                className="absolute -top-12 right-0 text-pearl-100 hover:text-gold-400 transition-colors flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-semibold"
              >
                CLOSE
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
