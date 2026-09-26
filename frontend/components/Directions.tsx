"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import useSWR from "swr";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { fetcher, pickLang } from "@/lib/api";
import { useSectionVisible } from "@/lib/section-visibility";
import { DIRECTION_ICONS, DirectionSlug } from "./BrandIcons";
import ProductImage from "./ProductImage";

type Category = { id: number; slug: string; name_uz: string; name_ru: string; name_en: string };
type Product = {
  id: number;
  slug: string;
  category_id: number;
  name_uz: string; name_ru: string; name_en: string;
  cover_image?: string | null;
};

// Mijoz belgilagan tartib: issiqlik izolyatsiyasi → sendvich panellar → gidroponika
const ORDER: { slug: DirectionSlug; titleKey: string }[] = [
  { slug: "thermal", titleKey: "hero.cta_thermal" },
  { slug: "panels", titleKey: "hero.cta_panels" },
  { slug: "hydroponics", titleKey: "hero.cta_hydroponics" },
];

/**
 * 3 asosiy yo'nalish — har biri uchun 2 ta mahsulot kartochkasi
 * (rasm, nom, "Batafsil" tugmasi). Ma'lumotlar backend'dan.
 */
export default function Directions() {
  const { lang } = useLang();
  const visible = useSectionVisible("directions");
  const { data: categories = [] } = useSWR<Category[]>("/api/products/categories", fetcher);
  const { data: products = [] } = useSWR<Product[]>("/api/products", fetcher);
  if (!visible) return null;

  const more = lang === "uz" ? "Batafsil" : lang === "ru" ? "Подробнее" : "Learn more";

  return (
    <section className="relative bg-onyx-950 py-16 sm:py-20 lg:py-24 border-b border-pearl-100/5 overflow-hidden">
      <div className="orb orb-red w-[500px] h-[500px] -top-40 -left-40 opacity-20" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 xl:px-16 relative z-10 space-y-14 sm:space-y-20">
        {ORDER.map((dir, di) => {
          const cat = categories.find((c) => c.slug === dir.slug);
          const items = cat ? products.filter((p) => p.category_id === cat.id).slice(0, 2) : [];
          const Icon = DIRECTION_ICONS[dir.slug];
          return (
            <div key={dir.slug} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
              {/* Yo'nalish sarlavhasi */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="lg:col-span-4 flex flex-row lg:flex-col items-center lg:items-start gap-4 lg:gap-6"
              >
                <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-gold-400/25 via-onyx-800/80 to-onyx-900 border border-gold-400/30 flex items-center justify-center shadow-lg shadow-gold-900/40">
                  <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-pearl-50" />
                </div>
                <div>
                  <span className="font-mono text-xs text-pearl-300 tracking-widest">0{di + 1}</span>
                  <h2 className="h-display text-pearl-50 text-xl xs:text-2xl sm:text-3xl xl:text-[34px] leading-tight mt-1 mb-3 break-words">
                    {t(lang, dir.titleKey)}
                  </h2>
                  <Link
                    href={`/products?cat=${dir.slug}`}
                    className="hidden sm:inline-flex items-center gap-2 text-pearl-200 hover:text-gold-300 font-semibold text-sm transition-colors"
                  >
                    {t(lang, "hero.cta_view_catalog")}
                    <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                  </Link>
                </div>
              </motion.div>

              {/* 2 ta mahsulot kartochkasi */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {(items.length ? items : [null, null]).map((p, i) => (
                  <motion.div
                    key={p?.id ?? `sk-${i}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {p ? (
                      <Link
                        href={`/products/${p.slug}`}
                        className="group flex flex-col h-full overflow-hidden rounded-3xl bg-onyx-900/60 border border-pearl-100/10 hover:border-gold-400/40 transition-all duration-500"
                      >
                        <ProductImage
                          src={p.cover_image}
                          alt={pickLang(p, lang, "name")}
                          category={dir.slug}
                          className="aspect-[4/3]"
                          imgClassName="transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="flex flex-col flex-1 p-5 sm:p-6">
                          <h3 className="h-display text-pearl-50 text-lg sm:text-xl leading-tight mb-5">
                            {pickLang(p, lang, "name")}
                          </h3>
                          <span className="mt-auto self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-400 group-hover:bg-gold-600 text-pearl-50 text-sm font-semibold transition-colors">
                            {more}
                            <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                          </span>
                        </div>
                      </Link>
                    ) : (
                      <div className="h-full rounded-3xl bg-onyx-900/60 border border-pearl-100/10 overflow-hidden">
                        <div className="skeleton aspect-[4/3]" />
                        <div className="p-6 space-y-3">
                          <div className="skeleton h-6 w-3/4" />
                          <div className="skeleton h-10 w-32 rounded-full" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
