"use client";
import useSWR from "swr";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Maximize2, Phone, ArrowUpRight } from "lucide-react";
import { fetcher, pickLang } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { useApplicationModal } from "@/lib/application-modal";
import { projectImage } from "@/lib/sample-images";
import Gallery from "./Gallery";

type Project = {
  id: number;
  slug?: string;
  title_uz: string; title_ru: string; title_en: string;
  description_uz: string; description_ru: string; description_en: string;
  location?: string;
  year?: number;
  area_m2?: number;
  cover_image?: string;
  gallery?: string[];
};

export default function ProjectDetail({ slug }: { slug: string }) {
  const { lang } = useLang();
  const { show: showModal } = useApplicationModal();
  const { data: project, error } = useSWR<Project>(`/api/content/projects/by-slug/${slug}`, fetcher);
  const { data: all = [] } = useSWR<Project[]>("/api/content/projects", fetcher);

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="h-display text-pearl-100 text-6xl mb-4 text-gradient-red">404</div>
        <Link href="/projects" className="btn-gold inline-flex">
          <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2} />
          {t(lang, "nav.projects")}
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="skeleton aspect-video mb-8" />
        <div className="skeleton h-12 w-3/4" />
      </div>
    );
  }

  const others = all.filter((p) => p.id !== project.id).slice(0, 3);

  const sections = {
    challenge: {
      uz: "Mijoz keng maydonli sanoat ob'ekti uchun yong'inga maksimal chidamli, ammo iqtisodiy yechim qidirardi. Maydon o'lchami, harorat farqlari va qisqa muddatda yetkazib berish — asosiy talablar edi.",
      ru: "Клиент искал максимально огнестойкое, но экономичное решение для крупного промышленного объекта. Размер площади, температурные перепады и сжатые сроки — основные требования.",
      en: "The client sought a maximum fire-resistant yet cost-effective solution for a large industrial facility. Site dimensions, temperature variations and tight delivery schedule were the key requirements.",
    },
    solution: {
      uz: "Bazalt yadroli sendvich panellar 150mm qalinligida tanlandi. EI 240 sertifikatlangan, A1 yong'in klassi. 8 hafta ichida ishlab chiqarish va montaj.",
      ru: "Выбраны сэндвич-панели с базальтовым ядром толщиной 150мм. Сертифицированы EI 240, класс пожарной опасности A1. Производство и монтаж за 8 недель.",
      en: "150mm thick basalt-core sandwich panels were selected. EI 240 certified, A1 fire class. Manufacturing and installation completed in 8 weeks.",
    },
    result: {
      uz: "Loyiha 5 hafta oldin yakunlandi. Mijoz energiya sarfini 35% kamaytirdi, sug'urta kompaniyasi yong'in tarifini 20% tushirdi.",
      ru: "Проект завершён на 5 недель раньше срока. Клиент снизил энергозатраты на 35%, страховая компания снизила пожарный тариф на 20%.",
      en: "Project completed 5 weeks ahead of schedule. Client reduced energy costs by 35%, insurance company lowered fire premium by 20%.",
    },
  };

  return (
    <section className="py-12 sm:py-16 bg-onyx-900 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pearl-100/5 border border-pearl-100/10 text-pearl-200 hover:text-pearl-100 hover:bg-pearl-100/10 text-sm font-medium mb-8 sm:mb-10 transition-all backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          {t(lang, "nav.projects")}
        </Link>

        {/* Title section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8 sm:mb-10"
        >
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {project.year && (
              <div className="badge-pill">
                <Calendar className="w-3 h-3" strokeWidth={2.5} />
                <span className="tabular">{project.year}</span>
              </div>
            )}
            {project.location && (
              <div className="badge-pill">
                <MapPin className="w-3 h-3" strokeWidth={2.5} />
                <span>{project.location}</span>
              </div>
            )}
            {project.area_m2 && (
              <div className="badge-pill bg-gold-400/15 border-gold-400/40 text-gold-400">
                <Maximize2 className="w-3 h-3" strokeWidth={2.5} />
                <span className="tabular">{project.area_m2.toLocaleString("en-US")} m²</span>
              </div>
            )}
          </div>
          <h1 className="h-display text-pearl-100 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-balance max-w-4xl leading-tight">
            {pickLang(project, lang, "title")}
          </h1>
        </motion.div>

        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <Gallery
            images={
              project.gallery && project.gallery.length > 0
                ? [projectImage(project.slug, project.cover_image), ...project.gallery]
                : [projectImage(project.slug, project.cover_image)]
            }
            alt={pickLang(project, lang, "title")}
          />
        </motion.div>

        {/* Description + Sticky info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 mb-12 sm:mb-20"
        >
          <div className="lg:col-span-8">
            <p className="text-pearl-200 text-base sm:text-lg leading-relaxed mb-12">
              {pickLang(project, lang, "description")}
            </p>

            <div className="space-y-10">
              {[
                { key: "challenge", num: "01", title: { uz: "Vazifa", ru: "Задача", en: "Challenge" }, color: "from-red-500/20 to-red-500/5", border: "border-red-500/30" },
                { key: "solution",  num: "02", title: { uz: "Yechim", ru: "Решение", en: "Solution" }, color: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/30" },
                { key: "result",    num: "03", title: { uz: "Natija", ru: "Результат", en: "Result" }, color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/30" },
              ].map((s, i) => (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="feature-card p-6 sm:p-7"
                >
                  <div className="flex items-baseline gap-4 mb-3">
                    <div className={`px-3 py-1 rounded-full bg-gradient-to-br ${s.color} border ${s.border} text-xs font-bold text-pearl-100 tabular`}>
                      {s.num}
                    </div>
                    <h3 className="h-display text-pearl-100 text-2xl">{s.title[lang]}</h3>
                  </div>
                  <p className="text-pearl-200 text-sm sm:text-base leading-relaxed">
                    {sections[s.key as keyof typeof sections][lang]}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sticky info */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32 space-y-4">
              <div className="feature-card p-6">
                <h3 className="text-xs font-bold text-gold-400 mb-5 uppercase tracking-wider">PROJECT DATA</h3>
                <dl className="space-y-3">
                  {project.year && (
                    <div className="flex justify-between border-b border-pearl-100/5 pb-3">
                      <dt className="text-xs text-pearl-300 font-medium">Year</dt>
                      <dd className="text-pearl-100 font-semibold text-sm tabular">{project.year}</dd>
                    </div>
                  )}
                  {project.location && (
                    <div className="flex justify-between border-b border-pearl-100/5 pb-3">
                      <dt className="text-xs text-pearl-300 font-medium">Location</dt>
                      <dd className="text-pearl-100 font-semibold text-sm">{project.location}</dd>
                    </div>
                  )}
                  {project.area_m2 && (
                    <div className="flex justify-between border-b border-pearl-100/5 pb-3">
                      <dt className="text-xs text-pearl-300 font-medium">Area</dt>
                      <dd className="text-pearl-100 font-semibold text-sm tabular">{project.area_m2.toLocaleString("en-US")} m²</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-xs text-pearl-300 font-medium">Type</dt>
                    <dd className="text-pearl-100 font-semibold text-sm">Sandwich Panel</dd>
                  </div>
                </dl>
              </div>

              <button onClick={() => showModal()} className="btn-solid-gold w-full !flex group">
                <Phone className="w-4 h-4 mr-2" strokeWidth={2.5} />
                {t(lang, "calc.cta")}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Other projects */}
        {others.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="h-display text-pearl-100 text-2xl sm:text-3xl">
                {lang === "uz" ? "Boshqa loyihalar" : lang === "ru" ? "Другие проекты" : "More projects"}
              </h2>
              <Link href="/projects" className="link-modern text-gold-400 text-sm font-semibold">
                {lang === "uz" ? "Hammasi" : lang === "ru" ? "Все" : "View all"}
                <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {others.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.slug}`}
                  className="group block overflow-hidden rounded-3xl bg-onyx-800/40 border border-pearl-100/5 hover:border-gold-400/40 transition-all duration-500 backdrop-blur-sm hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-onyx-700 relative">
                    <img
                      src={projectImage(p.slug, p.cover_image)}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-onyx-950/80 to-transparent" />
                  </div>
                  <div className="p-5">
                    {p.location && (
                      <div className="text-xs text-gold-400 mb-2 font-semibold">
                        {p.location} · {p.year}
                      </div>
                    )}
                    <h3 className="h-display text-pearl-100 text-lg group-hover:text-gradient-red transition-all line-clamp-2 leading-snug">
                      {pickLang(p, lang, "title")}
                    </h3>
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
