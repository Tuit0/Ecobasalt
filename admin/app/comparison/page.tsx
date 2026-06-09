"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { api, fetcher } from "@/lib/api";
import AuthLayout from "@/components/AuthLayout";
import { Plus, Edit2, Trash2, X, Save, Check, Minus as MinusIcon } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

type CellType = "good" | "neutral" | "bad";

type Row = {
  id?: number;
  feature_uz: string; feature_ru: string; feature_en: string;
  basalt_value_uz: string; basalt_value_ru: string; basalt_value_en: string; basalt_type: CellType;
  pir_value_uz: string; pir_value_ru: string; pir_value_en: string; pir_type: CellType;
  pur_value_uz: string; pur_value_ru: string; pur_value_en: string; pur_type: CellType;
  eps_value_uz: string; eps_value_ru: string; eps_value_en: string; eps_type: CellType;
  order: number;
  is_active: boolean;
};

const EMPTY: Row = {
  feature_uz: "", feature_ru: "", feature_en: "",
  basalt_value_uz: "", basalt_value_ru: "", basalt_value_en: "", basalt_type: "good",
  pir_value_uz: "", pir_value_ru: "", pir_value_en: "", pir_type: "neutral",
  pur_value_uz: "", pur_value_ru: "", pur_value_en: "", pur_type: "neutral",
  eps_value_uz: "", eps_value_ru: "", eps_value_en: "", eps_type: "bad",
  order: 0, is_active: true,
};

export default function ComparisonPage() {
  const { lang } = useLang();
  const { data: rows = [] } = useSWR<Row[]>("/comparison/rows/admin/all", fetcher);
  const [editing, setEditing] = useState<Row | null>(null);

  const TYPE_OPTIONS: { val: CellType; label: string; color: string }[] = [
    { val: "good", label: t(lang, "comparison.type_good"), color: "text-green-400" },
    { val: "neutral", label: t(lang, "comparison.type_neutral"), color: "text-slate-400" },
    { val: "bad", label: t(lang, "comparison.type_bad"), color: "text-red-400" },
  ];

  async function save() {
    if (!editing) return;
    if (editing.id) {
      await api(`/comparison/rows/${editing.id}`, { method: "PATCH", body: JSON.stringify(editing) });
    } else {
      await api("/comparison/rows", { method: "POST", body: JSON.stringify(editing) });
    }
    setEditing(null);
    mutate("/comparison/rows/admin/all");
  }

  async function remove(id: number) {
    if (!confirm(t(lang, "comparison.confirm_delete"))) return;
    await api(`/comparison/rows/${id}`, { method: "DELETE" });
    mutate("/comparison/rows/admin/all");
  }

  function TypeIcon({ type }: { type: CellType }) {
    if (type === "good") return <Check className="w-3 h-3 text-green-400" />;
    if (type === "bad") return <X className="w-3 h-3 text-red-400" />;
    return <MinusIcon className="w-3 h-3 text-slate-400" />;
  }

  return (
    <AuthLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{t(lang, "comparison.title")}</h1>
            <p className="text-slate-400 text-sm mt-1">{t(lang, "comparison.subtitle")}</p>
          </div>
          <button onClick={() => setEditing({ ...EMPTY, order: rows.length })} className="btn btn-primary">
            <Plus className="w-4 h-4" /> {t(lang, "comparison.add")}
          </button>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left p-3 text-xs uppercase text-slate-400">{t(lang, "comparison.feature")}</th>
                <th className="p-3 text-xs uppercase text-brand-400">Bazalt</th>
                <th className="p-3 text-xs uppercase text-slate-400">PIR</th>
                <th className="p-3 text-xs uppercase text-slate-400">PUR</th>
                <th className="p-3 text-xs uppercase text-slate-400">EPS</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-slate-800 last:border-b-0">
                  <td className="p-3 font-medium text-white">{r.feature_uz}</td>
                  <td className="p-3 text-center"><div className="flex items-center justify-center gap-1.5 text-white text-sm"><TypeIcon type={r.basalt_type} />{r.basalt_value_uz}</div></td>
                  <td className="p-3 text-center"><div className="flex items-center justify-center gap-1.5 text-white text-sm"><TypeIcon type={r.pir_type} />{r.pir_value_uz}</div></td>
                  <td className="p-3 text-center"><div className="flex items-center justify-center gap-1.5 text-white text-sm"><TypeIcon type={r.pur_type} />{r.pur_value_uz}</div></td>
                  <td className="p-3 text-center"><div className="flex items-center justify-center gap-1.5 text-white text-sm"><TypeIcon type={r.eps_type} />{r.eps_value_uz}</div></td>
                  <td className="p-3 text-right">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => setEditing(r)} className="p-1.5 text-blue-400 hover:text-blue-300"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => r.id && remove(r.id)} className="p-1.5 text-red-400 hover:text-red-300"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={6} className="p-12 text-center text-slate-500">{t(lang, "comparison.empty")}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {editing && <RowModal value={editing} onChange={setEditing} onSave={save} onClose={() => setEditing(null)} typeOptions={TYPE_OPTIONS} />}
      </div>
    </AuthLayout>
  );
}

function RowModal({
  value, onChange, onSave, onClose, typeOptions,
}: { value: Row; onChange: (v: Row) => void; onSave: () => void; onClose: () => void; typeOptions: { val: CellType; label: string; color: string }[] }) {
  const { lang: uiLang } = useLang();
  const [lang, setLang] = useState<"uz" | "ru" | "en">("uz");

  const ColumnEditor = ({ col, label }: { col: "basalt" | "pir" | "pur" | "eps"; label: string }) => (
    <div className="bg-slate-950 border border-slate-800 p-4 rounded">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-white text-sm">{label}</div>
      </div>
      <input
        className="input mb-2"
        placeholder={`${t(uiLang, "comparison.value")} (${lang})`}
        value={(value as any)[`${col}_value_${lang}`] || ""}
        onChange={(e) => onChange({ ...value, [`${col}_value_${lang}`]: e.target.value })}
      />
      <select
        className="input text-sm"
        value={(value as any)[`${col}_type`]}
        onChange={(e) => onChange({ ...value, [`${col}_type`]: e.target.value as CellType })}
      >
        {typeOptions.map((tp) => <option key={tp.val} value={tp.val}>{tp.label}</option>)}
      </select>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="card max-w-4xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-white">{t(uiLang, "comparison.row_title")}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-1 border-b border-slate-800">
            {(["uz", "ru", "en"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} className={`px-3 py-1.5 text-xs uppercase ${lang === l ? "text-brand-400 border-b-2 border-brand-500" : "text-slate-500"}`}>{l}</button>
            ))}
          </div>
          <div>
            <label className="label">{t(uiLang, "comparison.feature_name")} ({lang}) *</label>
            <input className="input" value={(value as any)[`feature_${lang}`] || ""} onChange={(e) => onChange({ ...value, [`feature_${lang}`]: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <ColumnEditor col="basalt" label="🏆 BAZALT" />
            <ColumnEditor col="pir" label="PIR" />
            <ColumnEditor col="pur" label="PUR" />
            <ColumnEditor col="eps" label="EPS" />
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
