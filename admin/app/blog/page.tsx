"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { api, fetcher, uploadFile } from "@/lib/api";
import AuthLayout from "@/components/AuthLayout";
import { Plus, Edit2, Trash2, X, Save, Upload, Eye, EyeOff, Star } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

type Post = {
  id?: number;
  slug: string;
  category?: string;
  cover_image?: string;
  title_uz: string; title_ru: string; title_en: string;
  excerpt_uz: string; excerpt_ru: string; excerpt_en: string;
  body_uz: string; body_ru: string; body_en: string;
  min_read: number;
  published_at?: string;
  is_featured: boolean;
  is_published: boolean;
  views?: number;
};

const EMPTY: Post = {
  slug: "", category: "tech", cover_image: "",
  title_uz: "", title_ru: "", title_en: "",
  excerpt_uz: "", excerpt_ru: "", excerpt_en: "",
  body_uz: "", body_ru: "", body_en: "",
  min_read: 5, is_featured: false, is_published: true,
};

const CATEGORIES = ["tech", "industry", "project", "eco"];

export default function BlogPage() {
  const { lang } = useLang();
  const { data: posts = [] } = useSWR<Post[]>("/blog/admin/all", fetcher);
  const [editing, setEditing] = useState<Post | null>(null);

  async function save() {
    if (!editing) return;
    const payload = { ...editing };
    if (payload.published_at === "") payload.published_at = undefined;
    if (editing.id) {
      await api(`/blog/${editing.id}`, { method: "PATCH", body: JSON.stringify(payload) });
    } else {
      await api("/blog", { method: "POST", body: JSON.stringify(payload) });
    }
    setEditing(null);
    mutate("/blog/admin/all");
  }

  async function remove(id: number) {
    if (!confirm(t(lang, "blog.confirm_delete"))) return;
    await api(`/blog/${id}`, { method: "DELETE" });
    mutate("/blog/admin/all");
  }

  return (
    <AuthLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{t(lang, "blog.title")}</h1>
            <p className="text-slate-400 text-sm mt-1">{t(lang, "blog.subtitle")}</p>
          </div>
          <button onClick={() => setEditing({ ...EMPTY })} className="btn btn-primary">
            <Plus className="w-4 h-4" /> {t(lang, "blog.add")}
          </button>
        </div>

        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="card p-4 flex items-center gap-4">
              {p.cover_image ? (
                <img src={p.cover_image} alt="" className="w-24 h-16 object-cover rounded shrink-0" />
              ) : (
                <div className="w-24 h-16 bg-slate-800 rounded shrink-0 flex items-center justify-center text-slate-600 text-xs">{t(lang, "blog.no_image")}</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-wider bg-slate-800 text-slate-300 px-2 py-0.5 rounded">{p.category}</span>
                  {p.is_featured && <Star className="w-3 h-3 text-brand-400 fill-current" />}
                  {!p.is_published && <span className="text-[10px] uppercase text-yellow-400">{t(lang, "blog.draft")}</span>}
                  <span className="text-[10px] text-slate-500 font-mono">/{p.slug}</span>
                </div>
                <div className="font-semibold text-white truncate">{p.title_uz}</div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>{p.published_at || "—"}</span>
                  <span>·</span>
                  <span>{p.min_read} {t(lang, "blog.min_unit")}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {p.views || 0}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setEditing(p)} className="p-2 text-blue-400 hover:text-blue-300"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => p.id && remove(p.id)} className="p-2 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {posts.length === 0 && <div className="card p-12 text-center text-slate-500">{t(lang, "blog.empty")}</div>}
        </div>

        {editing && <PostModal value={editing} onChange={setEditing} onSave={save} onClose={() => setEditing(null)} />}
      </div>
    </AuthLayout>
  );
}

function PostModal({
  value, onChange, onSave, onClose,
}: { value: Post; onChange: (v: Post) => void; onSave: () => void; onClose: () => void }) {
  const { lang: uiLang } = useLang();
  const [lang, setLang] = useState<"uz" | "ru" | "en">("uz");
  const [uploading, setUploading] = useState(false);

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadFile(file);
      onChange({ ...value, cover_image: res.url });
    } catch (err) { alert((err as Error).message); }
    setUploading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="card max-w-3xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-white">{t(uiLang, "sidebar.blog")}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="label">{t(uiLang, "common.slug")} *</label>
              <input className="input font-mono" placeholder="fire-resistance-ei-240" value={value.slug} onChange={(e) => onChange({ ...value, slug: e.target.value })} />
            </div>
            <div>
              <label className="label">{t(uiLang, "common.category")}</label>
              <select className="input" value={value.category || "tech"} onChange={(e) => onChange({ ...value, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
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
            <label className="label">{t(uiLang, "blog.excerpt")} ({lang})</label>
            <textarea rows={2} className="input" value={(value as any)[`excerpt_${lang}`] || ""} onChange={(e) => onChange({ ...value, [`excerpt_${lang}`]: e.target.value })} />
          </div>
          <div>
            <label className="label">{t(uiLang, "blog.body")} ({lang}) — {t(uiLang, "blog.markdown_hint")}</label>
            <textarea rows={10} className="input font-mono text-sm" value={(value as any)[`body_${lang}`] || ""} onChange={(e) => onChange({ ...value, [`body_${lang}`]: e.target.value })} />
          </div>

          <div>
            <label className="label">{t(uiLang, "products.cover_image")}</label>
            <div className="flex items-center gap-3">
              {value.cover_image && <img src={value.cover_image} alt="" className="w-32 h-20 object-cover rounded" />}
              <label className="btn btn-ghost cursor-pointer">
                <Upload className="w-4 h-4" />
                {uploading ? t(uiLang, "common.uploading") : t(uiLang, "common.upload")}
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
              {value.cover_image && (
                <button onClick={() => onChange({ ...value, cover_image: "" })} className="text-xs text-red-400 hover:text-red-300">{t(uiLang, "common.delete")}</button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="label">{t(uiLang, "blog.min_read")}</label>
              <input type="number" className="input" value={value.min_read} onChange={(e) => onChange({ ...value, min_read: parseInt(e.target.value) || 5 })} />
            </div>
            <div>
              <label className="label">{t(uiLang, "blog.publish_date")}</label>
              <input type="date" className="input" value={value.published_at || ""} onChange={(e) => onChange({ ...value, published_at: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 mt-7">
              <input type="checkbox" checked={value.is_featured} onChange={(e) => onChange({ ...value, is_featured: e.target.checked })} />
              <span className="text-sm text-white">{t(uiLang, "blog.featured")}</span>
            </label>
            <label className="flex items-center gap-2 mt-7">
              <input type="checkbox" checked={value.is_published} onChange={(e) => onChange({ ...value, is_published: e.target.checked })} />
              <span className="text-sm text-white">{t(uiLang, "blog.published")}</span>
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
