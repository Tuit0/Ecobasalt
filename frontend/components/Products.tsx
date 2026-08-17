"use client";
import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Package, Sparkles } from "lucide-react";
import { fetcher, pickLang } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { productImage } from "@/lib/sample-images";
import { useSectionVisible } from "@/lib/section-visibility";

type Category = { id: number; slug: string; name_uz: string; name_ru: string; name_en: string };
type Product = {
  id: number;
  slug: string;
  category_id: number;
  name_uz: string; name_ru: string; name_en: string;
  short_uz: string; short_ru: string; short_en: string;
  cover_image?: string;
  specs?: Record<string, string>;
  is_featured?: boolean;
  price_from?: number;
  price_currency?: string;
};

export default function Products() {
  const { lang } = useLang();
  const visible = useSectionVisible("products");
  const { data: categories = [] } = useSWR<Category[]>("/api/products/categories", fetcher);
  const { data: products = [] } = useSWR<Product[]>("/api/products", fetcher);
  const [active, setActive] = useState<string>("all");

  const filtered = active === "all" ? products : products.filter((p) => {
    const cat = categories.find((c) => c.slug === active);
    return cat && p.category_id === cat.id;
  });

  if (!visible) return null;

  return (
    <section id="products" className="py-14 sm:py-20 lg:py-28 xl:py-32 bg-onyx-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span className="badge-pill mb-5">{t(lang, "products.eyebrow")}</span>
            <h2 className="h-display text-pearl-100 text-4xl sm:text-5xl md:text-6xl text-balance leading-tight">
              {t(lang, "products.title").split(" ")[0]}{" "}
              <span className="text-gradient-red">{t(lang, "products.title").split(" ").slice(1).join(" ")}</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-pearl-200 text-base max-w-md"
          >
            {t(lang, "products.subtitle")}
          </motion.p>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-10 sm:mb-12">
          <button
            onClick={() => setActive("all")}
            className={`px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
              active === "all"
                ? "bg-gold-400 text-pearl-100"
                : "bg-pearl-100/5 text-pearl-200 hover:bg-pearl-100/10"
            }`}
          >
            {t(lang, "products.all")}
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setActive(c.slug)}
              className={`px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                active === c.slug
                  ? "bg-gold-400 text-pearl-100"
                  : "bg-pearl-100/5 text-pearl-200 hover:bg-pearl-100/10"
              }`}
            >
              {pickLang(c, lang, "name")}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                whileHover={{ y: -6 }}
              >
                <Link
                  href={`/products/${p.slug}`}
                  className="group block overflow-hidden rounded-3xl bg-onyx-900/60 border border-pearl-100/5 hover:border-gold-400/40 transition-all duration-500 h-full backdrop-blur-sm"
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-onyx-800">
                    <img
                      src={productImage(p.slug, p.cover_image)}
                      alt={pickLang(p, lang, "name")}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-onyx-950/80 via-transparent to-transparent" />

                    {p.is_featured && (
                      <div className="absolute top-4 left-4 badge-pill bg-onyx-950/70 backdrop-blur border-gold-400/30 text-gold-400">
                        <Sparkles className="w-3 h-3" strokeWidth={2} />
                        <span className="text-[11px]">Featured</span>
                      </div>
                    )}

                    <motion.div className="absolute top-4 right-4 w-11 h-11 rounded-full bg-gold-400 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      <ArrowUpRight className="w-5 h-5 text-pearl-100" strokeWidth={2.5} />
                    </motion.div>
                  </div>

                  <div className="p-6">
                    <h3 className="h-display text-pearl-100 text-xl mb-2 group-hover:text-gradient-red transition-all line-clamp-1">
                      {pickLang(p, lang, "name")}
                    </h3>
                    <p className="text-pearl-200 text-sm leading-relaxed line-clamp-2 mb-4">
                      {pickLang(p, lang, "short")}
                    </p>

                    {p.specs && Object.keys(p.specs).length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {Object.entries(p.specs).slice(0, 3).map(([k, v]) => (
                          <span key={k} className="text-[11px] px-2.5 py-1 rounded-full bg-pearl-100/5 text-pearl-200 font-medium">
                            <span className="text-gold-400">{k}</span> · {v}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-pearl-100/5">
                      {p.price_from ? (
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs text-pearl-300">from</span>
                          <span className="h-display text-gradient-red text-lg">${p.price_from}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-pearl-300">{t(lang, "products.details") || "Details"}</span>
                      )}
                      <div className="text-gold-400 text-sm font-semibold">
                        {lang === "uz" ? "Batafsil" : lang === "ru" ? "Подробнее" : "View"} →
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-pearl-300/30 mx-auto mb-4" strokeWidth={1} />
            <p className="text-pearl-300">{t(lang, "products.empty")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
