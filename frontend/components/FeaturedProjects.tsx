"use client";
import useSWR from "swr";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Calendar } from "lucide-react";
import { fetcher, pickLang } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { projectImage } from "@/lib/sample-images";
import { useSectionVisible } from "@/lib/section-visibility";

type Project = {
  id: number;
  slug?: string;
  title_uz: string; title_ru: string; title_en: string;
  location?: string;
  year?: number;
  area_m2?: number;
  cover_image?: string;
};

export default function FeaturedProjects() {
  const { lang } = useLang();
  const visible = useSectionVisible("projects");
  const { data: all = [] } = useSWR<Project[]>("/api/content/projects?featured=true", fetcher);
  const projects = all.slice(0, 3);

  if (!visible) return null;
  if (projects.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 lg:py-28 xl:py-32 bg-onyx-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span className="badge-pill mb-5">
              {lang === "uz" ? "PORTFOLIO" : lang === "ru" ? "ПОРТФОЛИО" : "PORTFOLIO"}
            </span>
            <h2 className="h-display text-pearl-100 text-4xl sm:text-5xl md:text-6xl text-balance leading-tight">
              {lang === "uz" ? (
                <>Bizning <span className="text-gradient-red">loyihalarimiz</span></>
              ) : lang === "ru" ? (
                <>Наши <span className="text-gradient-red">проекты</span></>
              ) : (
                <>Featured <span className="text-gradient-red">projects</span></>
              )}
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <Link href="/projects" className="link-modern text-gold-400 text-sm font-semibold uppercase tracking-wider">
              {lang === "uz" ? "Hammasi" : lang === "ru" ? "Все проекты" : "All projects"}
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
          </motion.div>
        </div>

        {/* Bento layout: 1 big + 2 small */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className={i === 0 ? "lg:col-span-7 lg:row-span-2" : "lg:col-span-5"}
            >
              <Link
                href={p.slug ? `/projects/${p.slug}` : "/projects"}
                className="block relative overflow-hidden rounded-3xl group h-full"
              >
                <div className={`relative ${i === 0 ? "aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[600px]" : "aspect-[16/10] lg:aspect-[2/1.1]"} overflow-hidden bg-onyx-800`}>
                  <img
                    src={projectImage(p.slug, p.cover_image)}
                    alt={pickLang(p, lang, "title")}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-onyx-950 via-onyx-950/30 to-transparent" />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-400/0 to-gold-400/0 group-hover:from-gold-400/10 transition-colors duration-700" />

                  {/* Badge top-left */}
                  <div className="absolute top-5 left-5">
                    <div className="badge-pill bg-onyx-950/70 backdrop-blur border-pearl-100/10 text-pearl-100">
                      <span className="text-[10px] font-bold tracking-wider">№ {String(i + 1).padStart(2, "0")}</span>
                    </div>
                  </div>

                  {/* Hover arrow */}
                  <motion.div
                    className="absolute top-5 right-5 w-11 h-11 rounded-full bg-gold-400 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-500"
                  >
                    <ArrowUpRight className="w-5 h-5 text-pearl-100" strokeWidth={2.5} />
                  </motion.div>

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                    <div className="flex items-center gap-3 text-xs text-pearl-200 mb-3 font-semibold">
                      {p.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3" strokeWidth={2} />
                          {p.location}
                        </span>
                      )}
                      {p.year && (
                        <>
                          <span className="text-pearl-200/40">·</span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" strokeWidth={2} />
                            {p.year}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className={`h-display text-pearl-100 ${i === 0 ? "text-2xl sm:text-3xl md:text-4xl" : "text-xl sm:text-2xl"} mb-3 leading-tight text-balance`}>
                      {pickLang(p, lang, "title")}
                    </h3>
                    {p.area_m2 && (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-gold-400 font-bold text-lg">{p.area_m2.toLocaleString("en-US")}</span>
                        <span className="text-pearl-200 text-sm">m²</span>
                      </div>
                    )}
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
