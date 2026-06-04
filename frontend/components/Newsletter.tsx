"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Check } from "lucide-react";
import { useLang } from "@/lib/lang-context";

export default function Newsletter() {
  const { lang } = useLang();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // TODO: real newsletter API integration
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("ok");
    setEmail("");
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <section className="py-16 sm:py-20 bg-onyx-900 border-y border-pearl-100/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto"
        >
          <div className="lux-card p-6 sm:p-10 relative overflow-hidden">
            <div className="orb orb-warm w-[400px] h-[400px] -top-40 -right-40 opacity-40" />

            <div className="relative grid grid-cols-1 md:grid-cols-12 items-center gap-6">
              <div className="md:col-span-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-400/5 border border-gold-400/30 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-gold-400" strokeWidth={2} />
                  </div>
                  <span className="text-xs font-semibold text-pearl-200 uppercase tracking-wider">
                    {lang === "uz" ? "Newsletter" : lang === "ru" ? "Рассылка" : "Newsletter"}
                  </span>
                </div>
                <h3 className="h-display text-pearl-100 text-2xl sm:text-3xl mb-3 leading-tight">
                  {lang === "uz" ? "Sanoat yangiliklarini olib turing" : lang === "ru" ? "Получайте новости индустрии" : "Industry news in your inbox"}
                </h3>
                <p className="text-pearl-200 text-sm sm:text-base">
                  {lang === "uz" ? "Yangi mahsulotlar, sertifikatlar va loyiha kashfiyotlari haqida birinchi bo'lib biling." : lang === "ru" ? "Узнавайте первыми о новой продукции и проектах." : "Be first to learn about new products and projects."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="md:col-span-5 relative">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={lang === "uz" ? "Email manzilingiz" : lang === "ru" ? "Ваш email" : "Your email"}
                    className="w-full bg-onyx-950/80 backdrop-blur border border-pearl-100/10 rounded-full px-5 py-4 pr-14 text-pearl-100 placeholder-pearl-300/40 focus:border-gold-400 outline-none transition-colors text-sm"
                    disabled={status !== "idle"}
                  />
                  <button
                    type="submit"
                    disabled={status !== "idle"}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
                    aria-label="Subscribe"
                  >
                    {status === "ok" ? (
                      <Check className="w-4 h-4 text-pearl-100" strokeWidth={2.5} />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-pearl-100" strokeWidth={2.5} />
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-pearl-300 mt-3 ml-1">
                  {lang === "uz" ? "Spam yo'q. Istalgan vaqtda obunani bekor qilishingiz mumkin." : lang === "ru" ? "Без спама. Отписаться в любое время." : "No spam. Unsubscribe anytime."}
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
