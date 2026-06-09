"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { api, fetcher } from "@/lib/api";
import AuthLayout from "@/components/AuthLayout";
import { Plus, Edit2, Trash2, X, Save, Eye, EyeOff } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

type FAQ = {
  id?: number;
  category?: string;
  question_uz: string; question_ru: string; question_en: string;
  answer_uz: string; answer_ru: string; answer_en: string;
  order: number;
  is_active: boolean;
};

const EMPTY: FAQ = {
  category: "general",
  question_uz: "", question_ru: "", question_en: "",
  answer_uz: "", answer_ru: "", answer_en: "",
  order: 0, is_active: true,
};

const CATEGORIES = ["general", "technical", "pricing", "delivery"];

export default function FAQPage() {
  const { lang } = useLang();
  const { data: faqs = [] } = useSWR<FAQ[]>("/faqs/admin/all", fetcher);
  const [editing, setEditing] = useState<FAQ | null>(null);

  async function save() {
    if (!editing) return;
    if (editing.id) {
      await api(`/faqs/${editing.id}`, { method: "PATCH", body: JSON.stringify(editing) });
    } else {
      await api("/faqs", { method: "POST", body: JSON.stringify(editing) });
    }
    setEditing(null);
    mutate("/faqs/admin/all");
  }

  async function remove(id: number) {
    if (!confirm(t(lang, "faq.confirm_delete"))) return;
    await api(`/faqs/${id}`, { method: "DELETE" });
    mutate("/faqs/admin/all");
  }

  return (
    <AuthLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{t(lang, "faq.title")}</h1>
            <p className="text-slate-400 text-sm mt-1">{t(lang, "faq.subtitle")}</p>
          </div>
          <button onClick={() => setEditing({ ...EMPTY, order: faqs.length })} className="btn btn-primary">
            <Plus className="w-4 h-4" /> {t(lang, "faq.add")}
          </button>
        </div>

        {faqs.length === 0 ? (
          <div className="card p-12 text-center text-slate-500">{t(lang, "faq.empty")}</div>
        ) : (
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={f.id} className="card p-4 flex items-start gap-4">
                <div className="font-mono text-xs text-brand-400 mt-1">{String(i + 1).padStart(2, "0")}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wider bg-slate-800 text-slate-300 px-2 py-0.5 rounded">{f.category}</span>
                    {!f.is_active && <span className="text-[10px] uppercase text-red-400">{t(lang, "common.inactive")}</span>}
                  </div>
                  <div className="font-semibold text-white">{f.question_uz}</div>
                  <div className="text-sm text-slate-400 line-clamp-2 mt-1">{f.answer_uz}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setEditing(f)} className="p-2 text-blue-400 hover:text-blue-300"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => f.id && remove(f.id)} className="p-2 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {editing && <FAQModal value={editing} onChange={setEditing} onSave={save} onClose={() => setEditing(null)} />}
      </div>
    </AuthLayout>
  );
}

function FAQModal({
  value, onChange, onSave, onClose,
}: { value: FAQ; onChange: (v: FAQ) => void; onSave: () => void; onClose: () => void }) {
  const { lang: uiLang } = useLang();
  const [lang, setLang] = useState<"uz" | "ru" | "en">("uz");
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="card max-w-2xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-white">{t(uiLang, "sidebar.faq")}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-1 border-b border-slate-800">
            {(["uz", "ru", "en"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} className={`px-3 py-1.5 text-xs uppercase ${lang === l ? "text-brand-400 border-b-2 border-brand-500" : "text-slate-500"}`}>
                {l}
              </button>
            ))}
          </div>
          <div>
            <label className="label">{t(uiLang, "faq.question")} ({lang}) *</label>
            <textarea rows={2} className="input" value={(value as any)[`question_${lang}`] || ""} onChange={(e) => onChange({ ...value, [`question_${lang}`]: e.target.value })} />
          </div>
          <div>
            <label className="label">{t(uiLang, "faq.answer")} ({lang})</label>
            <textarea rows={5} className="input" value={(value as any)[`answer_${lang}`] || ""} onChange={(e) => onChange({ ...value, [`answer_${lang}`]: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">{t(uiLang, "common.category")}</label>
              <select className="input" value={value.category || ""} onChange={(e) => onChange({ ...value, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
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
