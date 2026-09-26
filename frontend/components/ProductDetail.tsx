"use client";
import useSWR from "swr";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ArrowUpRight, Send } from "lucide-react";
import { fetcher, pickLang, Lang } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { useApplicationModal } from "@/lib/application-modal";
import Gallery from "./Gallery";
import ProductImage from "./ProductImage";
import { DIRECTION_ICONS, DirectionSlug } from "./BrandIcons";

type Category = { id: number; slug: string; name_uz: string; name_ru: string; name_en: string };
type Product = {
  id: number;
  slug: string;
  category_id: number;
  name_uz: string; name_ru: string; name_en: string;
  short_uz?: string; short_ru?: string; short_en?: string;
  description_uz?: string; description_ru?: string; description_en?: string;
  advantages_uz?: string[]; advantages_ru?: string[]; advantages_en?: string[];
  applications_uz?: string[]; applications_ru?: string[]; applications_en?: string[];
  cover_image?: string | null;
  gallery?: string[];
};

// Tanlangan tildagi ro'yxat, bo'sh bo'lsa — rus/o'zbek tiliga qaytadi
function pickList(p: Product, lang: Lang, field: "advantages" | "applications"): string[] {
  for (const l of [lang, "ru", "uz"] as Lang[]) {
    const v = (p as any)[`${field}_${l}`];
    if (Array.isArray(v) && v.length) return v;
  }
  return [];
}

const L = {
  about: { uz: "Mahsulot haqida", ru: "О продукции", en: "About the product" },
  advantages: { uz: "Asosiy afzalliklar", ru: "Основные преимущества", en: "Key advantages" },
  applications: { uz: "Qo'llanish sohasi", ru: "Область применения", en: "Applications" },
  apply: { uz: "Ariza qoldirish", ru: "Оставить заявку", en: "Submit a request" },
  ctaText: {
    uz: "Mutaxassisimiz siz bilan bog'lanib, loyihangiz uchun optimal yechimni taklif qiladi.",
    ru: "Наш специалист свяжется с вами и предложит оптимальное решение для вашего объекта.",
    en: "Our specialist will contact you and suggest the best solution for your project.",
  },
  related: { uz: "Ushbu yo'nalishdagi boshqa mahsulotlar", ru: "Другая продукция направления", en: "More in this category" },
};

