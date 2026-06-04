"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { api, fetcher } from "@/lib/api";
import AuthLayout from "@/components/AuthLayout";
import { Phone, Mail, MessageSquare, Calendar, X, Save, Trash2 } from "lucide-react";

type Application = {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  product_interest: string;
  source: string;
  status: "new" | "in_progress" | "done" | "rejected";
  notes: string;
  created_at: string;
};

const STATUS_LABEL: Record<string, string> = {
  new: "Yangi",
  in_progress: "Jarayonda",
  done: "Bajarildi",
  rejected: "Rad etildi",
};

const STATUS_COLOR: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  in_progress: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
  done: "bg-green-500/20 text-green-400 border-green-500/40",
  rejected: "bg-red-500/20 text-red-400 border-red-500/40",
};

export default function ApplicationsPage() {
  const [filter, setFilter] = useState<string>("all");
  const url = filter === "all" ? "/applications" : `/applications?status=${filter}`;
  const { data: apps = [] } = useSWR<Application[]>(url, fetcher, { refreshInterval: 10000 });
  const [editing, setEditing] = useState<Application | null>(null);

  async function updateStatus(id: number, status: string) {
    await api(`/applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    mutate(url);
  }

  async function saveApp() {
    if (!editing) return;
    await api(`/applications/${editing.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: editing.status, notes: editing.notes }),
    });
    setEditing(null);
    mutate(url);
  }

  async function deleteApp(id: number) {
    if (!confirm("Arizani o'chirishni tasdiqlaysizmi?")) return;
    await api(`/applications/${id}`, { method: "DELETE" });
    mutate(url);
  }

  return (
    <AuthLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Arizalar</h1>

        <div className="flex gap-2 mb-6">
          {["all", "new", "in_progress", "done", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`btn ${filter === s ? "btn-primary" : "btn-ghost"}`}
            >
              {s === "all" ? "Hammasi" : STATUS_LABEL[s]}
            </button>
          ))}
        </div>

        {apps.length === 0 ? (
          <div className="card p-12 text-center text-zinc-500">Arizalar topilmadi</div>
        ) : (
          <div className="space-y-3">
            {apps.map((a) => (
              <div key={a.id} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{a.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded border ${STATUS_COLOR[a.status]}`}>
                        {STATUS_LABEL[a.status]}
                      </span>
                      {a.source && (
                        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          {a.source}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                      {a.phone && (
                        <a href={`tel:${a.phone}`} className="flex items-center gap-2 text-zinc-300 hover:text-orange-400">
                          <Phone className="w-4 h-4 text-zinc-500" />
                          {a.phone}
                        </a>
                      )}
                      {a.email && (
                        <a href={`mailto:${a.email}`} className="flex items-center gap-2 text-zinc-300 hover:text-orange-400">
                          <Mail className="w-4 h-4 text-zinc-500" />
                          {a.email}
                        </a>
                      )}
                      {a.product_interest && (
                        <div className="flex items-center gap-2 text-zinc-400">
                          <MessageSquare className="w-4 h-4 text-zinc-500" />
                          {a.product_interest}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-zinc-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(a.created_at).toLocaleString("ru-RU")}
                      </div>
                    </div>
                    {a.message && (
                      <p className="text-sm text-zinc-300 bg-zinc-900/50 rounded-lg p-3 mb-2">{a.message}</p>
                    )}
                    {a.notes && (
                      <p className="text-xs text-orange-400 italic">Eslatma: {a.notes}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <select
                      value={a.status}
                      onChange={(e) => updateStatus(a.id, e.target.value)}
                      className="input text-sm py-1"
                    >
                      {Object.entries(STATUS_LABEL).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                    <button onClick={() => setEditing(a)} className="btn btn-ghost text-sm">
                      Eslatma
                    </button>
                    <button onClick={() => deleteApp(a.id)} className="text-red-400 hover:text-red-300 text-sm">
                      <Trash2 className="w-4 h-4 inline" /> O'chirish
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {editing && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="card max-w-lg w-full">
              <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                <h2 className="text-xl font-semibold">{editing.name} — eslatma</h2>
                <button onClick={() => setEditing(null)} className="text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm text-zinc-400 mb-1 block">Holat</label>
                  <select
                    className="input"
                    value={editing.status}
                    onChange={(e) => setEditing({ ...editing, status: e.target.value as any })}
                  >
                    {Object.entries(STATUS_LABEL).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-zinc-400 mb-1 block">Ichki eslatma</label>
                  <textarea
                    rows={5}
                    className="input"
                    value={editing.notes || ""}
                    onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 p-6 border-t border-zinc-800">
                <button onClick={() => setEditing(null)} className="btn btn-ghost">
                  Bekor qilish
                </button>
                <button onClick={saveApp} className="btn btn-primary">
                  <Save className="w-4 h-4" /> Saqlash
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
