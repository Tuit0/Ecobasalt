"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle2, Loader2 } from "lucide-react";
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

  // Body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Esc bilan yopish
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

  const inputCls =
    "w-full bg-onyx-900 border border-onyx-700 px-4 py-3 text-pearl-100 placeholder-pearl-300/50 focus:border-gold-400 outline-none transition-colors text-base";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-onyx-950/80 backdrop-blur-sm"
          onClick={hide}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-onyx-800 border border-onyx-700 w-full max-w-2xl max-h-[92vh] overflow-y-auto relative"
          >
            {/* Header */}
            <div className="sticky top-0 bg-onyx-800 border-b border-onyx-700 p-6 flex items-start justify-between">
              <div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-gold-400 font-semibold mb-2">
                  ECO BASALT · {t(lang, "form.title").toUpperCase()}
                </div>
                <h3 className="h-display text-pearl-100 text-2xl">{t(lang, "form.title")}</h3>
                <div className="w-12 h-0.5 bg-gold-400 mt-3" />
              </div>
              <button
                onClick={hide}
                className="text-pearl-200 hover:text-gold-400 transition-colors p-1"
                aria-label="Close"
              >
                <X className="w-6 h-6" strokeWidth={1.8} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-5">
              <div>
                <label className="text-[10px] tracking-[0.15em] uppercase text-pearl-300 mb-2 block font-semibold">
                  {t(lang, "form.name")} *
                </label>
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
                  <label className="text-[10px] tracking-[0.15em] uppercase text-pearl-300 mb-2 block font-semibold">
                    {t(lang, "form.phone")} *
                  </label>
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
                  <label className="text-[10px] tracking-[0.15em] uppercase text-pearl-300 mb-2 block font-semibold">
                    {t(lang, "form.email")}
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] tracking-[0.15em] uppercase text-pearl-300 mb-2 block font-semibold">
                  {t(lang, "form.product")}
                </label>
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
                <label className="text-[10px] tracking-[0.15em] uppercase text-pearl-300 mb-2 block font-semibold">
                  {t(lang, "form.message")}
                </label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={inputCls + " resize-none"}
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-solid-gold w-full !flex disabled:opacity-50"
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

              <p className="text-[10px] text-pearl-300 text-center mt-4 leading-relaxed">
                {t(lang, "modal.privacy") || "Mutaxassisimiz 24 soat ichida bog'lanadi."}
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
