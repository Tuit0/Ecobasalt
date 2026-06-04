"use client";
import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowRight } from "lucide-react";
import { fetcher, pickLang } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

type FAQ = {
  id: number;
  category?: string;
  question_uz: string; question_ru: string; question_en: string;
  answer_uz: string; answer_ru: string; answer_en: string;
  order: number;
};

export default function FAQ() {
  const { lang } = useLang();
  const [open, setOpen] = useState<number | null>(0);
  const { data: items = [], isLoading } = useSWR<FAQ[]>("/api/faqs", fetcher);

  return (
    <section id="faq" className="py-20 sm:py-28 lg:py-32 bg-onyx-900 relative overflow-hidden">
      <div className="orb orb-warm w-[500px] h-[500px] -left-40 top-1/3 opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12">
          {/* Left — Sticky header */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:sticky lg:top-32"
            >
              <span className="badge-pill mb-5">{t(lang, "faq.eyebrow")}</span>
              <h2 className="h-display text-pearl-100 text-4xl sm:text-5xl md:text-6xl mb-4 text-balance leading-tight">
                {t(lang, "faq.title").split(" ").slice(0, 2).join(" ")}{" "}
                <span className="text-gradient-red">{t(lang, "faq.title").split(" ").slice(2).join(" ")}</span>
              </h2>
              <p className="text-pearl-200 text-base sm:text-lg leading-relaxed mb-8">{t(lang, "faq.subtitle")}</p>
              <Link href="/contact" className="btn-gold inline-flex">
                {lang === "uz" ? "Bog'lanish" : lang === "ru" ? "Связаться" : "Contact us"}
                <ArrowRight className="w-4 h-4 ml-2" strokeWidth={2} />
              </Link>
            </motion.div>
          </div>

          {/* Right — Accordion */}
          <div className="lg:col-span-7">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="feature-card p-6">
                    <div className="skeleton h-6 w-3/4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((it, i) => {
                  const isOpen = open === i;
                  const q = pickLang(it, lang, "question");
                  const a = pickLang(it, lang, "answer");
                  return (
                    <motion.div
                      key={it.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                      className={`rounded-2xl border transition-all duration-300 ${
                        isOpen
                          ? "bg-onyx-800/60 border-gold-400/30 shadow-xl"
                          : "bg-onyx-900/40 border-pearl-100/5 hover:border-pearl-100/15"
                      } backdrop-blur-sm overflow-hidden`}
                    >
                      <button
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 group"
                      >
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <span className="text-xs font-bold text-gold-400 mt-1 shrink-0 tabular">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className={`text-base sm:text-lg font-semibold leading-snug ${isOpen ? "text-gradient-red" : "text-pearl-100"}`}>
                            {q}
                          </span>
                        </div>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isOpen ? "bg-gold-400 rotate-45" : "bg-pearl-100/5 group-hover:bg-pearl-100/10"
                        }`}>
                          <Plus className={`w-4 h-4 ${isOpen ? "text-pearl-100" : "text-pearl-200"}`} strokeWidth={2.5} />
                        </div>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pl-12 pr-6 pb-5 sm:pb-6 text-pearl-200 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                              {a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
