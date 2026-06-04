"use client";
import useSWR from "swr";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Maximize2, Phone } from "lucide-react";
import { fetcher, pickLang } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { useApplicationModal } from "@/lib/application-modal";
import { projectImage } from "@/lib/sample-images";

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
      <div className="container mx-auto px-8 py-32 text-center">
        <h1 className="h-display text-pearl-100 text-4xl mb-4">404</h1>
        <Link href="/projects" className="btn-gold">
          <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2} />
          {t(lang, "nav.projects")}
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-8 py-32 animate-pulse">
        <div className="h-8 bg-onyx-800 w-32 mb-8" />
        <div className="aspect-video bg-onyx-800 mb-8" />
        <div className="h-12 bg-onyx-800 w-3/4" />
      </div>
    );
  }

  const others = all.filter((p) => p.id !== project.id).slice(0, 3);

  // Mock case study sections (real loyihada API'dan kelishi mumkin)
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
    <section className="py-12 sm:py-16 bg-onyx-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-pearl-300 hover:text-gold-400 text-xs uppercase tracking-[0.15em] font-semibold mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          {t(lang, "nav.projects")}
        </Link>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="aspect-[16/9] bg-onyx-800 border border-onyx-700 relative overflow-hidden mb-12"
        >
          <img
            src={projectImage(project.slug, project.cover_image)}
            alt={pickLang(project, lang, "title")}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-onyx-950/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8">
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-[10px] sm:text-xs text-gold-400 uppercase tracking-[0.2em] font-semibold mb-3 sm:mb-4">
              {project.year && (
                <span className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" strokeWidth={2} />
                  {project.year}
                </span>
              )}
              {project.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" strokeWidth={2} />
                  {project.location}
                </span>
              )}
              {project.area_m2 && (
                <span className="flex items-center gap-2">
                  <Maximize2 className="w-3 h-3" strokeWidth={2} />
                  {project.area_m2.toLocaleString("en-US")} m²
                </span>
              )}
            </div>
            <h1 className="h-display text-pearl-100 text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-balance max-w-4xl">
              {pickLang(project, lang, "title")}
            </h1>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 mb-12 sm:mb-20"
        >
          <div className="lg:col-span-8">
            <p className="text-pearl-200 text-lg leading-relaxed mb-12">
              {pickLang(project, lang, "description")}
            </p>

            <div className="space-y-12">
              {[
                { key: "challenge", num: "01", title: { uz: "Vazifa", ru: "Задача", en: "Challenge" } },
                { key: "solution",  num: "02", title: { uz: "Yechim", ru: "Решение", en: "Solution" } },
                { key: "result",    num: "03", title: { uz: "Natija", ru: "Результат", en: "Result" } },
              ].map((s) => (
                <div key={s.key}>
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="text-gold-400 font-mono text-sm tracking-[0.2em] font-semibold">{s.num}</span>
                    <h3 className="h-display text-pearl-100 text-2xl">
                      {s.title[lang]}
                    </h3>
                  </div>
                  <p className="text-pearl-200 text-base leading-relaxed pl-10">
                    {sections[s.key as keyof typeof sections][lang]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky info */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32 space-y-6">
              <div className="bg-onyx-800 border border-onyx-700 p-6">
                <h3 className="text-[10px] tracking-[0.2em] uppercase text-gold-400 mb-5 font-semibold">PROJECT DATA</h3>
                <dl className="space-y-4">
                  {project.year && (
                    <div className="flex justify-between border-b border-onyx-700 pb-3">
                      <dt className="text-xs uppercase tracking-wider text-pearl-300 font-semibold">Year</dt>
                      <dd className="text-pearl-100 font-semibold">{project.year}</dd>
                    </div>
                  )}
                  {project.location && (
                    <div className="flex justify-between border-b border-onyx-700 pb-3">
                      <dt className="text-xs uppercase tracking-wider text-pearl-300 font-semibold">Location</dt>
                      <dd className="text-pearl-100 font-semibold">{project.location}</dd>
                    </div>
                  )}
                  {project.area_m2 && (
                    <div className="flex justify-between border-b border-onyx-700 pb-3">
                      <dt className="text-xs uppercase tracking-wider text-pearl-300 font-semibold">Area</dt>
                      <dd className="text-pearl-100 font-semibold">{project.area_m2.toLocaleString("en-US")} m²</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-xs uppercase tracking-wider text-pearl-300 font-semibold">Type</dt>
                    <dd className="text-pearl-100 font-semibold">Sandwich Panel</dd>
                  </div>
                </dl>
              </div>

              <button onClick={() => showModal()} className="btn-solid-gold w-full !flex">
                <Phone className="w-4 h-4 mr-2" strokeWidth={2} />
                {t(lang, "calc.cta")}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Other projects */}
        {others.length > 0 && (
          <div>
            <div className="ornament mb-6">
              <span className="text-[11px] tracking-[0.2em] uppercase font-semibold">MORE PROJECTS</span>
            </div>
            <h2 className="h-display text-pearl-100 text-2xl md:text-3xl mb-8">
              {t(lang, "projects.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {others.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.slug}`}
                  className="group bg-onyx-800 border border-onyx-700 hover:border-gold-400 transition-all duration-300"
                >
                  <div className="aspect-[4/3] bg-onyx-700 relative overflow-hidden">
                    <img
                      src={projectImage(p.slug, p.cover_image)}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    {p.location && (
                      <div className="text-[10px] text-gold-400 mb-2 uppercase tracking-wider font-semibold">
                        {p.location} · {p.year}
                      </div>
                    )}
                    <h3 className="h-display text-pearl-100 text-lg group-hover:text-gold-400 transition-colors line-clamp-2">
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
