"use client";
import useSWR from "swr";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { fetcher, blocksToMap, pickLang } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

export default function About() {
  const { lang } = useLang();
  const { data } = useSWR("/api/content/blocks?section=about", fetcher);
  const blocks = blocksToMap(data || []);

  const title = pickLang(blocks["about.title"], lang) || t(lang, "about.title");
  const body = pickLang(blocks["about.body"], lang) || t(lang, "about.body");

  const bullets = [
    t(lang, "about.b1"),
    t(lang, "about.b2"),
    t(lang, "about.b3"),
    t(lang, "about.b4"),
  ];

  return (
    <section id="about" className="py-16 sm:py-20 lg:py-24 bg-onyx-900 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 items-start">
          {/* Left — Sandwich panel cross-section diagram */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="aspect-square bg-onyx-800 border border-onyx-700 p-10 relative">
              {/* Cross-section illustration */}
              <svg viewBox="0 0 400 400" className="w-full h-full">
                <defs>
                  <pattern id="basalt-tex" patternUnits="userSpaceOnUse" width="6" height="30" patternTransform="rotate(20)">
                    <line x1="3" y1="0" x2="3" y2="30" stroke="#22c55e" strokeWidth="0.6" opacity="0.5" />
                  </pattern>
                  <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#a8a29e" />
                    <stop offset="50%" stopColor="#d6d3d1" />
                    <stop offset="100%" stopColor="#78716c" />
                  </linearGradient>
                </defs>

                {/* Sandwich panel cross-section */}
                <g transform="translate(0, 60)">
                  <rect x="40" y="0" width="320" height="25" fill="url(#steel)" />
                  <rect x="40" y="25" width="320" height="180" fill="#44403c" />
                  <rect x="40" y="25" width="320" height="180" fill="url(#basalt-tex)" />
                  <rect x="40" y="205" width="320" height="25" fill="url(#steel)" />

                  {/* Annotations */}
                  <g stroke="#dc2626" strokeWidth="0.8" fill="none">
                    <line x1="40" y1="-15" x2="360" y2="-15" />
                    <line x1="40" y1="-20" x2="40" y2="-10" />
                    <line x1="360" y1="-20" x2="360" y2="-10" />
                  </g>
                  <text x="200" y="-22" textAnchor="middle" fill="#dc2626" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="600">
                    1000mm
                  </text>

                  {/* Layer labels */}
                  <g fill="#fafaf9" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="500">
                    <text x="370" y="14" letterSpacing="1">STEEL · 0.5mm</text>
                    <text x="370" y="118" letterSpacing="1">BASALT CORE · 150mm</text>
                    <text x="370" y="222" letterSpacing="1">STEEL · 0.5mm</text>
                  </g>
                  <g stroke="#44403c" strokeWidth="0.5">
                    <line x1="360" y1="12" x2="368" y2="12" />
                    <line x1="360" y1="115" x2="368" y2="115" />
                    <line x1="360" y1="218" x2="368" y2="218" />
                  </g>
                </g>

                {/* Bottom — fire test */}
                <g transform="translate(40, 320)">
                  <text x="0" y="0" fill="#dc2626" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="700" letterSpacing="1">
                    FIRE RATING
                  </text>
                  <text x="0" y="20" fill="#fafaf9" fontSize="24" fontFamily="Inter, sans-serif" fontWeight="800">
                    EI 240
                  </text>
                  <text x="120" y="20" fill="#fafaf9" fontSize="11" fontFamily="Inter, sans-serif" opacity="0.7">
                    EN 13501-2
                  </text>
                </g>
              </svg>

              {/* Years badge */}
              <div className="absolute bottom-6 right-6 bg-gold-400 text-pearl-100 px-5 py-3 flex items-center gap-3">
                <span className="h-display text-3xl">15+</span>
                <span className="text-[10px] uppercase tracking-[0.1em] leading-tight font-semibold">
                  {t(lang, "about.years")}
                </span>
              </div>
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
            <div className="ornament mb-6">
              <span className="text-[11px] tracking-[0.2em] uppercase font-semibold">{t(lang, "about.eyebrow")}</span>
            </div>

            <h2 className="h-display text-pearl-100 text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 sm:mb-8 text-balance">
              {title}
            </h2>

            <p className="text-pearl-200 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 max-w-xl">
              {body}
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bullets.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  className="flex items-start gap-3 text-pearl-200"
                >
                  <Check className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                  <span className="text-base">{b}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
