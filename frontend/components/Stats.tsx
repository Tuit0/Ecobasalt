"use client";
import useSWR from "swr";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { TrendingUp } from "lucide-react";
import { fetcher, blocksToMap, pickLang } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { useSectionVisible } from "@/lib/section-visibility";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString("en-US"));

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration: 2.4, ease: [0.16, 1, 0.3, 1] });
      return controls.stop;
    }
  }, [inView, to, count]);

  return (
    <span ref={ref} className="inline-flex items-baseline tabular">
      <motion.span>{rounded}</motion.span>
      <span className="text-gold-400">{suffix}</span>
    </span>
  );
}

export default function Stats() {
  const { lang } = useLang();
  const visible = useSectionVisible("stats");
  const { data } = useSWR("/api/content/blocks?section=stats", fetcher);
  if (!visible) return null;
  const blocks = blocksToMap(data || []);

  const items = [
    { value: parseInt(pickLang(blocks["stats.years"], lang) || "15"), suffix: "+", label: pickLang(blocks["stats.years_label"], lang) || "yillik tajriba" },
    { value: parseInt(pickLang(blocks["stats.projects"], lang) || "2500"), suffix: "+", label: pickLang(blocks["stats.projects_label"], lang) || "loyihalar" },
    { value: parseInt(pickLang(blocks["stats.area"], lang) || "850000"), suffix: " m²", label: pickLang(blocks["stats.area_label"], lang) || "qoplangan maydon" },
    { value: parseInt(pickLang(blocks["stats.clients"], lang) || "320"), suffix: "+", label: pickLang(blocks["stats.clients_label"], lang) || "doimiy mijozlar" },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 relative bg-onyx-950 overflow-hidden">
      <div className="orb orb-red w-[600px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="feature-card p-6 sm:p-8 group cursor-default"
            >
              <div className="flex items-center gap-2 mb-4 text-pearl-300 text-xs font-semibold">
                <TrendingUp className="w-3.5 h-3.5 text-gold-400" strokeWidth={2.5} />
                <span>{String(i + 1).padStart(2, "0")} / 04</span>
              </div>
              <div className="h-display text-pearl-100 text-3xl sm:text-4xl lg:text-5xl mb-3 group-hover:text-gradient-red transition-all">
                <Counter to={it.value} suffix={it.suffix} />
              </div>
              <div className="text-pearl-200 text-sm font-medium">
                {it.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
