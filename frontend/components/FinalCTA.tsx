"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

  const title = lang === "uz"
    ? "Hamkorlikka tayyormisiz?"
    : lang === "ru"
    ? "Готовы к сотрудничеству?"
    : "Ready to cooperate?";

  const subtitle = lang === "uz"
    ? "Kerakli ma'lumotni olish\nva hamkorlik shartlarini muhokama qilish uchun biz bilan bog'laning"
    : lang === "ru"
    ? "Свяжитесь с нами, чтобы получить необходимую информацию\nи обсудить условия сотрудничества"
    : "Contact us to get the information you need\nand discuss cooperation terms";

  const perks = lang === "uz" ? [
    "Mahsulot tanlash",
    "Texnik yordam",
    "O'zbekiston va xorij bo'yicha yetkazib berish",
  ] : lang === "ru" ? [
    "Подбор продукции",
    "Техническое сопровождение",
    "Поставки по Узбекистану и за рубеж",
  ] : [
    "Product selection",
    "Technical support",
    "Deliveries within Uzbekistan and abroad",
  ];

  const buttonLabel = lang === "uz" ? "Ariza qoldirish" : lang === "ru" ? "Оставить заявку" : "Submit request";

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
      <CursorGradient size={800} color="rgba(169, 29, 42, 0.25)" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Title — white, no gradient */}
          <h2 className="h-display text-pearl-100 text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 sm:mb-8 text-balance leading-tight">
            {title}
          </h2>

          {/* Subtitle */}
          <p className="text-pearl-200 text-base sm:text-lg md:text-xl mb-10 sm:mb-12 leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
            {subtitle}
          </p>

          {/* Single centered CTA button */}
          <div className="flex justify-center mb-10 sm:mb-12">
            <MagneticButton strength={0.3}>
              <button onClick={() => showModal()} className="btn-solid-gold !text-base !py-4 !px-9 group">
                {buttonLabel}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
              </button>
            </MagneticButton>
          </div>

          {/* Perks — single row with red bullets */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-3 text-pearl-200 text-sm sm:text-base"
          >
            {perks.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-gold-400 text-lg leading-none">•</span>
                <span>{p}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
