"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { api, fetcher, uploadFile } from "@/lib/api";
import AuthLayout from "@/components/AuthLayout";
import { Plus, Edit2, Trash2, X, Save, Upload, MapPin, Calendar } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

type Project = {
  id?: number;
  title_uz: string;
  title_ru: string;
  title_en: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  location: string;
  year: number;
  area_m2: number;
  cover_image: string;
  gallery: string[];
  is_featured: boolean;
  is_active: boolean;
  order: number;
};

const EMPTY: Project = {
  title_uz: "", title_ru: "", title_en: "",
  description_uz: "", description_ru: "", description_en: "",
  location: "", year: new Date().getFullYear(), area_m2: 0,
  cover_image: "", gallery: [],
  is_featured: false, is_active: true, order: 0,
};

export default function ProjectsPage() {
  const { lang } = useLang();
  const { data: projects = [] } = useSWR<Project[]>("/content/projects", fetcher);
  const [editing, setEditing] = useState<Project | null>(null);

  async function save() {
    if (!editing) return;
    const payload = { ...editing, gallery: editing.gallery || [] };
    if (editing.id) {
      await api(`/content/projects/${editing.id}`, { method: "PATCH", body: JSON.stringify(payload) });
    } else {
      await api("/content/projects", { method: "POST", body: JSON.stringify(payload) });
    }
    setEditing(null);
    mutate("/content/projects");
  }

  async function remove(id: number) {
    if (!confirm(t(lang, "projects.confirm_delete"))) return;
    await api(`/content/projects/${id}`, { method: "DELETE" });
    mutate("/content/projects");
  }

  return (
    <AuthLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{t(lang, "projects.title")}</h1>
          <button onClick={() => setEditing({ ...EMPTY })} className="btn btn-primary">
            <Plus className="w-4 h-4" /> {t(lang, "projects.add")}
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="card p-12 text-center text-zinc-500">{t(lang, "projects.empty")}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <div key={p.id} className="card overflow-hidden">
                {p.cover_image ? (
                  <img src={p.cover_image} alt={p.title_uz} className="w-full h-44 object-cover" />
                ) : (
                  <div className="w-full h-44 bg-zinc-800" />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{p.title_uz}</h3>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 mb-3">
                    {p.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {p.location}
                      </span>
                    )}
                    {p.year > 0 && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {p.year}
                      </span>
                    )}
                    {p.area_m2 > 0 && <span>{p.area_m2} m²</span>}
                  </div>
                  <p className="text-sm text-zinc-400 line-clamp-2 mb-3">{p.description_uz}</p>
                  <div className="flex items-center gap-2 mb-3">
                    {p.is_featured && (
                      <span className="text-xs px-2 py-0.5 rounded bg-orange-500/20 text-orange-400">{t(lang, "common.featured")}</span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      p.is_active ? "bg-green-500/20 text-green-400" : "bg-zinc-700 text-zinc-400"
                    }`}>
                      {p.is_active ? t(lang, "common.active") : t(lang, "common.inactive")}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(p)} className="btn btn-ghost text-sm flex-1">
                      <Edit2 className="w-3 h-3" /> {t(lang, "common.edit")}
                    </button>
                    <button onClick={() => p.id && remove(p.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {editing && (
          <ProjectModal value={editing} onChange={setEditing} onSave={save} onClose={() => setEditing(null)} />
        )}
      </div>
    </AuthLayout>
  );
}

function ProjectModal({
  value, onChange, onSave, onClose,
}: { value: Project; onChange: (v: Project) => void; onSave: () => void; onClose: () => void }) {
  const { lang: uiLang } = useLang();
  const [uploading, setUploading] = useState(false);
  const [lang, setLang] = useState<"uz" | "ru" | "en">("uz");

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadFile(file);
      onChange({ ...value, cover_image: res.url });
    } catch (err) {
      alert(t(uiLang, "common.error") + ": " + (err as Error).message);
    }
    setUploading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="card max-w-2xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl font-semibold">{value.id ? t(uiLang, "common.edit") : t(uiLang, "projects.add")}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="flex gap-1 border-b border-zinc-800">
            {(["uz", "ru", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 text-xs uppercase ${
                  lang === l ? "text-orange-400 border-b-2 border-orange-500" : "text-zinc-500"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">{t(uiLang, "common.title")} ({lang})</label>
            <input
              className="input"
              value={(value as any)[`title_${lang}`] || ""}
              onChange={(e) => onChange({ ...value, [`title_${lang}`]: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">{t(uiLang, "common.description")} ({lang})</label>
            <textarea
              rows={4}
              className="input"
              value={(value as any)[`description_${lang}`] || ""}
              onChange={(e) => onChange({ ...value, [`description_${lang}`]: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">{t(uiLang, "projects.location")}</label>
              <input className="input" value={value.location} onChange={(e) => onChange({ ...value, location: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">{t(uiLang, "projects.year")}</label>
              <input
                type="number"
                className="input"
                value={value.year}
                onChange={(e) => onChange({ ...value, year: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">{t(uiLang, "projects.area")}</label>
              <input
                type="number"
                className="input"
                value={value.area_m2}
                onChange={(e) => onChange({ ...value, area_m2: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-zinc-400 mb-2 block">{t(uiLang, "products.cover_image")}</label>
            <div className="flex items-center gap-3">
              {value.cover_image && <img src={value.cover_image} alt="" className="w-24 h-24 object-cover rounded" />}
              <label className="btn btn-ghost cursor-pointer">
                <Upload className="w-4 h-4" />
                {uploading ? t(uiLang, "common.uploading") : t(uiLang, "common.upload")}
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
              {value.cover_image && (
                <button onClick={() => onChange({ ...value, cover_image: "" })} className="text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!value.is_featured} onChange={(e) => onChange({ ...value, is_featured: e.target.checked })} />
              <span className="text-sm">{t(uiLang, "common.featured")}</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!value.is_active} onChange={(e) => onChange({ ...value, is_active: e.target.checked })} />
              <span className="text-sm">{t(uiLang, "common.active")}</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-6 border-t border-zinc-800">
          <button onClick={onClose} className="btn btn-ghost">{t(uiLang, "common.cancel")}</button>
          <button onClick={onSave} className="btn btn-primary">
            <Save className="w-4 h-4" /> {t(uiLang, "common.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
