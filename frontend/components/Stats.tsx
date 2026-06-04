"use client";
import useSWR from "swr";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { fetcher, blocksToMap, pickLang } from "@/lib/api";
import { useLang } from "@/lib/lang-context";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString("en-US"));

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration: 2.2, ease: [0.16, 1, 0.3, 1] });
      return controls.stop;
    }
  }, [inView, to, count]);

  return (
    <span ref={ref} className="inline-flex items-baseline">
      <motion.span>{rounded}</motion.span>
      <span className="text-gold-400">{suffix}</span>
    </span>
  );
}

export default function Stats() {
  const { lang } = useLang();
  const { data } = useSWR("/api/content/blocks?section=stats", fetcher);
  const blocks = blocksToMap(data || []);

  const items = [
    { value: parseInt(pickLang(blocks["stats.years"], lang) || "15"), suffix: "+", label: pickLang(blocks["stats.years_label"], lang) || "yillik tajriba" },
    { value: parseInt(pickLang(blocks["stats.projects"], lang) || "2500"), suffix: "+", label: pickLang(blocks["stats.projects_label"], lang) || "tugatilgan loyihalar" },
    { value: parseInt(pickLang(blocks["stats.area"], lang) || "850000"), suffix: " m²", label: pickLang(blocks["stats.area_label"], lang) || "qoplangan maydon" },
    { value: parseInt(pickLang(blocks["stats.clients"], lang) || "320"), suffix: "+", label: pickLang(blocks["stats.clients_label"], lang) || "doimiy mijozlar" },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 relative bg-onyx-950 border-y border-onyx-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-onyx-700">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="bg-onyx-900 py-8 sm:py-12 px-4 sm:px-6 group hover:bg-onyx-800 transition-colors cursor-default"
            >
              <div className="text-[10px] font-mono text-gold-400 mb-2 sm:mb-3 tracking-[0.2em]">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="h-display text-pearl-100 text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3 group-hover:text-gold-400 transition-colors">
                <Counter to={it.value} suffix={it.suffix} />
              </div>
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.1em] text-pearl-300 font-semibold line-clamp-2">
                {it.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
