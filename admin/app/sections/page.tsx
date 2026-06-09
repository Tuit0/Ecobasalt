"use client";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { api, fetcher } from "@/lib/api";
import AuthLayout from "@/components/AuthLayout";
import { Save, Eye, EyeOff, Layers } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

type Visibility = Record<string, boolean>;

const SECTIONS: { key: string; labelKey: string; descKey: string }[] = [
  { key: "trustbar", labelKey: "sections.trustbar.label", descKey: "sections.trustbar.desc" },
  { key: "stats", labelKey: "sections.stats.label", descKey: "sections.stats.desc" },
  { key: "about", labelKey: "sections.about.label", descKey: "sections.about.desc" },
  { key: "industries", labelKey: "sections.industries.label", descKey: "sections.industries.desc" },
  { key: "process", labelKey: "sections.process.label", descKey: "sections.process.desc" },
  { key: "comparison", labelKey: "sections.comparison.label", descKey: "sections.comparison.desc" },
  { key: "products", labelKey: "sections.products.label", descKey: "sections.products.desc" },
  { key: "projects", labelKey: "sections.projects.label", descKey: "sections.projects.desc" },
  { key: "features", labelKey: "sections.features.label", descKey: "sections.features.desc" },
  { key: "faq", labelKey: "sections.faq.label", descKey: "sections.faq.desc" },
  { key: "testimonials", labelKey: "sections.testimonials.label", descKey: "sections.testimonials.desc" },
  { key: "newsletter", labelKey: "sections.newsletter.label", descKey: "sections.newsletter.desc" },
  { key: "blog", labelKey: "sections.blog.label", descKey: "sections.blog.desc" },
  { key: "final_cta", labelKey: "sections.final_cta.label", descKey: "sections.final_cta.desc" },
];

export default function SectionsPage() {
  const { lang } = useLang();
  const { data } = useSWR<Visibility>("/sections/visibility", fetcher);
  const [local, setLocal] = useState<Visibility>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setLocal(data);
  }, [data]);

  function toggle(key: string) {
    setLocal((p) => ({ ...p, [key]: !(p[key] !== false) }));
  }

  async function saveAll() {
    setSaving(true);
    try {
      await api("/sections/visibility", {
        method: "PATCH",
        body: JSON.stringify({ sections: local }),
      });
      mutate("/sections/visibility");
    } catch (err) {
      alert(t(lang, "common.error") + ": " + (err as Error).message);
    }
    setSaving(false);
  }

  const dirty = data && Object.keys(local).some((k) => (local[k] !== false) !== (data[k] !== false));

  return (
    <AuthLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{t(lang, "sections.title")}</h1>
            <p className="text-slate-400 text-sm mt-1">{t(lang, "sections.subtitle")}</p>
          </div>
          <button
            onClick={saveAll}
            disabled={saving || !dirty}
            className={`btn ${dirty ? "btn-primary" : "btn-ghost"}`}
          >
            <Save className="w-4 h-4" />
            {saving ? t(lang, "common.loading") : t(lang, "common.save")}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SECTIONS.map((s) => {
            const visible = local[s.key] !== false;
            return (
              <button
                key={s.key}
                onClick={() => toggle(s.key)}
                className={`card p-5 text-left transition-all border-2 ${
                  visible
                    ? "border-brand-500/30 hover:border-brand-500/60"
                    : "border-slate-800 opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Layers className="w-4 h-4 text-brand-400" />
                      <span className="font-semibold text-white">{t(lang, s.labelKey)}</span>
                    </div>
                    <div className="text-xs text-slate-400 mb-2">{t(lang, s.descKey)}</div>
                    <code className="text-[10px] text-slate-500 font-mono">section.{s.key}.visible</code>
                  </div>
                  <div className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                    visible
                      ? "bg-green-500/20 text-green-400 border border-green-500/40"
                      : "bg-red-500/20 text-red-400 border border-red-500/40"
                  }`}>
                    {visible ? (
                      <>
                        <Eye className="w-3 h-3" /> {t(lang, "sections.shown")}
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" /> {t(lang, "sections.hidden")}
                      </>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-slate-500 mt-6">{t(lang, "sections.note")}</p>
      </div>
    </AuthLayout>
  );
}
