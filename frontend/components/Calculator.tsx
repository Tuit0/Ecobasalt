"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator as CalcIcon, ArrowRight, Plus, X } from "lucide-react";
import { fetcher, pickLang } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { useApplicationModal } from "@/lib/application-modal";

type CalcProduct = {
  id: number;
  code: string;
  label_uz: string; label_ru: string; label_en: string;
  base_price: number;
  unit: string;
  thicknesses: number[];
  default_thickness: number;
};

type CartItem = {
  uid: string;          // unique row id
  productId: number;
  thickness: number;
  area: number;
};

const uid = () => Math.random().toString(36).slice(2, 9);

export default function Calculator() {
  const { lang } = useLang();
  const { show: showModal } = useApplicationModal();
  const { data: products = [], isLoading } = useSWR<CalcProduct[]>("/api/calc/products", fetcher);

  const [cart, setCart] = useState<CartItem[]>([]);

  // First load: seed with one item using first product
  useEffect(() => {
    if (products.length > 0 && cart.length === 0) {
      setCart([{
        uid: uid(),
        productId: products[0].id,
        thickness: products[0].default_thickness,
        area: 500,
      }]);
    }
  }, [products, cart.length]);

  const calcItem = (item: CartItem) => {
    const p = products.find((x) => x.id === item.productId);
    if (!p) return { pricePerM2: 0, subtotal: 0, label: "—", unit: "" };
    const pricePerM2 = p.base_price * (item.thickness / 100);
    return {
      pricePerM2,
      subtotal: pricePerM2 * item.area,
      label: pickLang(p, lang, "label"),
      unit: p.unit,
    };
  };

  const grandTotal = useMemo(
    () => cart.reduce((sum, it) => sum + calcItem(it).subtotal, 0),
    [cart, products, lang]
  );

  const addItem = () => {
    if (products.length === 0) return;
    setCart((c) => [
      ...c,
      {
        uid: uid(),
        productId: products[0].id,
        thickness: products[0].default_thickness,
        area: 200,
      },
    ]);
  };

  const removeItem = (id: string) => setCart((c) => c.filter((x) => x.uid !== id));
  const updateItem = (id: string, patch: Partial<CartItem>) =>
    setCart((c) => c.map((x) => (x.uid === id ? { ...x, ...patch } : x)));

  const submitOrder = () => {
    // Cart'ni qisqacha matn sifatida modal'ga uzatish
    const summary = cart.map((it) => {
      const c = calcItem(it);
      return `${c.label} · ${it.thickness}mm · ${it.area}m² = $${c.subtotal.toFixed(0)}`;
    }).join("\n");
    showModal(undefined, `Calculator estimate:\n${summary}\n\nTotal: $${grandTotal.toFixed(0)}`);
  };

  return (
    <section id="calculator" className="py-16 sm:py-20 lg:py-24 bg-onyx-900 relative overflow-hidden">
      <div className="orb orb-warm w-[600px] h-[600px] -left-40 top-1/4 opacity-50" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left — Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 lg:sticky lg:top-32"
          >
            <span className="badge-pill mb-6">{t(lang, "calc.eyebrow")}</span>
            <h2 className="h-display text-pearl-100 text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-5 sm:mb-6 text-balance">
              {t(lang, "calc.title")}
            </h2>
            <p className="text-pearl-200 text-base sm:text-lg leading-relaxed mb-5">
              {t(lang, "calc.subtitle")}
            </p>
            <p className="text-pearl-300 text-xs">
              {t(lang, "calc.disclaimer")}
            </p>
          </motion.div>

          {/* Right — Cart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-7 feature-card p-5 sm:p-8"
          >
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gold-400 flex items-center justify-center">
                  <CalcIcon className="w-5 h-5 text-pearl-100" strokeWidth={2} />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-gold-400 tracking-[0.2em]">CALCULATOR</div>
                  <div className="h-display text-pearl-100 text-lg sm:text-xl">ECO BASALT</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] tracking-[0.15em] uppercase text-pearl-300 font-semibold">Items</div>
                <div className="h-display text-gold-400 text-xl sm:text-2xl">{cart.length}</div>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                <div className="h-32 bg-onyx-900 animate-pulse" />
                <div className="h-32 bg-onyx-900 animate-pulse" />
              </div>
            ) : (
              <>
                {/* Cart items */}
                <div className="space-y-3 sm:space-y-4 mb-5">
                  <AnimatePresence initial={false}>
                    {cart.map((item, idx) => {
                      const p = products.find((x) => x.id === item.productId);
                      const c = calcItem(item);
                      if (!p) return null;
                      return (
                        <motion.div
                          key={item.uid}
                          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                          animate={{ opacity: 1, height: "auto", marginBottom: undefined }}
                          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-onyx-900/60 backdrop-blur-sm border border-pearl-100/8 rounded-2xl p-4 sm:p-5 relative"
                        >
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-gold-400 tracking-[0.15em] font-semibold">
                                {String(idx + 1).padStart(2, "0")}
                              </span>
                              <span className="text-[10px] tracking-[0.1em] uppercase text-pearl-300 font-semibold">Item</span>
                            </div>
                            {cart.length > 1 && (
                              <button
                                onClick={() => removeItem(item.uid)}
                                className="text-pearl-300 hover:text-gold-400 transition-colors"
                                aria-label="Remove"
                              >
                                <X className="w-4 h-4" strokeWidth={2} />
                              </button>
                            )}
                          </div>

                          {/* Product select */}
                          <div className="mb-4">
                            <label className="text-[10px] tracking-[0.15em] uppercase text-pearl-300 mb-2 block font-semibold">
                              {t(lang, "calc.product")}
                            </label>
                            <select
                              value={item.productId}
                              onChange={(e) => {
                                const newP = products.find((x) => x.id === parseInt(e.target.value));
                                updateItem(item.uid, {
                                  productId: parseInt(e.target.value),
                                  thickness: newP?.default_thickness || item.thickness,
                                });
                              }}
                              className="input-modern !py-2.5 text-sm font-medium"
                            >
                              {products.map((pp) => (
                                <option key={pp.id} value={pp.id} className="bg-onyx-900">
                                  {pickLang(pp, lang, "label")} ({pp.unit})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Thickness */}
                          <div className="mb-4">
                            <div className="flex items-baseline justify-between mb-2">
                              <label className="text-[10px] tracking-[0.15em] uppercase text-pearl-300 font-semibold">
                                {t(lang, "calc.thickness")}
                              </label>
                              <div className="h-display text-xl text-gold-400">
                                {item.thickness}
                                <span className="text-xs text-pearl-300 ml-1">mm</span>
                              </div>
                            </div>
                            <div className="flex gap-px bg-onyx-700 flex-wrap">
                              {p.thicknesses.map((th) => (
                                <button
                                  key={th}
                                  onClick={() => updateItem(item.uid, { thickness: th })}
                                  className={`flex-1 min-w-[44px] py-2 text-xs font-mono transition-all ${
                                    item.thickness === th
                                      ? "bg-gold-400 text-pearl-100 font-bold"
                                      : "bg-onyx-800 text-pearl-300 hover:bg-onyx-700"
                                  }`}
                                >
                                  {th}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Area */}
                          <div className="mb-4">
                            <div className="flex items-baseline justify-between mb-2">
                              <label className="text-[10px] tracking-[0.15em] uppercase text-pearl-300 font-semibold">
                                {t(lang, "calc.area")}
                              </label>
                              <div className="h-display text-xl text-gold-400">
                                {item.area.toLocaleString()}
                                <span className="text-xs text-pearl-300 ml-1">m²</span>
                              </div>
                            </div>
                            <input
                              type="range"
                              min="50"
                              max="10000"
                              step="50"
                              value={item.area}
                              onChange={(e) => updateItem(item.uid, { area: parseInt(e.target.value) })}
                              className="w-full h-1.5 bg-onyx-700 appearance-none cursor-pointer accent-gold-400"
                              style={{
                                background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${((item.area - 50) / 9950) * 100}%, #44403c ${((item.area - 50) / 9950) * 100}%, #44403c 100%)`,
                              }}
                            />
                          </div>

                          {/* Subtotal */}
                          <div className="border-t border-onyx-700 pt-3 flex items-baseline justify-between">
                            <div className="text-[10px] tracking-[0.15em] uppercase text-pearl-300 font-semibold">
                              ${c.pricePerM2.toFixed(1)} {c.unit}
                            </div>
                            <div className="h-display text-xl sm:text-2xl text-pearl-100">
                              ${c.subtotal.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Add item button */}
                <button
                  onClick={addItem}
                  className="w-full border border-dashed border-onyx-700 hover:border-gold-400 py-3 text-pearl-300 hover:text-gold-400 transition-colors text-xs uppercase tracking-[0.15em] font-semibold flex items-center justify-center gap-2 mb-6"
                >
                  <Plus className="w-4 h-4" strokeWidth={2} />
                  {t(lang, "calc.add_item") || "Mahsulot qo'shish"}
                </button>

                {/* Grand total */}
                <div className="bg-gradient-to-br from-gold-400/15 to-gold-400/5 backdrop-blur-sm border-2 border-gold-400/60 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 shadow-2xl shadow-gold-400/10">
                  <div>
                    <div className="text-[10px] tracking-[0.2em] uppercase text-pearl-300 mb-1 font-semibold">
                      {t(lang, "calc.total")}
                    </div>
                    <div className="text-xs text-pearl-300 font-mono">
                      {cart.length} {cart.length === 1 ? "item" : "items"}
                    </div>
                  </div>
                  <div className="h-display text-3xl sm:text-4xl text-gold-400">
                    ${grandTotal.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </div>
                </div>

                {/* CTA */}
                <button onClick={submitOrder} className="btn-solid-gold w-full mt-5 !flex group">
                  {t(lang, "calc.cta")}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
                </button>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