export default function ProductDetail({ slug }: { slug: string }) {
  const { lang } = useLang();
  const { show: showModal } = useApplicationModal();
  const { data: product, error } = useSWR<Product>(`/api/products/${slug}`, fetcher, {
    revalidateOnFocus: false,
  });
  const { data: categories = [] } = useSWR<Category[]>("/api/products/categories", fetcher);
  const { data: all = [] } = useSWR<Product[]>(product ? "/api/products" : null, fetcher);

  if (error || (product && !(product as any).slug)) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="h-display text-pearl-100 text-6xl mb-4 text-gradient-red">404</div>
        <p className="text-pearl-200 mb-8">{t(lang, "products.empty")}</p>
        <Link href="/products" className="btn-gold inline-flex">
          <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2} />
          {t(lang, "products.title")}
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6"><div className="skeleton aspect-[4/3]" /></div>
          <div className="lg:col-span-6 space-y-4">
            <div className="skeleton h-12 w-3/4" />
            <div className="skeleton h-6 w-full" />
            <div className="skeleton h-6 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.category_id);
  const catSlug = category?.slug as DirectionSlug | undefined;
  const CatIcon = catSlug && DIRECTION_ICONS[catSlug];
  const name = pickLang(product, lang, "name");
  const about = pickLang(product, lang, "description") || pickLang(product, lang, "short");
  const advantages = pickList(product, lang, "advantages");
  const applications = pickList(product, lang, "applications");
  const related = all.filter((r) => r.category_id === product.category_id && r.id !== product.id).slice(0, 2);
  const images = [product.cover_image, ...(product.gallery || [])].filter(Boolean) as string[];
  const apply = () => showModal(product.slug, undefined);

  return (
    <section className="py-12 sm:py-16 bg-onyx-900 relative overflow-hidden">
      <div className="orb orb-warm w-[400px] h-[400px] top-20 -left-40 opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb */}
        <Link
          href={catSlug ? `/products?cat=${catSlug}` : "/products"}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pearl-100/5 border border-pearl-100/10 text-pearl-200 hover:text-pearl-100 hover:bg-pearl-100/10 text-sm font-medium mb-8 sm:mb-10 transition-all duration-300 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          {category ? pickLang(category, lang, "name") : t(lang, "products.title")}
        </Link>

        {/* 1. Rasm + nom + qisqa tavsif + ariza */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 sm:mb-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            {images.length > 0 ? (
              <Gallery images={images} alt={name} />
            ) : (
              <ProductImage alt={name} category={catSlug} className="aspect-[4/3] rounded-3xl border border-pearl-100/10" />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-6"
          >
            {category && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-300 text-xs font-semibold tracking-wide mb-5">
                {CatIcon && <CatIcon className="w-4 h-4" />}
                {pickLang(category, lang, "name")}
              </span>
            )}

            <h1 className="h-display text-pearl-50 text-3xl sm:text-4xl md:text-5xl mb-6 text-balance leading-tight">
              {name}
            </h1>

            {about && (
              <>
                <h2 className="text-xs font-bold text-gold-300 mb-3 uppercase tracking-[0.2em]">{L.about[lang]}</h2>
                <p className="text-pearl-200 text-base sm:text-lg leading-relaxed mb-8 whitespace-pre-line">{about}</p>
              </>
            )}

            <button onClick={apply} className="btn-solid-gold group !px-8">
              <Send className="w-4 h-4 mr-2" strokeWidth={2.5} />
              {L.apply[lang]}
            </button>
          </motion.div>
        </div>

        {/* 2. Afzalliklar + qo'llanish sohasi */}
        {(advantages.length > 0 || applications.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-12 sm:mb-16">
            {advantages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="feature-card p-6 sm:p-8"
              >
                <h2 className="h-display text-pearl-50 text-xl sm:text-2xl mb-6">{L.advantages[lang]}</h2>
                <ul className="space-y-3.5">
                  {advantages.map((a, i) => (
                    <li key={i} className="flex items-start gap-3 text-pearl-100 text-[15px] leading-snug">
                      <span className="w-6 h-6 rounded-full bg-gold-400/15 border border-gold-400/40 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-gold-300" strokeWidth={3} />
                      </span>
                      <span className="pt-0.5">{a}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {applications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="feature-card p-6 sm:p-8"
              >
                <h2 className="h-display text-pearl-50 text-xl sm:text-2xl mb-6">{L.applications[lang]}</h2>
                <ul className="space-y-3.5">
                  {applications.map((a, i) => (
                    <li key={i} className="flex items-start gap-3 text-pearl-100 text-[15px] leading-snug">
                      <span className="font-mono text-xs text-gold-300 w-6 pt-1 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                      <span className="pt-0.5">{a}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        )}

        {/* 3. Ariza banneri */}
        <div className="rounded-3xl border border-gold-400/25 bg-gradient-to-r from-gold-400/15 via-onyx-800/60 to-onyx-800/40 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 mb-12 sm:mb-16">
          <div>
            <div className="h-display text-pearl-50 text-xl sm:text-2xl mb-1.5">{name}</div>
            <p className="text-pearl-200 text-sm sm:text-base max-w-2xl">{L.ctaText[lang]}</p>
          </div>
          <button onClick={apply} className="btn-solid-gold shrink-0 !px-8">
            {L.apply[lang]}
          </button>
        </div>

        {/* Shu yo'nalishdagi boshqa mahsulotlar */}
        {related.length > 0 && (
          <div>
            <h2 className="h-display text-pearl-100 text-2xl sm:text-3xl mb-6 sm:mb-8">{L.related[lang]}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group flex items-center gap-4 p-3 rounded-3xl bg-onyx-800/40 border border-pearl-100/5 hover:border-gold-400/40 transition-all duration-500"
                >
                  <ProductImage
                    src={p.cover_image}
                    alt={pickLang(p, lang, "name")}
                    category={catSlug}
                    className="w-28 h-24 sm:w-32 sm:h-28 rounded-2xl shrink-0 [&_svg]:!w-10 [&_svg]:!h-10 [&>span]:hidden"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="h-display text-pearl-100 text-lg leading-tight mb-2">{pickLang(p, lang, "name")}</h3>
                    <span className="inline-flex items-center gap-1 text-gold-300 text-sm font-semibold">
                      {lang === "uz" ? "Batafsil" : lang === "ru" ? "Подробнее" : "Learn more"}
                      <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                    </span>
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
