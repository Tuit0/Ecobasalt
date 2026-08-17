"use client";
import { motion } from "framer-motion";
import { MessageSquare, Pencil, Factory, Truck, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { useApplicationModal } from "@/lib/application-modal";
import { useSectionVisible } from "@/lib/section-visibility";

const STEPS = [
  {
    num: "01",
    icon: MessageSquare,
    duration_uz: "24 soat",
    duration_ru: "24 часа",
    duration_en: "24 hours",
    title_uz: "Maslahat",
    title_ru: "Консультация",
    title_en: "Consultation",
    desc_uz: "Sizning loyihangizni o'rganamiz, texnik talablarni aniqlaymiz va bepul taklif tayyorlaymiz.",
    desc_ru: "Изучаем ваш проект, уточняем технические требования и готовим бесплатное предложение.",
    desc_en: "We study your project, clarify technical requirements and prepare a free proposal.",
  },
  {
    num: "02",
    icon: Pencil,
    duration_uz: "3-5 kun",
    duration_ru: "3-5 дней",
    duration_en: "3-5 days",
    title_uz: "Loyiha",
    title_ru: "Проектирование",
    title_en: "Design",
    desc_uz: "3D model, hisoblar va specifikatsiya. BIM modellar yetkazib beriladi.",
    desc_ru: "3D модель, расчёты и спецификация. Предоставляем BIM модели.",
    desc_en: "3D model, calculations and specs. BIM models delivered.",
  },
  {
    num: "03",
    icon: Factory,
    duration_uz: "7-14 kun",
    duration_ru: "7-14 дней",
    duration_en: "7-14 days",
    title_uz: "Ishlab chiqarish",
    title_ru: "Производство",
    title_en: "Production",
    desc_uz: "Zamonaviy zavodda Yevropa standartlari bo'yicha ishlab chiqaramiz va sertifikatlash bilan.",
    desc_ru: "Производим на современном заводе по европейским стандартам с сертификацией.",
    desc_en: "Manufactured at modern facility, European standards with certification.",
  },
  {
    num: "04",
    icon: Truck,
    duration_uz: "7-30 kun",
    duration_ru: "7-30 дней",
    duration_en: "7-30 days",
    title_uz: "Yetkazish va montaj",
    title_ru: "Доставка и монтаж",
    title_en: "Delivery & Installation",
    desc_uz: "O'z transport va malakali montajchilar bilan O'zbekiston bo'ylab yetkazib beramiz.",
    desc_ru: "Доставляем по всему Узбекистану собственным транспортом с командой монтажников.",
    desc_en: "Delivered nationwide with our fleet and skilled installation team.",
  },
];

export default function Process() {
  const { lang } = useLang();
  const visible = useSectionVisible("process");
  const { show: showModal } = useApplicationModal();

  if (!visible) return null;

  return (
    <section id="process" className="py-14 sm:py-20 lg:py-28 xl:py-32 relative bg-onyx-950 overflow-hidden">
      {/* Animated background mesh */}
      <div className="absolute inset-0 gradient-mesh opacity-60" />
      <div className="orb orb-red w-[600px] h-[600px] -top-40 -right-40 opacity-40" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-14 sm:mb-20"
        >
          <span className="badge-pill mb-6">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            {lang === "uz" ? "JARAYON" : lang === "ru" ? "ПРОЦЕСС" : "PROCESS"}
          </span>
          <h2 className="h-display text-pearl-100 text-4xl sm:text-5xl md:text-6xl mb-5 text-balance leading-tight">
            {lang === "uz" ? (
              <>Loyihangiz <span className="text-gradient-red">4 oson qadamda</span></>
            ) : lang === "ru" ? (
              <>Ваш проект в <span className="text-gradient-red">4 простых шага</span></>
            ) : (
              <>Your project in <span className="text-gradient-red">4 simple steps</span></>
            )}
          </h2>
          <p className="text-pearl-200 text-base sm:text-lg leading-relaxed">
            {lang === "uz" ? "Idea'dan tayyor binogacha — biz har bosqichda yoningizdamiz." : lang === "ru" ? "От идеи до готового здания — мы рядом на каждом этапе." : "From idea to finished building — we're with you every step."}
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-14 sm:mb-16">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8 }}
                className="lux-card p-6 sm:p-8 relative group"
              >
                {/* Step number — large bg */}
                <div className="absolute top-4 right-6 text-7xl sm:text-8xl font-bold text-pearl-100/[0.04] pointer-events-none">
                  {s.num}
                </div>

                {/* Connector arrow (desktop only) */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-gold-400 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-pearl-100" strokeWidth={2.5} />
                  </div>
                )}

                <div className="relative">
                  {/* Icon */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-400/5 border border-gold-400/30 flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gold-400" strokeWidth={1.8} />
                  </div>

                  {/* Step + duration */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-[10px] text-gold-400 font-bold tracking-wider">STEP {s.num}</span>
                    <span className="text-pearl-300 text-xs">·</span>
                    <span className="text-pearl-300 text-xs">
                      {lang === "uz" ? s.duration_uz : lang === "ru" ? s.duration_ru : s.duration_en}
                    </span>
                  </div>

                  <h3 className="h-display text-pearl-100 text-xl sm:text-2xl mb-3 group-hover:text-gradient-red transition-all">
                    {lang === "uz" ? s.title_uz : lang === "ru" ? s.title_ru : s.title_en}
                  </h3>
                  <p className="text-pearl-200 text-sm sm:text-base leading-relaxed">
                    {lang === "uz" ? s.desc_uz : lang === "ru" ? s.desc_ru : s.desc_en}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <button onClick={() => showModal()} className="btn-solid-gold group !text-base !py-4 !px-9">
            {lang === "uz" ? "Loyihani boshlash" : lang === "ru" ? "Начать проект" : "Start your project"}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
