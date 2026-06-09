"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { api, fetcher, uploadFile } from "@/lib/api";
import AuthLayout from "@/components/AuthLayout";
import { Plus, Edit2, Trash2, X, Save, Upload } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

type Slide = {
  id?: number;
  title_uz: string;
  title_ru: string;
  title_en: string;
  subtitle_uz: string;
  subtitle_ru: string;
  subtitle_en: string;
  cta_text_uz: string;
  cta_text_ru: string;
  cta_text_en: string;
  cta_link: string;
  image: string;
  order: number;
  is_active: boolean;
};

const EMPTY: Slide = {
  title_uz: "", title_ru: "", title_en: "",
  subtitle_uz: "", subtitle_ru: "", subtitle_en: "",
  cta_text_uz: "", cta_text_ru: "", cta_text_en: "",
  cta_link: "#contact", image: "", order: 0, is_active: true,
};

export default function HeroSlidesPage() {
  const { lang } = useLang();
  const { data: slides = [] } = useSWR<Slide[]>("/content/hero-slides", fetcher);
  const [editing, setEditing] = useState<Slide | null>(null);

  async function save() {
    if (!editing) return;
    if (editing.id) {
      await api(`/content/hero-slides/${editing.id}`, { method: "PATCH", body: JSON.stringify(editing) });
    } else {
      await api("/content/hero-slides", { method: "POST", body: JSON.stringify(editing) });
    }
    setEditing(null);
    mutate("/content/hero-slides");
  }

  async function remove(id: number) {
    if (!confirm(t(lang, "hero_slides.confirm_delete"))) return;
    await api(`/content/hero-slides/${id}`, { method: "DELETE" });
    mutate("/content/hero-slides");
  }

  async function move(idx: number, dir: -1 | 1) {
    const a = slides[idx];
    const b = slides[idx + dir];
    if (!a || !b || !a.id || !b.id) return;
    await Promise.all([
      api(`/content/hero-slides/${a.id}`, { method: "PATCH", body: JSON.stringify({ ...a, order: b.order }) }),
      api(`/content/hero-slides/${b.id}`, { method: "PATCH", body: JSON.stringify({ ...b, order: a.order }) }),
    ]);
    mutate("/content/hero-slides");
  }

  return (
    <AuthLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{t(lang, "hero_slides.title")}</h1>
          <button onClick={() => setEditing({ ...EMPTY, order: slides.length })} className="btn btn-primary">
            <Plus className="w-4 h-4" /> {t(lang, "hero_slides.add")}
          </button>
        </div>

        {slides.length === 0 ? (
          <div className="card p-12 text-center text-zinc-500">
            {t(lang, "hero_slides.empty")}
          </div>
        ) : (
          <div className="space-y-3">
            {slides.map((s, i) => (
              <div key={s.id} className="card p-4 flex items-center gap-4">
                {s.image ? (
                  <img src={s.image} alt="" className="w-24 h-16 object-cover rounded shrink-0" />
                ) : (
                  <div className="w-24 h-16 bg-zinc-800 rounded shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{s.title_uz}</div>
                  <div className="text-sm text-zinc-400 truncate">{s.subtitle_uz}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditing(s)}
                    className="p-2 text-blue-400 hover:text-blue-300"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => s.id && remove(s.id)} className="p-2 text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {editing && (
          <SlideModal
            value={editing}
            onChange={setEditing}
            onSave={save}
            onClose={() => setEditing(null)}
          />
        )}
      </div>
    </AuthLayout>
  );
}

function SlideModal({
  value, onChange, onSave, onClose,
}: { value: Slide; onChange: (v: Slide) => void; onSave: () => void; onClose: () => void }) {
  const { lang: uiLang } = useLang();
  const [lang, setLang] = useState<"uz" | "ru" | "en">("uz");
  const [uploading, setUploading] = useState(false);

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadFile(file);
      onChange({ ...value, image: res.url });
    } catch (err) {
      alert(t(uiLang, "common.error") + ": " + (err as Error).message);
    }
    setUploading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="card max-w-2xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl font-semibold">{t(uiLang, "hero_slides.modal_title")}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
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
            <label className="text-sm text-zinc-400 mb-1 block">{t(uiLang, "common.subtitle")} ({lang})</label>
            <textarea
              rows={2}
              className="input"
              value={(value as any)[`subtitle_${lang}`] || ""}
              onChange={(e) => onChange({ ...value, [`subtitle_${lang}`]: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">{t(uiLang, "hero_slides.cta_text")} ({lang})</label>
              <input
                className="input"
                value={(value as any)[`cta_text_${lang}`] || ""}
                onChange={(e) => onChange({ ...value, [`cta_text_${lang}`]: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">{t(uiLang, "hero_slides.cta_link")}</label>
              <input
                className="input"
                value={value.cta_link}
                onChange={(e) => onChange({ ...value, cta_link: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">{t(uiLang, "common.order")}</label>
              <input
                type="number"
                className="input"
                value={value.order}
                onChange={(e) => onChange({ ...value, order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <label className="flex items-center gap-2 mt-7">
              <input
                type="checkbox"
                checked={value.is_active}
                onChange={(e) => onChange({ ...value, is_active: e.target.checked })}
              />
              <span className="text-sm">{t(uiLang, "common.active")}</span>
            </label>
          </div>
          <div>
            <label className="text-sm text-zinc-400 mb-2 block">{t(uiLang, "common.image")}</label>
            <div className="flex items-center gap-3">
              {value.image && <img src={value.image} alt="" className="w-32 h-20 object-cover rounded" />}
              <label className="btn btn-ghost cursor-pointer">
                <Upload className="w-4 h-4" />
                {uploading ? t(uiLang, "common.uploading") : t(uiLang, "common.upload")}
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-6 border-t border-zinc-800">
          <button onClick={onClose} className="btn btn-ghost">
            {t(uiLang, "common.cancel")}
          </button>
          <button onClick={onSave} className="btn btn-primary">
            <Save className="w-4 h-4" /> {t(uiLang, "common.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
