"use client";
import useSWR from "swr";
import { motion } from "framer-motion";
import { Check, Award, Sparkles } from "lucide-react";
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
    <section id="about" className="py-20 sm:py-28 lg:py-32 bg-onyx-900 relative overflow-hidden">
      <div className="orb orb-warm w-[500px] h-[500px] top-1/4 -left-40 opacity-40" />
      <div className="orb orb-red w-[400px] h-[400px] bottom-1/4 -right-40 opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 items-center">
          {/* Left — Visual card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-onyx-800 to-onyx-950 border border-pearl-100/8 backdrop-blur-sm shadow-2xl shadow-black/40">
              {/* Sandwich panel SVG */}
              <svg viewBox="0 0 400 400" className="w-full h-full">
                <defs>
                  <pattern id="basalt-tex2" patternUnits="userSpaceOnUse" width="6" height="30" patternTransform="rotate(20)">
                    <line x1="3" y1="0" x2="3" y2="30" stroke="#22c55e" strokeWidth="0.6" opacity="0.5" />
                  </pattern>
                  <linearGradient id="steel2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#a8a29e" />
                    <stop offset="50%" stopColor="#d6d3d1" />
                    <stop offset="100%" stopColor="#78716c" />
                  </linearGradient>
                </defs>

                <g transform="translate(0, 80)">
                  <rect x="40" y="0" width="320" height="25" fill="url(#steel2)" rx="2" />
                  <rect x="40" y="25" width="320" height="180" fill="#44403c" />
                  <rect x="40" y="25" width="320" height="180" fill="url(#basalt-tex2)" />
                  <rect x="40" y="205" width="320" height="25" fill="url(#steel2)" rx="2" />

                  <g stroke="#dc2626" strokeWidth="0.8" fill="none" opacity="0.7">
                    <line x1="40" y1="-15" x2="360" y2="-15" />
                    <line x1="40" y1="-20" x2="40" y2="-10" />
                    <line x1="360" y1="-20" x2="360" y2="-10" />
                  </g>
                  <text x="200" y="-22" textAnchor="middle" fill="#dc2626" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="600">
                    1000mm
                  </text>

                  <g fill="#fafaf9" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="500">
                    <text x="370" y="14">STEEL · 0.5mm</text>
                    <text x="370" y="118">BASALT · 150mm</text>
                    <text x="370" y="222">STEEL · 0.5mm</text>
                  </g>
                </g>

                {/* Bottom fire rating */}
                <g transform="translate(40, 340)">
                  <text x="0" y="0" fill="#dc2626" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="700">FIRE RATING</text>
                  <text x="0" y="20" fill="#fafaf9" fontSize="24" fontFamily="Inter, sans-serif" fontWeight="800">EI 240</text>
                  <text x="120" y="20" fill="#a8a29e" fontSize="11" fontFamily="Inter, sans-serif">EN 13501-2</text>
                </g>
              </svg>

              {/* Floating years badge */}
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
                className="absolute bottom-6 right-6 lux-card p-5 backdrop-blur-xl"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-3.5 h-3.5 text-gold-400" strokeWidth={2.5} />
                  <span className="text-[10px] text-pearl-300 font-semibold">{t(lang, "about.years")}</span>
                </div>
                <div className="h-display text-gradient-red text-4xl">15+</div>
              </motion.div>
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
            <span className="badge-pill mb-5">{t(lang, "about.eyebrow")}</span>

            <h2 className="h-display text-pearl-100 text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 text-balance leading-tight">
              {title}
            </h2>

            <p className="text-pearl-200 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              {body}
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bullets.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex items-start gap-3 text-pearl-100 group cursor-default"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-500/10 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />
                  </div>
                  <span className="text-sm sm:text-base">{b}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
