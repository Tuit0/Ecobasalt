"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { api, fetcher, uploadFile } from "@/lib/api";
import AuthLayout from "@/components/AuthLayout";
import { Plus, Edit2, Trash2, X, Save, Upload } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

type Client = {
  id?: number;
  name: string;
  logo_url?: string;
  website?: string;
  order: number;
  is_active: boolean;
};

const EMPTY: Client = { name: "", logo_url: "", website: "", order: 0, is_active: true };

export default function ClientsPage() {
  const { lang } = useLang();
  const { data: clients = [] } = useSWR<Client[]>("/clients/admin/all", fetcher);
  const [editing, setEditing] = useState<Client | null>(null);

  async function save() {
    if (!editing) return;
    if (editing.id) {
      await api(`/clients/${editing.id}`, { method: "PATCH", body: JSON.stringify(editing) });
    } else {
      await api("/clients", { method: "POST", body: JSON.stringify(editing) });
    }
    setEditing(null);
    mutate("/clients/admin/all");
  }

  async function remove(id: number) {
    if (!confirm(t(lang, "clients.confirm_delete"))) return;
    await api(`/clients/${id}`, { method: "DELETE" });
    mutate("/clients/admin/all");
  }

  return (
    <AuthLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{t(lang, "clients.title")}</h1>
            <p className="text-slate-400 text-sm mt-1">{t(lang, "clients.subtitle")}</p>
          </div>
          <button onClick={() => setEditing({ ...EMPTY, order: clients.length })} className="btn btn-primary">
            <Plus className="w-4 h-4" /> {t(lang, "clients.add")}
          </button>
        </div>

        {clients.length === 0 ? (
          <div className="card p-12 text-center text-slate-500">{t(lang, "clients.empty")}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {clients.map((c) => (
              <div key={c.id} className="card p-5 flex flex-col items-center justify-between gap-3">
                <div className="h-14 flex items-center justify-center">
                  {c.logo_url ? (
                    <img src={c.logo_url} alt={c.name} className="max-h-14 object-contain" />
                  ) : (
                    <span className="text-white font-bold tracking-wider">{c.name}</span>
                  )}
                </div>
                <div className="text-xs text-slate-500 truncate w-full text-center">{c.name}</div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(c)} className="p-1.5 text-blue-400 hover:text-blue-300">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => c.id && remove(c.id)} className="p-1.5 text-red-400 hover:text-red-300">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {editing && <ClientModal value={editing} onChange={setEditing} onSave={save} onClose={() => setEditing(null)} />}
      </div>
    </AuthLayout>
  );
}

function ClientModal({
  value, onChange, onSave, onClose,
}: { value: Client; onChange: (v: Client) => void; onSave: () => void; onClose: () => void }) {
  const { lang } = useLang();
  const [uploading, setUploading] = useState(false);

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadFile(file);
      onChange({ ...value, logo_url: res.url });
    } catch (err) { alert((err as Error).message); }
    setUploading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="card max-w-lg w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-white">{t(lang, "sidebar.clients").replace(/s$/, "")}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="label">{t(lang, "common.name")} *</label>
            <input className="input" value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} />
          </div>
          <div>
            <label className="label">{t(lang, "common.website")}</label>
            <input className="input" placeholder="https://..." value={value.website || ""} onChange={(e) => onChange({ ...value, website: e.target.value })} />
          </div>
          <div>
            <label className="label">{t(lang, "common.logo")}</label>
            <div className="flex items-center gap-3">
              {value.logo_url && <img src={value.logo_url} alt="" className="w-24 h-14 object-contain bg-slate-800 rounded p-1" />}
              <label className="btn btn-ghost cursor-pointer">
                <Upload className="w-4 h-4" />
                {uploading ? t(lang, "common.uploading") : t(lang, "common.upload")}
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
            </div>
            <p className="text-xs text-slate-500 mt-2">{t(lang, "clients.no_logo_hint")}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">{t(lang, "common.order")}</label>
              <input type="number" className="input" value={value.order} onChange={(e) => onChange({ ...value, order: parseInt(e.target.value) || 0 })} />
            </div>
            <label className="flex items-center gap-2 mt-7">
              <input type="checkbox" checked={value.is_active} onChange={(e) => onChange({ ...value, is_active: e.target.checked })} />
              <span className="text-sm text-white">{t(lang, "common.active")}</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-6 border-t border-slate-800">
          <button onClick={onClose} className="btn btn-ghost">{t(lang, "common.cancel")}</button>
          <button onClick={onSave} className="btn btn-primary"><Save className="w-4 h-4" /> {t(lang, "common.save")}</button>
        </div>
      </div>
    </div>
  );
}
