"use client";
import { useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, CheckCircle2, Loader2, Clock } from "lucide-react";
import { fetcher, blocksToMap, pickLang, api } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

export default function Contact() {
  const { lang } = useLang();
  const { data } = useSWR("/api/content/blocks?section=contact", fetcher, {
    refreshInterval: 30000,        // har 30 sekundda yangilash
    revalidateOnFocus: true,        // tab fokusda yangilash
    revalidateOnReconnect: true,
  });
  const blocks = blocksToMap(data || []);

  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "", product: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await api("/api/applications", { method: "POST", body: JSON.stringify({ ...form, source: "website", lang }) });
      setStatus("ok");
      setForm({ name: "", phone: "", email: "", message: "", product: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const phone = pickLang(blocks["contact.phone"], lang) || "+998 90 000 00 00";
  const email = pickLang(blocks["contact.email"], lang) || "info@ecobasalt.uz";
  const address = pickLang(blocks["contact.address"], lang) || "Toshkent, O'zbekiston";
  const hours = pickLang(blocks["contact.working_hours"], lang) || "Mon-Sat: 9:00 — 18:00";

  return (
    <section id="contact" className="py-14 sm:py-20 lg:py-28 xl:py-32 bg-onyx-900 relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-40" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mb-12 sm:mb-16"
        >
          <span className="badge-pill mb-5">{t(lang, "contact.eyebrow")}</span>
          <h2 className="h-display text-pearl-100 text-4xl sm:text-5xl md:text-6xl mb-4 text-balance leading-tight">
            {lang === "uz" ? (
              <>Bog'lanish <span className="text-gradient-red">vaqti</span></>
            ) : lang === "ru" ? (
              <><span className="text-gradient-red">Свяжитесь</span> с нами</>
            ) : (
              <>Get <span className="text-gradient-red">in touch</span></>
            )}
          </h2>
          <p className="text-pearl-200 text-base sm:text-lg leading-relaxed">{t(lang, "contact.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Contact cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 space-y-4"
          >
            {[
              { Icon: Phone, label: t(lang, "contact.phone"), value: phone, href: `tel:${phone.replace(/\s/g, "")}`, color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/30", iconColor: "text-emerald-400" },
              { Icon: Mail, label: t(lang, "contact.email"), value: email, href: `mailto:${email}`, color: "from-sky-500/20 to-sky-500/5", border: "border-sky-500/30", iconColor: "text-sky-400" },
              { Icon: MapPin, label: t(lang, "contact.address"), value: address, color: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/30", iconColor: "text-amber-400" },
              { Icon: Clock, label: lang === "uz" ? "Ish vaqti" : lang === "ru" ? "Часы работы" : "Hours", value: hours, color: "from-violet-500/20 to-violet-500/5", border: "border-violet-500/30", iconColor: "text-violet-400" },
            ].map((item, i) => {
              const Icon = item.Icon;
              const inner = (
                <>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} border ${item.border} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${item.iconColor}`} strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-pearl-300 mb-1 font-semibold">{item.label}</div>
                    <div className="text-pearl-100 font-medium truncate">{item.value}</div>
                  </div>
                </>
              );
              return item.href ? (
                <a key={i} href={item.href} className="feature-card p-5 flex items-center gap-4 hover:bg-onyx-800/50 group">
                  {inner}
                </a>
              ) : (
                <div key={i} className="feature-card p-5 flex items-center gap-4">
                  {inner}
                </div>
              );
            })}
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-7 feature-card p-6 sm:p-8 lg:p-10"
          >
            <h3 className="h-display text-pearl-100 text-2xl mb-2">{t(lang, "form.title")}</h3>
            <p className="text-pearl-200 text-sm mb-6 sm:mb-8">
              {lang === "uz" ? "Mutaxassisimiz 24 soat ichida bog'lanadi" : lang === "ru" ? "Свяжемся в течение 24 часов" : "Our specialist will contact you within 24 hours"}
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-pearl-300 mb-2 block">{t(lang, "form.name")} *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-modern"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-pearl-300 mb-2 block">{t(lang, "form.phone")} *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+998 ..."
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input-modern"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-pearl-300 mb-2 block">{t(lang, "form.email")}</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-modern"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-pearl-300 mb-2 block">{t(lang, "form.product")}</label>
                <select
                  value={form.product}
                  onChange={(e) => setForm({ ...form, product: e.target.value })}
                  className="input-modern cursor-pointer"
                >
                  <option value="">—</option>
                  <option value="sandwich-panels">{t(lang, "form.opt_panels")}</option>
                  <option value="rockwool">{t(lang, "form.opt_rockwool")}</option>
                  <option value="basalt-fiber">{t(lang, "form.opt_fiber")}</option>
                  <option value="other">{t(lang, "form.opt_other")}</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-pearl-300 mb-2 block">{t(lang, "form.message")}</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input-modern resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-solid-gold w-full !flex disabled:opacity-50 group"
              >
                {status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : status === "ok" ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" strokeWidth={2.5} />
                    {t(lang, "form.success")}
                  </>
                ) : (
                  <>
                    {t(lang, "form.submit")}
                    <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                  </>
                )}
              </button>
              {status === "error" && (
                <div className="text-center text-sm text-red-400">{t(lang, "form.error")}</div>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
