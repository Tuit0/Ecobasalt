"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { api, fetcher } from "@/lib/api";
import AuthLayout from "@/components/AuthLayout";
import { Plus, Edit2, Trash2, X, Save } from "lucide-react";

type CalcProduct = {
  id?: number;
  code: string;
  label_uz: string; label_ru: string; label_en: string;
  base_price: number;
  unit: string;
  thicknesses: number[];
  default_thickness: number;
  order: number;
  is_active: boolean;
};

const EMPTY: CalcProduct = {
  code: "",
  label_uz: "", label_ru: "", label_en: "",
  base_price: 20, unit: "USD/m²",
  thicknesses: [50, 80, 100, 120, 150, 200, 250],
  default_thickness: 100,
  order: 0, is_active: true,
};

export default function CalculatorProductsPage() {
  const { data: items = [] } = useSWR<CalcProduct[]>("/calc/products/admin/all", fetcher);
  const [editing, setEditing] = useState<CalcProduct | null>(null);

  async function save() {
    if (!editing) return;
    if (editing.id) {
      await api(`/calc/products/${editing.id}`, { method: "PATCH", body: JSON.stringify(editing) });
    } else {
      await api("/calc/products", { method: "POST", body: JSON.stringify(editing) });
    }
    setEditing(null);
    mutate("/calc/products/admin/all");
  }

  async function remove(id: number) {
    if (!confirm("Mahsulot o'chirilsinmi?")) return;
    await api(`/calc/products/${id}`, { method: "DELETE" });
    mutate("/calc/products/admin/all");
  }

  return (
    <AuthLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Kalkulyator mahsulotlari</h1>
            <p className="text-slate-400 text-sm mt-1">Narx hisoblagich uchun panel turlari</p>
          </div>
          <button onClick={() => setEditing({ ...EMPTY, order: items.length })} className="btn btn-primary">
            <Plus className="w-4 h-4" /> Yangi mahsulot
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((p) => (
            <div key={p.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs font-mono text-brand-400 mb-1">{p.code}</div>
                  <div className="font-semibold text-white">{p.label_uz}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-brand-400">${p.base_price}</div>
                  <div className="text-xs text-slate-500">{p.unit} · 100mm</div>
                </div>
              </div>
              <div className="text-xs text-slate-400 mb-3">
                Qalinliklar: <span className="font-mono">{p.thicknesses.join(", ")}mm</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                <span className="text-xs text-slate-500">Default: {p.default_thickness}mm</span>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(p)} className="p-1.5 text-blue-400 hover:text-blue-300"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => p.id && remove(p.id)} className="p-1.5 text-red-400 hover:text-red-300"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {editing && <CalcProductModal value={editing} onChange={setEditing} onSave={save} onClose={() => setEditing(null)} />}
      </div>
    </AuthLayout>
  );
}

function CalcProductModal({
  value, onChange, onSave, onClose,
}: { value: CalcProduct; onChange: (v: CalcProduct) => void; onSave: () => void; onClose: () => void }) {
  const [lang, setLang] = useState<"uz" | "ru" | "en">("uz");
  const [thicknessInput, setThicknessInput] = useState(value.thicknesses.join(", "));

  function applyThicknesses() {
    const parsed = thicknessInput.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n) && n > 0).sort((a, b) => a - b);
    onChange({ ...value, thicknesses: parsed });
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="card max-w-2xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-white">Mahsulot</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="label">Kod (slug) *</label>
            <input className="input font-mono" placeholder="wall, roof, fridge..." value={value.code} onChange={(e) => onChange({ ...value, code: e.target.value })} />
          </div>
          <div className="flex gap-1 border-b border-slate-800">
            {(["uz", "ru", "en"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} className={`px-3 py-1.5 text-xs uppercase ${lang === l ? "text-brand-400 border-b-2 border-brand-500" : "text-slate-500"}`}>{l}</button>
            ))}
          </div>
          <div>
            <label className="label">Nomi ({lang}) *</label>
            <input className="input" value={(value as any)[`label_${lang}`] || ""} onChange={(e) => onChange({ ...value, [`label_${lang}`]: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Asosiy narx (100mm uchun) *</label>
              <input type="number" step="0.5" className="input" value={value.base_price} onChange={(e) => onChange({ ...value, base_price: parseFloat(e.target.value) || 0 })} />
            </div>
            <div>
              <label className="label">O'lchov</label>
              <input className="input" placeholder="USD/m²" value={value.unit} onChange={(e) => onChange({ ...value, unit: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Qalinliklar (mm, vergul bilan)</label>
            <div className="flex gap-2">
              <input
                className="input flex-1 font-mono"
                placeholder="50, 80, 100, 120, 150, 200, 250"
                value={thicknessInput}
                onChange={(e) => setThicknessInput(e.target.value)}
                onBlur={applyThicknesses}
              />
              <button onClick={applyThicknesses} className="btn btn-ghost">OK</button>
            </div>
            <p className="text-xs text-slate-500 mt-2">Hozir: <span className="font-mono">{value.thicknesses.join(", ")}</span></p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Standart qalinlik</label>
              <input type="number" className="input" value={value.default_thickness} onChange={(e) => onChange({ ...value, default_thickness: parseInt(e.target.value) || 100 })} />
            </div>
            <div>
              <label className="label">Tartib</label>
              <input type="number" className="input" value={value.order} onChange={(e) => onChange({ ...value, order: parseInt(e.target.value) || 0 })} />
            </div>
            <label className="flex items-center gap-2 mt-7">
              <input type="checkbox" checked={value.is_active} onChange={(e) => onChange({ ...value, is_active: e.target.checked })} />
              <span className="text-sm text-white">Faol</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-6 border-t border-slate-800">
          <button onClick={onClose} className="btn btn-ghost">Bekor qilish</button>
          <button onClick={onSave} className="btn btn-primary"><Save className="w-4 h-4" /> Saqlash</button>
        </div>
      </div>
    </div>
  );
}
