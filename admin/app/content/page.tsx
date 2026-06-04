"use client";

import { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { Save, Loader2, Edit2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { fetcher, api } from "@/lib/api";

type Block = { id: number; key: string; section: string; block_type: string; value: any };

export default function ContentPage() {
  return <AuthLayout><ContentInner /></AuthLayout>;
}

function ContentInner() {
  const { data: blocks = [] } = useSWR<Block[]>("/content/blocks", fetcher);
  const [editing, setEditing] = useState<Block | null>(null);

  const grouped = blocks.reduce((acc: Record<string, Block[]>, b) => {
    (acc[b.section] = acc[b.section] || []).push(b);
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Sayt kontenti</h1>
        <p className="text-slate-400 mt-1">Saytdagi har bir matnni shu yerdan tahrirlash mumkin</p>
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([section, items]) => (
          <div key={section} className="card p-5">
            <h2 className="text-lg font-semibold text-white mb-1 capitalize">{section}</h2>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">{items.length} ta blok</p>
            <div className="space-y-2">
              {items.map((b) => (
                <div key={b.id} className="bg-slate-950 rounded-lg p-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono text-brand-400 mb-1">{b.key}</div>
                    <div className="text-slate-300 text-sm">
                      <BlockPreview value={b.value} />
                    </div>
                  </div>
                  <button onClick={() => setEditing(b)} className="btn-secondary !py-1.5 !px-3 flex-shrink-0">
                    <Edit2 className="w-3.5 h-3.5" />
                    Tahrirlash
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {editing && <EditModal block={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function BlockPreview({ value }: { value: any }) {
  if (value == null) return <span className="text-slate-600 italic">—</span>;
  if (typeof value === "string") return <>{value.length > 200 ? value.slice(0, 200) + "..." : value}</>;
  if (typeof value === "number") return <>{value}</>;
  if (typeof value === "object" && (value.uz || value.ru || value.en)) {
    return <span className="text-slate-400 text-xs">UZ: {(value.uz || "").slice(0, 80)} | RU: {(value.ru || "").slice(0, 80)} | EN: {(value.en || "").slice(0, 80)}</span>;
  }
  return <span className="text-slate-500 font-mono text-xs">{JSON.stringify(value).slice(0, 200)}</span>;
}

function EditModal({ block, onClose }: { block: Block; onClose: () => void }) {
  const [value, setValue] = useState<any>(block.value);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setValue(block.value); }, [block]);

  const isMultilang = block.block_type === "multilang" || (block.value && typeof block.value === "object" && (block.value.uz != null || block.value.ru != null || block.value.en != null));

  const save = async () => {
    setSaving(true);
    try {
      await api(`/content/blocks/${block.key}`, {
        method: "PATCH",
        body: JSON.stringify({ value }),
      });
      mutate("/content/blocks");
      onClose();
    } catch (e) {
      alert("Xatolik: " + (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-800">
          <div className="text-xs font-mono text-brand-400">{block.key}</div>
          <h3 className="text-xl font-semibold text-white mt-1">Tahrirlash</h3>
          <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{block.section} · {block.block_type}</div>
        </div>
        <div className="p-6 space-y-4">
          {isMultilang ? (
            <>
              {(["uz", "ru", "en"] as const).map((l) => (
                <div key={l}>
                  <label className="label">{l.toUpperCase()}</label>
                  <textarea
                    rows={3}
                    className="input resize-y"
                    value={value?.[l] || ""}
                    onChange={(e) => setValue({ ...value, [l]: e.target.value })}
                  />
                </div>
              ))}
            </>
          ) : block.block_type === "number" ? (
            <div>
              <label className="label">Qiymat (raqam)</label>
              <input type="number" className="input" value={value || 0} onChange={(e) => setValue(parseFloat(e.target.value))} />
            </div>
          ) : block.block_type === "json" || (value && typeof value === "object") ? (
            <div>
              <label className="label">JSON qiymati</label>
              <textarea
                rows={10}
                className="input font-mono text-sm resize-y"
                value={JSON.stringify(value, null, 2)}
                onChange={(e) => {
                  try { setValue(JSON.parse(e.target.value)); } catch {}
                }}
              />
            </div>
          ) : (
            <div>
              <label className="label">Matn</label>
              <textarea rows={5} className="input resize-y" value={value || ""} onChange={(e) => setValue(e.target.value)} />
            </div>
          )}
        </div>
        <div className="p-6 border-t border-slate-800 flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary">Bekor qilish</button>
          <button onClick={save} disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}
