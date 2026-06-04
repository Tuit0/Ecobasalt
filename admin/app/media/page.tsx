"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { api, fetcher, uploadFile } from "@/lib/api";
import AuthLayout from "@/components/AuthLayout";
import { Upload, Trash2, Copy, Check, Image as ImageIcon } from "lucide-react";

type MediaItem = {
  filename: string;
  url: string;
  size: number;
};

export default function MediaPage() {
  const { data: items = [] } = useSWR<MediaItem[]>("/media/list", fetcher);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadFile(file);
      }
      mutate("/media/list");
    } catch (err) {
      alert("Yuklashda xatolik: " + (err as Error).message);
    }
    setUploading(false);
    e.target.value = "";
  }

  async function remove(filename: string) {
    if (!confirm("Faylni o'chirishni tasdiqlaysizmi?")) return;
    await api(`/media/${filename}`, { method: "DELETE" });
    mutate("/media/list");
  }

  function copy(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  }

  function fmtSize(b: number) {
    if (b < 1024) return b + " B";
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
    return (b / 1024 / 1024).toFixed(1) + " MB";
  }

  function isImage(filename: string) {
    return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(filename);
  }

  return (
    <AuthLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Media galereya</h1>
          <label className="btn btn-primary cursor-pointer">
            <Upload className="w-4 h-4" />
            {uploading ? "Yuklanmoqda..." : "Fayl yuklash"}
            <input type="file" multiple accept="image/*,video/*,.pdf" className="hidden" onChange={handleUpload} />
          </label>
        </div>

        {items.length === 0 ? (
          <div className="card p-12 text-center text-zinc-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            Fayllar yo'q. Yuklash uchun tugmani bosing.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {items.map((m) => {
              const img = isImage(m.filename);
              return (
                <div key={m.filename} className="card overflow-hidden group">
                  <div className="aspect-square bg-zinc-900 flex items-center justify-center relative">
                    {img ? (
                      <img src={m.url} alt={m.filename} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-zinc-500 text-xs p-3 text-center">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                        {m.filename.split(".").pop()?.toUpperCase()}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => copy(m.url)}
                        className="p-2 rounded bg-orange-500 text-white hover:bg-orange-600"
                        title="URL ko'chirish"
                      >
                        {copied === m.url ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => remove(m.filename)}
                        className="p-2 rounded bg-red-500 text-white hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="text-xs text-zinc-300 truncate" title={m.filename}>
                      {m.filename}
                    </div>
                    <div className="text-xs text-zinc-500">{fmtSize(m.size)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
