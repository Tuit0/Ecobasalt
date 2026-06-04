"use client";
import useSWR from "swr";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Phone, Download, Package } from "lucide-react";
import { fetcher, pickLang } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { useApplicationModal } from "@/lib/application-modal";
import { productImage } from "@/lib/sample-images";

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
      <div className="container mx-auto px-8 py-32 text-center">
        <h1 className="h-display text-pearl-100 text-4xl mb-4">404</h1>
        <p className="text-pearl-200 mb-8">{t(lang, "products.empty")}</p>
        <Link href="/products" className="btn-gold">
          <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2} />
          {t(lang, "nav.products")}
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-8 py-32">
        <div className="animate-pulse">
          <div className="h-8 bg-onyx-800 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-onyx-800" />
            <div className="space-y-6">
              <div className="h-12 bg-onyx-800 w-3/4" />
              <div className="h-6 bg-onyx-800 w-full" />
              <div className="h-6 bg-onyx-800 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const otherProducts = related.filter((r) => r.id !== product.id).slice(0, 3);

  return (
    <section className="py-12 sm:py-16 bg-onyx-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-pearl-300 hover:text-gold-400 text-xs uppercase tracking-[0.15em] font-semibold mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          {t(lang, "nav.products")}
        </Link>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 mb-12 sm:mb-20">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="aspect-[4/3] bg-onyx-800 border border-onyx-700 relative overflow-hidden">
              <img
                src={productImage(product.slug, product.cover_image)}
                alt={pickLang(product, lang, "name")}
                className="w-full h-full object-cover"
              />
              {product.is_featured && (
                <div className="absolute top-4 left-4 bg-gold-400 text-pearl-100 text-[10px] uppercase tracking-[0.15em] font-bold px-3 py-1.5">
                  ★ {t(lang, "blog.read")}
                </div>
              )}
            </div>

            {/* Gallery thumbs */}
            {product.gallery && product.gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {product.gallery.slice(0, 4).map((img, i) => (
                  <div key={i} className="aspect-square bg-onyx-800 border border-onyx-700 hover:border-gold-400 cursor-pointer transition-colors overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="ornament mb-6">
              <span className="text-[11px] tracking-[0.2em] uppercase font-semibold">
                {t(lang, "products.eyebrow")}
              </span>
            </div>

            <h1 className="h-display text-pearl-100 text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-5 text-balance">
              {pickLang(product, lang, "name")}
            </h1>

            <p className="text-pearl-200 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
              {pickLang(product, lang, "short")}
            </p>

            {/* Price */}
            {product.price_from && (
              <div className="bg-onyx-800 border-l-2 border-gold-400 p-5 mb-8">
                <div className="text-[10px] tracking-[0.2em] uppercase text-pearl-300 mb-2 font-semibold">
                  {t(lang, "calc.per_m2")}
                </div>
                <div className="h-display text-3xl text-gold-400">
                  {t(lang, "blog.read") === "Read" ? "from " : "от "}
                  ${product.price_from}
                  <span className="text-base text-pearl-300 ml-2">{product.price_currency}</span>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button onClick={() => showModal(product.slug, undefined)} className="btn-solid-gold flex-1">
                <Phone className="w-4 h-4 mr-2" strokeWidth={2} />
                {t(lang, "calc.cta")}
              </button>
              <button className="btn-gold flex-1">
                <Download className="w-4 h-4 mr-2" strokeWidth={2} />
                PDF
              </button>
            </div>

            {/* Quick features */}
            <ul className="space-y-3 pt-6 border-t border-onyx-700">
              {[t(lang, "about.b1"), t(lang, "about.b2"), t(lang, "about.b3")].map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-pearl-200 text-sm">
                  <Check className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Description + Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 mb-12 sm:mb-20">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <h2 className="h-display text-pearl-100 text-2xl md:text-3xl mb-6">
              {t(lang, "about.eyebrow")}
            </h2>
            <div className="w-12 h-0.5 bg-gold-400 mb-6" />
            <p className="text-pearl-200 text-lg leading-relaxed whitespace-pre-line">
              {pickLang(product, lang, "description")}
            </p>
          </motion.div>

          {/* Specs */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5"
            >
              <div className="bg-onyx-800 border border-onyx-700 p-6">
                <h3 className="text-[10px] tracking-[0.25em] uppercase text-gold-400 mb-6 font-semibold">
                  SPECIFICATIONS
                </h3>
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specs).map(([k, v]) => (
                      <tr key={k} className="border-b border-onyx-700 last:border-b-0">
                        <td className="py-3 text-pearl-300 text-xs uppercase tracking-wider font-mono">
                          {k}
                        </td>
                        <td className="py-3 text-pearl-100 text-sm font-semibold text-right">
                          {v}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>

        {/* Related products */}
        {otherProducts.length > 0 && (
          <div>
            <div className="ornament mb-6">
              <span className="text-[11px] tracking-[0.2em] uppercase font-semibold">RELATED</span>
            </div>
            <h2 className="h-display text-pearl-100 text-2xl md:text-3xl mb-8">
              {t(lang, "products.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group bg-onyx-800 border border-onyx-700 hover:border-gold-400 transition-all duration-300"
                >
                  <div className="aspect-[4/3] bg-onyx-700 relative overflow-hidden">
                    <img
                      src={productImage(p.slug, p.cover_image)}
                      alt={pickLang(p, lang, "name")}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="h-display text-pearl-100 text-lg mb-2 group-hover:text-gold-400 transition-colors line-clamp-2">
                      {pickLang(p, lang, "name")}
                    </h3>
                    <p className="text-pearl-300 text-sm line-clamp-2">
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
