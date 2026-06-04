"use client";
import { motion } from "framer-motion";
import { FileText, Download, Award, FileCheck, BookOpen, FileImage } from "lucide-react";
import { useLang } from "@/lib/lang-context";

const DOCUMENTS = [
  {
    category: "datasheet",
    title_uz: "Devor sendvich panel — Texnik karta",
    title_ru: "Стеновая сэндвич-панель — Тех. карта",
    title_en: "Wall Sandwich Panel — Datasheet",
    size: "2.4 MB",
    pages: 12,
    icon: FileText,
  },
  {
    category: "datasheet",
    title_uz: "Tom sendvich panel — Texnik karta",
    title_ru: "Кровельная сэндвич-панель — Тех. карта",
    title_en: "Roof Sandwich Panel — Datasheet",
    size: "2.1 MB",
    pages: 14,
    icon: FileText,
  },
  {
    category: "datasheet",
    title_uz: "Soviqxona paneli — Texnik karta",
    title_ru: "Холодильная панель — Тех. карта",
    title_en: "Cold Storage Panel — Datasheet",
    size: "3.0 MB",
    pages: 16,
    icon: FileText,
  },
  {
    category: "certificate",
    title_uz: "ISO 9001:2015 Sertifikati",
    title_ru: "Сертификат ISO 9001:2015",
    title_en: "ISO 9001:2015 Certificate",
    size: "1.2 MB",
    pages: 4,
    icon: Award,
  },
  {
    category: "certificate",
    title_uz: "EN 14509 Yevropa standarti",
    title_ru: "EN 14509 Европейский стандарт",
    title_en: "EN 14509 European Standard",
    size: "1.5 MB",
    pages: 6,
    icon: Award,
  },
  {
    category: "certificate",
    title_uz: "GOST 30247 Yong'in xavfsizligi",
    title_ru: "ГОСТ 30247 Пожарная безопасность",
    title_en: "GOST 30247 Fire Safety",
    size: "1.8 MB",
    pages: 8,
    icon: FileCheck,
  },
  {
    category: "catalog",
    title_uz: "Mahsulotlar katalogi 2026",
    title_ru: "Каталог продукции 2026",
    title_en: "Products Catalog 2026",
    size: "12.4 MB",
    pages: 48,
    icon: BookOpen,
  },
  {
    category: "catalog",
    title_uz: "Loyihalar portfolio",
    title_ru: "Портфолио проектов",
    title_en: "Projects Portfolio",
    size: "8.7 MB",
    pages: 32,
    icon: FileImage,
  },
];

const CATEGORIES = {
  datasheet: { uz: "Texnik kartalar", ru: "Технические карты", en: "Datasheets", color: "bg-blue-500/10 border-blue-500/30 text-blue-400" },
  certificate: { uz: "Sertifikatlar", ru: "Сертификаты", en: "Certificates", color: "bg-amber-500/10 border-amber-500/30 text-amber-400" },
  catalog: { uz: "Kataloglar", ru: "Каталоги", en: "Catalogs", color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" },
};

export default function DownloadsPage() {
  const { lang } = useLang();

  return (
    <div className="pt-20">
      <section className="py-16 sm:py-20 bg-onyx-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mb-10 sm:mb-14"
          >
            <span className="badge-pill mb-5">
              {lang === "uz" ? "YUKLAB OLISH" : lang === "ru" ? "СКАЧАТЬ" : "DOWNLOADS"}
            </span>
            <h1 className="h-display text-pearl-100 text-4xl sm:text-5xl md:text-6xl mb-4 text-balance leading-tight">
              {lang === "uz" ? (
                <>Texnik <span className="text-gradient-red">hujjatlar</span></>
              ) : lang === "ru" ? (
                <>Технические <span className="text-gradient-red">документы</span></>
              ) : (
                <>Technical <span className="text-gradient-red">documents</span></>
              )}
            </h1>
            <p className="text-pearl-200 text-base sm:text-lg leading-relaxed">
              {lang === "uz" ? "Mahsulot kartalari, sertifikatlar va kataloglarni bepul yuklab oling." : lang === "ru" ? "Скачайте бесплатно карты продукции, сертификаты и каталоги." : "Free download of product datasheets, certificates and catalogs."}
            </p>
          </motion.div>

          {Object.entries(CATEGORIES).map(([catKey, catInfo]) => {
            const docs = DOCUMENTS.filter((d) => d.category === catKey);
            return (
              <div key={catKey} className="mb-12">
                <h2 className="h-display text-pearl-100 text-xl sm:text-2xl mb-5 flex items-center gap-3">
                  <span className={`badge-pill ${catInfo.color}`}>
                    {(catInfo as any)[lang]}
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {docs.map((d, i) => {
                    const Icon = d.icon;
                    return (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        whileHover={{ y: -4 }}
                        className="lux-card p-5 sm:p-6 text-left group cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-5">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-400/5 border border-gold-400/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Icon className="w-5 h-5 text-gold-400" strokeWidth={1.8} />
                          </div>
                          <div className="w-10 h-10 rounded-full bg-onyx-800 group-hover:bg-gold-400 flex items-center justify-center transition-colors">
                            <Download className="w-4 h-4 text-pearl-200 group-hover:text-pearl-100 transition-colors" strokeWidth={2} />
                          </div>
                        </div>
                        <h3 className="h-display text-pearl-100 text-base sm:text-lg mb-3 group-hover:text-gradient-red transition-colors leading-tight">
                          {(d as any)[`title_${lang}`]}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-pearl-300">
                          <span>PDF · {d.size}</span>
                          <span className="text-pearl-300/40">·</span>
                          <span>{d.pages} {lang === "uz" ? "bet" : lang === "ru" ? "стр." : "pages"}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
