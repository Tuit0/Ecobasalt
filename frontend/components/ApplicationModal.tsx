"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { useApplicationModal } from "@/lib/application-modal";

export default function ApplicationModal() {
  const { lang } = useLang();
  const { open, preselectProduct, preselectMessage, hide } = useApplicationModal();

  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "", product: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  useEffect(() => {
    if (!open) return;
    setForm((f) => ({
      ...f,
      product: preselectProduct && !preselectProduct.startsWith("Calculator:") ? preselectProduct : f.product,
      message: preselectMessage || f.message,
    }));
  }, [open, preselectProduct, preselectMessage]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") hide(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, hide]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await api("/api/applications", {
        method: "POST",
        body: JSON.stringify({ ...form, source: "modal", lang }),
      });
      setStatus("ok");
      setForm({ name: "", phone: "", email: "", message: "", product: "" });
      setTimeout(() => { setStatus("idle"); hide(); }, 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-onyx-950/80 backdrop-blur-md"
          onClick={hide}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-onyx-900/95 backdrop-blur-2xl border border-pearl-100/10 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto relative shadow-2xl shadow-black/60"
          >
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />

            {/* Header */}
            <div className="sticky top-0 bg-onyx-900/90 backdrop-blur-2xl border-b border-pearl-100/8 p-6 sm:p-7 flex items-start justify-between rounded-t-3xl z-10">
              <div>
                <span className="badge-pill mb-3">
                  <Sparkles className="w-3 h-3" strokeWidth={2} />
                  ECO BASALT
                </span>
                <h3 className="h-display text-pearl-100 text-2xl sm:text-3xl">{t(lang, "form.title")}</h3>
              </div>
              <button
                onClick={hide}
                className="w-10 h-10 rounded-full bg-pearl-100/5 border border-pearl-100/10 text-pearl-200 hover:text-pearl-100 hover:bg-pearl-100/10 flex items-center justify-center transition-all"
                aria-label="Close"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-7 lg:p-8 space-y-5">
              <div>
                <label className="text-xs font-semibold text-pearl-300 mb-2 block">
                  {t(lang, "form.name")} *
                </label>
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
                  <label className="text-xs font-semibold text-pearl-300 mb-2 block">
                    {t(lang, "form.phone")} *
                  </label>
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
                  <label className="text-xs font-semibold text-pearl-300 mb-2 block">
                    {t(lang, "form.email")}
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-modern"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-pearl-300 mb-2 block">
                  {t(lang, "form.product")}
                </label>
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
                <label className="text-xs font-semibold text-pearl-300 mb-2 block">
                  {t(lang, "form.message")}
                </label>
                <textarea
                  rows={3}
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

              <p className="text-xs text-pearl-300 text-center mt-4 leading-relaxed">
                {t(lang, "modal.privacy") || "Mutaxassisimiz 24 soat ichida bog'lanadi."}
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
