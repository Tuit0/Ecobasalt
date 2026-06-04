"use client";
import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
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
    <section id="faq" className="py-16 sm:py-20 lg:py-24 bg-onyx-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
          {/* Left — Header */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:sticky lg:top-32"
            >
              <div className="ornament mb-5 sm:mb-6">
                <span className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-semibold">{t(lang, "faq.eyebrow")}</span>
              </div>
              <h2 className="h-display text-pearl-100 text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4 text-balance">
                {t(lang, "faq.title")}
              </h2>
              <p className="text-pearl-200 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">{t(lang, "faq.subtitle")}</p>
              <Link href="/contact" className="btn-gold">
                {t(lang, "calc.cta") || "Bog'lanish"}
              </Link>
            </motion.div>
          </div>

          {/* Right — Accordion */}
          <div className="lg:col-span-7">
            {isLoading ? (
              <div className="border-t border-onyx-700">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="border-b border-onyx-700 py-5 sm:py-6 animate-pulse">
                    <div className="h-6 bg-onyx-800 w-3/4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-t border-onyx-700">
                {items.map((it, i) => {
                  const isOpen = open === i;
                  const q = pickLang(it, lang, "question");
                  const a = pickLang(it, lang, "answer");
                  return (
                    <motion.div
                      key={it.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                      className="border-b border-onyx-700"
                    >
                      <button
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="w-full text-left py-5 sm:py-6 flex items-center justify-between gap-4 sm:gap-6 group"
                      >
                        <div className="flex items-start gap-3 sm:gap-5 flex-1 min-w-0">
                          <span className="text-[10px] font-mono text-gold-400 tracking-[0.15em] mt-1.5 font-semibold flex-shrink-0">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="h-display text-pearl-100 text-base sm:text-lg md:text-xl group-hover:text-gold-400 transition-colors">
                            {q}
                          </span>
                        </div>
                        <div className="w-9 h-9 sm:w-10 sm:h-10 border border-onyx-700 group-hover:border-gold-400 flex items-center justify-center flex-shrink-0 transition-colors">
                          {isOpen ? (
                            <Minus className="w-4 h-4 text-gold-400" strokeWidth={2} />
                          ) : (
                            <Plus className="w-4 h-4 text-pearl-200 group-hover:text-gold-400" strokeWidth={2} />
                          )}
                        </div>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pl-9 sm:pl-12 pr-10 sm:pr-14 pb-5 sm:pb-6 text-pearl-200 text-sm sm:text-base leading-relaxed whitespace-pre-line">
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
