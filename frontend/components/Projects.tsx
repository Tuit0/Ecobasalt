"use client";
import useSWR from "swr";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowUpRight, Maximize2, Sparkles } from "lucide-react";
import { fetcher, pickLang } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { projectImage } from "@/lib/sample-images";

type Project = {
  id: number;
  slug?: string;
  title_uz: string; title_ru: string; title_en: string;
  desc_uz?: string; desc_ru?: string; desc_en?: string;
  description_uz?: string; description_ru?: string; description_en?: string;
  location?: string;
  year?: number;
  cover_image?: string;
  area_m2?: number;
};

export default function Projects() {
  const { lang } = useLang();
  const { data: projects = [], isLoading } = useSWR<Project[]>("/api/content/projects", fetcher);

  return (
    <section id="projects" className="py-16 sm:py-20 lg:py-28 bg-onyx-950 relative overflow-hidden">
      <div className="orb orb-red w-[500px] h-[500px] top-1/4 -right-40 opacity-30" />
      <div className="orb orb-warm w-[400px] h-[400px] bottom-1/4 -left-40 opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mb-10 sm:mb-14"
        >
          <span className="badge-pill mb-5">{t(lang, "projects.eyebrow")}</span>
          <h1 className="h-display text-pearl-100 text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-balance leading-tight">
            {(() => {
              const words = t(lang, "projects.title").split(" ");
              const mid = Math.ceil(words.length / 2);
              return words.map((w, i) => (
                <span key={i} className={`${i >= mid ? "text-gradient-red" : ""}`}>{w}{i < words.length - 1 ? " " : ""}</span>
              ));
            })()}
          </h1>
          <p className="text-pearl-200 text-base sm:text-lg leading-relaxed">{t(lang, "projects.subtitle")}</p>
        </motion.div>

        {/* Loading state */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton aspect-[4/5] rounded-3xl" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 text-pearl-300">
            {lang === "uz" ? "Loyihalar yo'q" : lang === "ru" ? "Проектов нет" : "No projects yet"}
          </div>
        ) : (
          <>
            {/* Featured project (first) - large hero card */}
            {projects[0] && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mb-4 sm:mb-5"
              >
                <ProjectCard project={projects[0]} index={0} lang={lang} variant="hero" />
              </motion.div>
            )}

            {/* Modern grid — 3 col desktop, 2 col tablet, 1 col mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {projects.slice(1).map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: (i % 3) * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProjectCard project={p} index={i + 1} lang={lang} variant="default" />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ProjectCard({
  project: p,
  index: i,
  lang,
  variant,
}: {
  project: Project;
  index: number;
  lang: "uz" | "ru" | "en";
  variant: "hero" | "default";
}) {
  const title = pickLang(p, lang, "title");
  // Backend hozir description_* qaytaradi, lekin frontend ko'p joyda desc_* ishlatadi
  const desc = pickLang(p, lang, "description") || pickLang(p as any, lang, "desc");
  const href = p.slug ? `/projects/${p.slug}` : "/projects";

  if (variant === "hero") {
    return (
      <Link
        href={href}
        className="group relative block overflow-hidden rounded-3xl bg-onyx-800/40 border border-pearl-100/8 hover:border-gold-400/40 transition-all duration-500 backdrop-blur-sm"
      >
        <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden bg-onyx-700">
          <motion.img
            src={projectImage(p.slug, p.cover_image)}
            alt={title}
            className="w-full h-full object-cover"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-onyx-950 via-onyx-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-onyx-950/60 via-transparent to-transparent" />

          {/* Top badges */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex flex-wrap gap-2">
            <div className="badge-pill bg-gold-400/20 backdrop-blur-xl border-gold-400/40 text-gold-400">
              <Sparkles className="w-3 h-3" strokeWidth={2.5} />
              <span>Featured</span>
            </div>
          </div>

          {/* Hover arrow */}
          <motion.div
            className="absolute top-4 sm:top-6 right-4 sm:right-6 w-11 sm:w-12 h-11 sm:h-12 rounded-full bg-gold-400 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-500"
          >
            <ArrowUpRight className="w-5 h-5 text-pearl-100" strokeWidth={2.5} />
          </motion.div>

          {/* Content */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
              {p.year && (
                <div className="badge-pill bg-onyx-950/70 backdrop-blur border-pearl-100/15 text-pearl-100">
                  <Calendar className="w-3 h-3" strokeWidth={2.5} />
                  <span>{p.year}</span>
                </div>
              )}
              {p.location && (
                <div className="badge-pill bg-onyx-950/70 backdrop-blur border-pearl-100/15 text-pearl-100">
                  <MapPin className="w-3 h-3" strokeWidth={2.5} />
                  <span>{p.location}</span>
                </div>
              )}
              {p.area_m2 && (
                <div className="badge-pill bg-onyx-950/70 backdrop-blur border-pearl-100/15 text-pearl-100">
                  <Maximize2 className="w-3 h-3" strokeWidth={2.5} />
                  <span className="tabular">{p.area_m2.toLocaleString("en-US")} m²</span>
                </div>
              )}
            </div>

            <h2 className="h-display text-pearl-100 text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3 leading-tight text-balance max-w-3xl">
              {title}
            </h2>
            {desc && (
              <p className="text-pearl-200 text-sm sm:text-base max-w-2xl line-clamp-2 hidden sm:block">
                {desc}
              </p>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link
      href={href}
      className="group relative block h-full overflow-hidden rounded-3xl bg-onyx-800/40 border border-pearl-100/8 hover:border-gold-400/40 transition-all duration-500 backdrop-blur-sm hover:-translate-y-1.5"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-onyx-700">
        <motion.img
          src={projectImage(p.slug, p.cover_image)}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-onyx-950 via-onyx-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Number badge */}
        <div className="absolute top-4 left-4">
          <div className="badge-pill bg-onyx-950/70 backdrop-blur border-pearl-100/15 text-pearl-100">
            <span className="text-[10px] font-bold tabular">№ {String(i + 1).padStart(2, "0")}</span>
          </div>
        </div>

        {/* Area badge top-right */}
        {p.area_m2 && (
          <div className="absolute top-4 right-4 badge-pill bg-gold-400/20 backdrop-blur border-gold-400/40 text-gold-400 text-[10px] font-bold">
            <Maximize2 className="w-3 h-3" strokeWidth={2.5} />
            <span className="tabular">{p.area_m2.toLocaleString("en-US")} m²</span>
          </div>
        )}

        {/* Hover arrow */}
        <motion.div
          className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-gold-400 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500"
        >
          <ArrowUpRight className="w-4 h-4 text-pearl-100" strokeWidth={2.5} />
        </motion.div>

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2 sm:mb-3 text-xs text-pearl-200 font-medium">
            {p.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3" strokeWidth={2} />
                {p.location}
              </span>
            )}
            {p.year && (
              <>
                <span className="text-pearl-200/40">·</span>
                <span className="tabular">{p.year}</span>
              </>
            )}
          </div>
          <h3 className="h-display text-pearl-100 text-lg sm:text-xl md:text-2xl leading-tight text-balance line-clamp-2 group-hover:text-gradient-red transition-all">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
