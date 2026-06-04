"use client";
import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowUpRight, Calendar } from "lucide-react";
import { fetcher, pickLang } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { blogImage } from "@/lib/sample-images";

type BlogPost = {
  id: number;
  slug: string;
  category: "tech" | "industry" | "project" | "eco";
  cover_image?: string;
  title_uz: string; title_ru: string; title_en: string;
  excerpt_uz: string; excerpt_ru: string; excerpt_en: string;
  min_read: number;
  published_at?: string;
};

export default function Blog() {
  const { lang } = useLang();
  const [filter, setFilter] = useState<"all" | BlogPost["category"]>("all");
  const { data: posts = [], isLoading } = useSWR<BlogPost[]>("/api/blog", fetcher);

  const cats: { id: "all" | BlogPost["category"]; label: string }[] = [
    { id: "all", label: t(lang, "blog.all") },
    { id: "tech", label: t(lang, "blog.cat_tech") },
    { id: "industry", label: t(lang, "blog.cat_industry") },
    { id: "project", label: t(lang, "blog.cat_project") },
    { id: "eco", label: t(lang, "blog.cat_eco") },
  ];

  const filtered = filter === "all" ? posts : posts.filter((p) => p.category === filter);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-onyx-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mb-12"
        >
          <div className="ornament mb-6">
            <span className="text-[11px] tracking-[0.2em] uppercase font-semibold">{t(lang, "blog.eyebrow")}</span>
          </div>
          <h1 className="h-display text-pearl-100 text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-balance">
            {t(lang, "blog.title")}
          </h1>
          <p className="text-pearl-200 text-base sm:text-lg leading-relaxed">{t(lang, "blog.subtitle")}</p>
        </motion.div>

        <div className="flex flex-wrap gap-1 sm:gap-2 mb-8 sm:mb-10 border-b border-onyx-700 overflow-x-auto">
          {cats.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`px-3 sm:px-5 py-2.5 sm:py-3 text-[11px] sm:text-xs uppercase tracking-[0.1em] font-semibold transition-colors relative whitespace-nowrap ${
                filter === c.id ? "text-gold-400" : "text-pearl-300 hover:text-pearl-100"
              }`}
            >
              {c.label}
              {filter === c.id && (
                <motion.span layoutId="blog-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-400" />
              )}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-onyx-800 border border-onyx-700 animate-pulse">
                <div className="aspect-[5/3] bg-onyx-700" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-onyx-700 w-1/3" />
                  <div className="h-6 bg-onyx-700 w-3/4" />
                  <div className="h-4 bg-onyx-700 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.06, duration: 0.6 }}
                  whileHover={{ y: -4 }}
                >
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group cursor-pointer bg-onyx-800 border border-onyx-700 hover:border-gold-400 transition-all duration-300 block h-full"
                  >
                    <div className="aspect-[5/3] overflow-hidden bg-onyx-700 relative">
                      <img
                        src={p.cover_image || blogImage(p.slug)}
                        alt={pickLang(p, lang, "title")}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-onyx-950/60 to-transparent" />
                      <div className="absolute top-4 left-4 text-[10px] font-mono text-gold-400 tracking-[0.15em] bg-onyx-900/90 backdrop-blur px-2.5 py-1 font-semibold">
                        {t(lang, `blog.cat_${p.category}`)}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-4 text-[10px] text-pearl-300 mb-3 uppercase tracking-wider font-semibold">
                        {p.published_at && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" strokeWidth={2} />
                            {new Date(p.published_at).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", { year: "numeric", month: "short", day: "numeric" })}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" strokeWidth={2} />
                          {p.min_read} {t(lang, "blog.min_read")}
                        </span>
                      </div>
                      <h3 className="h-display text-pearl-100 text-xl mb-3 group-hover:text-gold-400 transition-colors line-clamp-2 leading-tight">
                        {pickLang(p, lang, "title")}
                      </h3>
                      <p className="text-pearl-200 text-sm leading-relaxed line-clamp-3 mb-5">
                        {pickLang(p, lang, "excerpt")}
                      </p>
                      <div className="flex items-center gap-2 text-gold-400 text-xs uppercase tracking-[0.1em] font-semibold group-hover:gap-3 transition-all">
                        {t(lang, "blog.read")}
                        <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
