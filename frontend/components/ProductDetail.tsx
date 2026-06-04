"use client";
import useSWR from "swr";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Phone, Download, Sparkles, ArrowUpRight } from "lucide-react";
import { fetcher, pickLang } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { useApplicationModal } from "@/lib/application-modal";
import { productImage } from "@/lib/sample-images";
import Gallery from "./Gallery";

type Product = {
  id: number;
  slug: string;
  category_id: number;
  name_uz: string; name_ru: string; name_en: string;
  short_uz: string; short_ru: string; short_en: string;
  description_uz: string; description_ru: string; description_en: string;
  cover_image?: string;
  gallery?: string[];
  specs?: Record<string, string>;
  price_from?: number;
  price_currency?: string;
  is_featured?: boolean;
};

export default function ProductDetail({ slug }: { slug: string }) {
  const { lang } = useLang();
  const { show: showModal } = useApplicationModal();
  const { data: product, error } = useSWR<Product>(`/api/products/${slug}`, fetcher);
  const { data: related = [] } = useSWR<Product[]>(
    product ? `/api/products?category_id=${product.category_id}` : null,
    fetcher
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="h-display text-pearl-100 text-6xl mb-4 text-gradient-red">404</div>
        <p className="text-pearl-200 mb-8">{t(lang, "products.empty")}</p>
        <Link href="/products" className="btn-gold inline-flex">
          <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2} />
          {t(lang, "nav.products")}
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7"><div className="skeleton aspect-[4/3]" /></div>
          <div className="lg:col-span-5 space-y-4">
            <div className="skeleton h-12 w-3/4" />
            <div className="skeleton h-6 w-full" />
            <div className="skeleton h-6 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  const otherProducts = related.filter((r) => r.id !== product.id).slice(0, 3);

  return (
    <section className="py-12 sm:py-16 bg-onyx-900 relative">
      <div className="orb orb-warm w-[400px] h-[400px] top-20 -left-40 opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pearl-100/5 border border-pearl-100/10 text-pearl-200 hover:text-pearl-100 hover:bg-pearl-100/10 text-sm font-medium mb-8 sm:mb-10 transition-all duration-300 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          {t(lang, "nav.products")}
        </Link>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 mb-12 sm:mb-20">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative"
          >
            {/* Gallery — multiple images with lightbox */}
            <Gallery
              images={
                product.gallery && product.gallery.length > 0
                  ? [productImage(product.slug, product.cover_image), ...product.gallery]
                  : [productImage(product.slug, product.cover_image)]
              }
              alt={pickLang(product, lang, "name")}
            />
            {product.is_featured && (
              <div className="absolute top-5 left-5 z-10 badge-pill bg-onyx-950/70 backdrop-blur-xl border-gold-400/40 text-gold-400 pointer-events-none">
                <Sparkles className="w-3 h-3" strokeWidth={2} />
                <span>Featured</span>
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <span className="badge-pill mb-5">{t(lang, "products.eyebrow")}</span>

            <h1 className="h-display text-pearl-100 text-3xl sm:text-4xl md:text-5xl mb-5 text-balance leading-tight">
              {pickLang(product, lang, "name")}
            </h1>

            <p className="text-pearl-200 text-base sm:text-lg leading-relaxed mb-8">
              {pickLang(product, lang, "short")}
            </p>

            {/* Price card */}
            {product.price_from && (
              <div className="feature-card p-5 mb-8 border-l-2 border-l-gold-400/60">
                <div className="text-xs text-pearl-300 mb-2 font-semibold">
                  {t(lang, "calc.per_m2")}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-pearl-300">from</span>
                  <span className="h-display text-3xl sm:text-4xl text-gradient-red">${product.price_from}</span>
                  <span className="text-sm text-pearl-300">{product.price_currency}</span>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button onClick={() => showModal(product.slug, undefined)} className="btn-solid-gold flex-1 group">
                <Phone className="w-4 h-4 mr-2" strokeWidth={2.5} />
                {t(lang, "calc.cta")}
              </button>
              <button className="btn-gold flex-1 group">
                <Download className="w-4 h-4 mr-2" strokeWidth={2} />
                PDF
              </button>
            </div>

            {/* Quick features */}
            <ul className="space-y-3 pt-6 border-t border-pearl-100/8">
              {[t(lang, "about.b1"), t(lang, "about.b2"), t(lang, "about.b3")].map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-pearl-200 text-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />
                  </div>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Description + Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 mb-12 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <h2 className="h-display text-pearl-100 text-2xl sm:text-3xl mb-5">
              {t(lang, "about.eyebrow")}
            </h2>
            <div className="divider-soft mb-6" />
            <p className="text-pearl-200 text-base sm:text-lg leading-relaxed whitespace-pre-line">
              {pickLang(product, lang, "description")}
            </p>
          </motion.div>

          {product.specs && Object.keys(product.specs).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5"
            >
              <div className="feature-card p-6 sm:p-7">
                <h3 className="text-xs font-bold text-gold-400 mb-5 uppercase tracking-wider">
                  Specifications
                </h3>
                <dl className="space-y-3">
                  {Object.entries(product.specs).map(([k, v], i) => (
                    <motion.div
                      key={k}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex justify-between items-center py-2.5 border-b border-pearl-100/5 last:border-b-0"
                    >
                      <dt className="text-xs text-pearl-300 font-medium uppercase tracking-wide">{k}</dt>
                      <dd className="text-pearl-100 text-sm font-bold tabular">{v}</dd>
                    </motion.div>
                  ))}
                </dl>
              </div>
            </motion.div>
          )}
        </div>

        {/* Related products */}
        {otherProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="h-display text-pearl-100 text-2xl sm:text-3xl">
                {lang === "uz" ? "O'xshash mahsulotlar" : lang === "ru" ? "Похожие продукты" : "Related products"}
              </h2>
              <Link href="/products" className="link-modern text-gold-400 text-sm font-semibold">
                {lang === "uz" ? "Hammasi" : lang === "ru" ? "Все" : "View all"}
                <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {otherProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group block overflow-hidden rounded-3xl bg-onyx-800/40 border border-pearl-100/5 hover:border-gold-400/40 transition-all duration-500 backdrop-blur-sm hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-onyx-700 relative">
                    <img
                      src={productImage(p.slug, p.cover_image)}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="h-display text-pearl-100 text-lg mb-2 group-hover:text-gradient-red transition-all line-clamp-1">
                      {pickLang(p, lang, "name")}
                    </h3>
                    <p className="text-pearl-200 text-sm line-clamp-2">
                      {pickLang(p, lang, "short")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
