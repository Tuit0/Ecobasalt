"use client";
import { useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, CheckCircle2, Loader2 } from "lucide-react";
import { fetcher, blocksToMap, pickLang, api } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

export default function Contact() {
  const { lang } = useLang();
  const { data } = useSWR("/api/content/blocks?section=contact", fetcher);
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
  const email = pickLang(blocks["contact.email"], lang) || "info@basalt.uz";
  const address = pickLang(blocks["contact.address"], lang) || "Toshkent, O'zbekiston";

  const inputCls =
    "w-full bg-onyx-800 border border-onyx-700 px-4 py-3 text-pearl-100 placeholder-pearl-300/50 focus:border-gold-400 outline-none transition-colors text-base";

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24 bg-onyx-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mb-16"
        >
          <div className="ornament mb-6">
            <span className="text-[11px] tracking-[0.2em] uppercase font-semibold">{t(lang, "contact.eyebrow")}</span>
          </div>
          <h2 className="h-display text-pearl-100 text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-balance">
            {t(lang, "contact.title")}
          </h2>
          <p className="text-pearl-200 text-base sm:text-lg leading-relaxed">{t(lang, "contact.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Contact details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 space-y-px bg-onyx-700"
          >
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="bg-onyx-800 hover:bg-onyx-700/80 transition-colors p-6 flex items-center gap-4 group">
              <div className="w-12 h-12 bg-onyx-900 border border-onyx-700 group-hover:border-gold-400 flex items-center justify-center transition-colors">
                <Phone className="w-5 h-5 text-gold-400" strokeWidth={1.8} />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.15em] text-pearl-300 mb-1 font-semibold">{t(lang, "contact.phone")}</div>
                <div className="text-pearl-100 text-lg font-medium">{phone}</div>
              </div>
            </a>

            <a href={`mailto:${email}`} className="bg-onyx-800 hover:bg-onyx-700/80 transition-colors p-6 flex items-center gap-4 group">
              <div className="w-12 h-12 bg-onyx-900 border border-onyx-700 group-hover:border-gold-400 flex items-center justify-center transition-colors">
                <Mail className="w-5 h-5 text-gold-400" strokeWidth={1.8} />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.15em] text-pearl-300 mb-1 font-semibold">{t(lang, "contact.email")}</div>
                <div className="text-pearl-100 text-lg font-medium">{email}</div>
              </div>
            </a>

            <div className="bg-onyx-800 p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-onyx-900 border border-onyx-700 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-gold-400" strokeWidth={1.8} />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.15em] text-pearl-300 mb-1 font-semibold">{t(lang, "contact.address")}</div>
                <div className="text-pearl-100 text-lg font-medium">{address}</div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-7 bg-onyx-800 border border-onyx-700 p-5 sm:p-8 lg:p-10"
          >
            <h3 className="h-display text-pearl-100 text-2xl mb-2">{t(lang, "form.title")}</h3>
            <div className="w-12 h-0.5 bg-gold-400 mb-8" />

            <div className="space-y-5">
              <div>
                <label className="text-[10px] tracking-[0.15em] uppercase text-pearl-300 mb-2 block font-semibold">{t(lang, "form.name")} *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] tracking-[0.15em] uppercase text-pearl-300 mb-2 block font-semibold">{t(lang, "form.phone")} *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+998 ..."
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.15em] uppercase text-pearl-300 mb-2 block font-semibold">{t(lang, "form.email")}</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] tracking-[0.15em] uppercase text-pearl-300 mb-2 block font-semibold">{t(lang, "form.product")}</label>
                <select
                  value={form.product}
                  onChange={(e) => setForm({ ...form, product: e.target.value })}
                  className={inputCls + " cursor-pointer"}
                >
                  <option value="">—</option>
                  <option value="sandwich-panels">{t(lang, "form.opt_panels")}</option>
                  <option value="rockwool">{t(lang, "form.opt_rockwool")}</option>
                  <option value="basalt-fiber">{t(lang, "form.opt_fiber")}</option>
                  <option value="other">{t(lang, "form.opt_other")}</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] tracking-[0.15em] uppercase text-pearl-300 mb-2 block font-semibold">{t(lang, "form.message")}</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={inputCls + " resize-none"}
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-solid-gold w-full mt-4 disabled:opacity-50"
              >
                {status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : status === "ok" ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" strokeWidth={2} />
                    {t(lang, "form.success")}
                  </>
                ) : (
                  <>
                    {t(lang, "form.submit")}
                    <Send className="w-4 h-4 ml-2" strokeWidth={2} />
                  </>
                )}
              </button>
              {status === "error" && (
                <div className="text-center text-sm text-gold-400">{t(lang, "form.error")}</div>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
