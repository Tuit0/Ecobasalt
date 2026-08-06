"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { api, fetcher } from "@/lib/api";
import AuthLayout from "@/components/AuthLayout";
import { Plus, Edit2, Trash2, X, Save } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

type Feature = {
  id?: number;
  key: string;
  icon?: string;
  title_uz: string; title_ru: string; title_en: string;
  description_uz: string; description_ru: string; description_en: string;
  order: number;
  is_active: boolean;
};

const EMPTY: Feature = {
  key: "", icon: "Star",
  title_uz: "", title_ru: "", title_en: "",
  description_uz: "", description_ru: "", description_en: "",
  order: 0, is_active: true,
};

const ICONS = [
  "FlameKindling", "ThermometerSun", "TreePine", "AudioWaveform", "Infinity", "BadgeCheck",
  "Flame", "Leaf", "Shield", "Snowflake", "Volume2", "Hourglass",
  "Sparkles", "Award", "Zap", "Lock", "Globe", "Thermometer", "Star",
];

export default function FeaturesPage() {
  const { lang } = useLang();
  const { data: features = [] } = useSWR<Feature[]>("/features/admin/all", fetcher);
  const [editing, setEditing] = useState<Feature | null>(null);

  async function save() {
    if (!editing) return;
    if (editing.id) {
      await api(`/features/${editing.id}`, { method: "PATCH", body: JSON.stringify(editing) });
    } else {
      await api("/features", { method: "POST", body: JSON.stringify(editing) });
    }
    setEditing(null);
    mutate("/features/admin/all");
  }

  async function remove(id: number) {
    if (!confirm(t(lang, "features.confirm_delete"))) return;
    await api(`/features/${id}`, { method: "DELETE" });
    mutate("/features/admin/all");
  }

  return (
    <AuthLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{t(lang, "features.title")}</h1>
            <p className="text-slate-400 text-sm mt-1">{t(lang, "features.subtitle")}</p>
          </div>
          <button onClick={() => setEditing({ ...EMPTY, order: features.length })} className="btn btn-primary">
            <Plus className="w-4 h-4" /> {t(lang, "common.new")}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f) => (
            <div key={f.id} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-brand-400">{f.icon || "—"}</span>
                {!f.is_active && <span className="text-[10px] uppercase text-red-400">{t(lang, "common.inactive")}</span>}
              </div>
              <div className="font-semibold text-white mb-1">{f.title_uz}</div>
              <div className="text-sm text-slate-400 line-clamp-3 mb-3">{f.description_uz}</div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-500">key: {f.key}</span>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(f)} className="p-1.5 text-blue-400 hover:text-blue-300"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => f.id && remove(f.id)} className="p-1.5 text-red-400 hover:text-red-300"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {editing && <FeatureModal value={editing} onChange={setEditing} onSave={save} onClose={() => setEditing(null)} />}
      </div>
    </AuthLayout>
  );
}

function FeatureModal({
  value, onChange, onSave, onClose,
}: { value: Feature; onChange: (v: Feature) => void; onSave: () => void; onClose: () => void }) {
  const { lang: uiLang } = useLang();
  const [lang, setLang] = useState<"uz" | "ru" | "en">("uz");
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="card max-w-2xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-white">{t(uiLang, "sidebar.features").replace(/lar$/, "")}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">{t(uiLang, "features.key")} *</label>
              <input className="input font-mono" placeholder="fire, eco, ..." value={value.key} onChange={(e) => onChange({ ...value, key: e.target.value })} />
            </div>
            <div>
              <label className="label">{t(uiLang, "features.icon")}</label>
              <select className="input" value={value.icon || ""} onChange={(e) => onChange({ ...value, icon: e.target.value })}>
                {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-1 border-b border-slate-800">
            {(["uz", "ru", "en"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} className={`px-3 py-1.5 text-xs uppercase ${lang === l ? "text-brand-400 border-b-2 border-brand-500" : "text-slate-500"}`}>{l}</button>
            ))}
          </div>
          <div>
            <label className="label">{t(uiLang, "common.title")} ({lang}) *</label>
            <input className="input" value={(value as any)[`title_${lang}`] || ""} onChange={(e) => onChange({ ...value, [`title_${lang}`]: e.target.value })} />
          </div>
          <div>
            <label className="label">{t(uiLang, "common.description")} ({lang})</label>
            <textarea rows={4} className="input" value={(value as any)[`description_${lang}`] || ""} onChange={(e) => onChange({ ...value, [`description_${lang}`]: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">{t(uiLang, "common.order")}</label>
              <input type="number" className="input" value={value.order} onChange={(e) => onChange({ ...value, order: parseInt(e.target.value) || 0 })} />
            </div>
            <label className="flex items-center gap-2 mt-7">
              <input type="checkbox" checked={value.is_active} onChange={(e) => onChange({ ...value, is_active: e.target.checked })} />
              <span className="text-sm text-white">{t(uiLang, "common.active")}</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-6 border-t border-slate-800">
          <button onClick={onClose} className="btn btn-ghost">{t(uiLang, "common.cancel")}</button>
          <button onClick={onSave} className="btn btn-primary"><Save className="w-4 h-4" /> {t(uiLang, "common.save")}</button>
        </div>
      </div>
    </div>
  );
}
