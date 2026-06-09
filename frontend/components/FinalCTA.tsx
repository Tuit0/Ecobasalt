"use client";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Calculator } from "lucide-react";
import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { useApplicationModal } from "@/lib/application-modal";
import { useSectionVisible } from "@/lib/section-visibility";
import MagneticButton from "./MagneticButton";
import CursorGradient from "./CursorGradient";

export default function FinalCTA() {
  const { lang } = useLang();
  const visible = useSectionVisible("final_cta");
  const { show: showModal } = useApplicationModal();

  if (!visible) return null;

  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-onyx-950 relative overflow-hidden">
      {/* Bg image with red overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1920&q=85&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-onyx-950 via-onyx-950/60 to-onyx-950/40" />
      </div>

      {/* Animated orbs */}
      <div className="orb orb-red w-[600px] h-[600px] -top-40 -left-40" />
      <div className="orb orb-red w-[500px] h-[500px] bottom-0 -right-40 opacity-70" />

      {/* Cursor-follow gradient */}
      <CursorGradient size={800} color="rgba(220, 38, 38, 0.25)" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="badge-pill mb-6">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            {lang === "uz" ? "BEPUL MASLAHAT" : lang === "ru" ? "БЕСПЛАТНАЯ КОНСУЛЬТАЦИЯ" : "FREE CONSULTATION"}
          </span>

          <h2 className="h-display text-pearl-100 text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 sm:mb-8 text-balance leading-tight">
            {lang === "uz" ? (
              <>Loyihangizni <span className="text-gradient-red">boshlash</span>ga<br />tayyormisiz?</>
            ) : lang === "ru" ? (
              <>Готовы <span className="text-gradient-red">начать</span><br />ваш проект?</>
            ) : (
              <>Ready to <span className="text-gradient-red">start</span><br />your project?</>
            )}
          </h2>

          <p className="text-pearl-200 text-base sm:text-lg md:text-xl mb-10 sm:mb-12 leading-relaxed max-w-2xl mx-auto">
            {lang === "uz"
              ? "Mutaxassisimiz 24 soat ichida bog'lanadi va bepul taxminiy hisob beradi. Hech qanaqa majburiyat yo'q."
              : lang === "ru"
              ? "Наш специалист свяжется в течение 24 часов и предоставит бесплатный расчёт. Без обязательств."
              : "Our specialist will contact you within 24 hours with a free estimate. No commitment."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10 sm:mb-12">
            <MagneticButton strength={0.3}>
              <button onClick={() => showModal()} className="btn-solid-gold !text-base !py-4 !px-9 group">
                {lang === "uz" ? "Ariza qoldirish" : lang === "ru" ? "Оставить заявку" : "Get a Quote"}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
              </button>
            </MagneticButton>
            <MagneticButton strength={0.3}>
              <Link href="/calculator" className="btn-gold !text-base !py-4 !px-9 group">
                <Calculator className="w-5 h-5 mr-2" strokeWidth={2} />
                {lang === "uz" ? "Narxni hisoblash" : lang === "ru" ? "Рассчитать цену" : "Calculate price"}
              </Link>
            </MagneticButton>
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-pearl-200 text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>{lang === "uz" ? "24 soat ichida javob" : lang === "ru" ? "Ответ в 24 часа" : "Reply in 24h"}</span>
            </div>
            <span className="text-pearl-200/30">•</span>
            <div className="flex items-center gap-2">
              <span>{lang === "uz" ? "Bepul kalkulyatsiya" : lang === "ru" ? "Бесплатный расчёт" : "Free estimate"}</span>
            </div>
            <span className="text-pearl-200/30">•</span>
            <div className="flex items-center gap-2">
              <span>{lang === "uz" ? "15+ yillik tajriba" : lang === "ru" ? "15+ лет опыта" : "15+ years experience"}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
