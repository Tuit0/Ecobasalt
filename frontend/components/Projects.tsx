"use client";
import useSWR from "swr";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowUpRight } from "lucide-react";
import { fetcher, pickLang } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { projectImage } from "@/lib/sample-images";

type Project = {
  id: number;
  slug?: string;
  title_uz: string; title_ru: string; title_en: string;
  description_uz: string; description_ru: string; description_en: string;
  location?: string;
  year?: number;
  cover_image?: string;
  area_m2?: number;
};

export default function Projects() {
  const { lang } = useLang();
  const { data: projects = [] } = useSWR<Project[]>("/api/content/projects", fetcher);

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-16 sm:py-20 lg:py-24 bg-onyx-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mb-16"
        >
          <div className="ornament mb-6">
            <span className="text-[11px] tracking-[0.2em] uppercase font-semibold">{t(lang, "projects.eyebrow")}</span>
          </div>
          <h2 className="h-display text-pearl-100 text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-balance">
            {t(lang, "projects.title")}
          </h2>
          <p className="text-pearl-200 text-base sm:text-lg leading-relaxed">{t(lang, "projects.subtitle")}</p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className={`${i % 5 === 0 ? "lg:row-span-2 lg:col-span-2" : ""}`}
            >
            <Link
              href={p.slug ? `/projects/${p.slug}` : "/projects"}
              className="group cursor-pointer bg-onyx-800 border border-onyx-700 hover:border-gold-400 transition-all duration-300 block h-full"
            >
              <div className={`relative overflow-hidden bg-onyx-700 ${i % 5 === 0 ? "aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[460px]" : "aspect-[4/3]"}`}>
                <img
                  src={projectImage(p.slug, p.cover_image)}
                  alt={pickLang(p, lang, "title")}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-onyx-950 via-onyx-950/40 to-transparent" />

                {/* Top meta */}
                <div className="absolute top-4 left-4 flex items-center gap-3 text-[10px] font-mono text-gold-400 tracking-[0.15em] bg-onyx-900/70 backdrop-blur px-3 py-1.5">
                  №&nbsp;{String(i + 1).padStart(2, "0")}
                </div>

                {/* Bottom content */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="flex items-center gap-4 text-xs text-pearl-300 mb-3 uppercase tracking-[0.1em] font-semibold">
                    {p.year && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" strokeWidth={2} />
                        {p.year}
                      </span>
                    )}
                    {p.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" strokeWidth={2} />
                        {p.location}
                      </span>
                    )}
                  </div>
                  <h3 className="h-display text-pearl-100 text-2xl md:text-3xl mb-2 group-hover:text-gold-400 transition-colors text-balance">
                    {pickLang(p, lang, "title")}
                  </h3>
                  {p.area_m2 && (
                    <div className="flex items-baseline gap-2 text-gold-400 font-mono text-sm">
                      <span className="font-semibold">{p.area_m2.toLocaleString("en-US")}</span>
                      <span className="text-xs">m²</span>
                    </div>
                  )}
                </div>

                {/* Hover arrow */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-gold-400 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5 text-pearl-100" strokeWidth={2} />
                </div>
              </div>
            </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
