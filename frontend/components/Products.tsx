"use client";
import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Package } from "lucide-react";
import { fetcher, pickLang } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { productImage } from "@/lib/sample-images";

type Category = { id: number; slug: string; name_uz: string; name_ru: string; name_en: string };
type Product = {
  id: number;
  slug: string;
  category_id: number;
  name_uz: string; name_ru: string; name_en: string;
  short_uz: string; short_ru: string; short_en: string;
  cover_image?: string;
  specs?: Record<string, string>;
};

export default function Products() {
  const { lang } = useLang();
  const { data: categories = [] } = useSWR<Category[]>("/api/products/categories", fetcher);
  const { data: products = [] } = useSWR<Product[]>("/api/products", fetcher);
  const [active, setActive] = useState<string>("all");

  const filtered = active === "all" ? products : products.filter((p) => {
    const cat = categories.find((c) => c.slug === active);
    return cat && p.category_id === cat.id;
  });

  return (
    <section id="products" className="py-16 sm:py-20 lg:py-24 bg-onyx-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <div className="ornament mb-5 sm:mb-6">
              <span className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-semibold">{t(lang, "products.eyebrow")}</span>
            </div>
            <h2 className="h-display text-pearl-100 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-balance">
              {t(lang, "products.title")}
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-pearl-200 text-sm sm:text-base max-w-md"
          >
            {t(lang, "products.subtitle")}
          </motion.p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-10 sm:mb-12 border-b border-onyx-700 overflow-x-auto">
          <button
            onClick={() => setActive("all")}
            className={`px-3 sm:px-5 py-2.5 sm:py-3 text-[11px] sm:text-xs uppercase tracking-[0.1em] font-semibold transition-colors relative whitespace-nowrap ${
              active === "all" ? "text-gold-400" : "text-pearl-300 hover:text-pearl-100"
            }`}
          >
            {t(lang, "products.all")}
            {active === "all" && (
              <motion.span layoutId="product-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-400" />
            )}
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setActive(c.slug)}
              className={`px-3 sm:px-5 py-2.5 sm:py-3 text-[11px] sm:text-xs uppercase tracking-[0.1em] font-semibold transition-colors relative whitespace-nowrap ${
                active === c.slug ? "text-gold-400" : "text-pearl-300 hover:text-pearl-100"
              }`}
            >
              {pickLang(c, lang, "name")}
              {active === c.slug && (
                <motion.span layoutId="product-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-400" />
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
              >
              <Link
                href={`/products/${p.slug}`}
                className="group cursor-pointer bg-onyx-800 border border-onyx-700 hover:border-gold-400 transition-all duration-300 block h-full"
              >
                {/* Image */}
                <div className="aspect-[4/3] relative overflow-hidden bg-onyx-700">
                  <img
                    src={productImage(p.slug, p.cover_image)}
                    alt={pickLang(p, lang, "name")}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-onyx-950/30 to-transparent" />
                  <div className="absolute top-4 left-4 text-[10px] font-mono text-gold-400 tracking-[0.15em] bg-onyx-900/80 px-2 py-1">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="h-display text-pearl-100 text-xl mb-2 group-hover:text-gold-400 transition-colors">
                    {pickLang(p, lang, "name")}
                  </h3>
                  <p className="text-pearl-300 text-sm leading-relaxed line-clamp-2 mb-4">
                    {pickLang(p, lang, "short")}
                  </p>

                  {p.specs && Object.keys(p.specs).length > 0 && (
                    <div className="border-t border-onyx-700 pt-4 mb-4 grid grid-cols-2 gap-2">
                      {Object.entries(p.specs).slice(0, 4).map(([k, v]) => (
                        <div key={k} className="text-[10px]">
                          <div className="text-pearl-300 uppercase tracking-wider mb-0.5 font-mono">{k}</div>
                          <div className="text-pearl-100 font-semibold">{v}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gold-400 text-xs uppercase tracking-[0.1em] font-semibold group-hover:gap-3 transition-all">
                    {t(lang, "products.details") || "Batafsil"}
                    <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
                  </div>
                </div>
              </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-pearl-300">{t(lang, "products.empty")}</div>
        )}
      </div>
    </section>
  );
}
