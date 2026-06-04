"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
import { Eye, Users, ClipboardList, TrendingUp, Activity, Package, MessageSquare } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import AuthLayout from "@/components/AuthLayout";
import { fetcher } from "@/lib/api";

export default function DashboardPage() {
  return (
    <AuthLayout>
      <DashboardContent />
    </AuthLayout>
  );
}

function DashboardContent() {
  const { data: overview } = useSWR("/admin/overview", fetcher);
  const { data: stats } = useSWR("/analytics/stats?days=14", fetcher);
  const [active, setActive] = useState<any[]>([]);

  // Poll active users every 10 seconds
  useEffect(() => {
    let timer: any;
    const load = async () => {
      try {
        const res = await fetcher("/analytics/active");
        setActive(Array.isArray(res) ? res : (res?.users || []));
      } catch {}
      timer = setTimeout(load, 10000);
    };
    load();
    return () => clearTimeout(timer);
  }, []);

  const cards = [
    { label: "Bugun ko'rishlar", value: stats?.views_today ?? "—", icon: Eye, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Hozir saytda", value: active.length, icon: Activity, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Yangi arizalar", value: overview?.applications_new ?? "—", icon: ClipboardList, color: "text-brand-400", bg: "bg-brand-500/10" },
    { label: "O'qilmagan chat", value: overview?.chats_unread ?? "—", icon: MessageSquare, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  const COLORS = ["#f97316", "#3b82f6", "#10b981", "#a855f7", "#ef4444"];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Saytning hozirgi holati va statistikalar</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="card p-5">
              <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${c.color}`} />
              </div>
              <div className="text-3xl font-bold text-white">{c.value}</div>
              <div className="text-sm text-slate-400 mt-1">{c.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Ko'rishlar dinamikasi</h3>
              <p className="text-sm text-slate-400">So'nggi 14 kun</p>
            </div>
            <TrendingUp className="w-5 h-5 text-brand-400" />
          </div>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <AreaChart data={stats?.views_by_day || []}>
                <defs>
                  <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, color: "#e2e8f0" }} />
                <Area type="monotone" dataKey="views" stroke="#f97316" strokeWidth={2} fill="url(#viewGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Qurilmalar</h3>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={(stats?.devices || []).map((d: any) => ({ name: d.device, value: d.count }))}
                  cx="50%" cy="50%" outerRadius={70} dataKey="value"
                  label={(e: any) => e.name}
                >
                  {(stats?.devices || []).map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Active users + Top pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Hozir saytda ({active.length})
              </h3>
              <p className="text-sm text-slate-400">Real vaqt</p>
            </div>
          </div>
          {active.length === 0 ? (
            <div className="text-slate-500 text-sm py-6 text-center">Hozir hech kim yo'q</div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {active.map((u, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-2 px-3 bg-slate-950 rounded-lg">
                  <div className="font-mono text-slate-400 text-xs">{u.session_id?.slice(0, 12)}...</div>
                  <div className="text-slate-300 truncate max-w-[180px]">{u.path}</div>
                  <div className="text-slate-500 text-xs">{u.device}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top sahifalar</h3>
          {(stats?.top_pages || []).length === 0 ? (
            <div className="text-slate-500 text-sm py-6 text-center">Hali ma'lumot yo'q</div>
          ) : (
            <div className="space-y-3">
              {(stats?.top_pages || []).slice(0, 6).map((p: any, i: number) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="text-slate-300 truncate max-w-[300px]">{p.path}</div>
                    <div className="text-brand-400 font-medium">{p.views}</div>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500" style={{ width: `${Math.min(100, (p.views / (stats.top_pages[0]?.views || 1)) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent applications */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">So'nggi arizalar</h3>
          <a href="/applications" className="text-sm text-brand-400 hover:text-brand-300">Hammasi →</a>
        </div>
        {(!overview?.recent_applications || overview.recent_applications.length === 0) ? (
          <div className="text-slate-500 text-sm py-6 text-center">Arizalar yo'q</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-800">
                  <th className="pb-3 font-medium">Ism</th>
                  <th className="pb-3 font-medium">Telefon</th>
                  <th className="pb-3 font-medium">Mahsulot</th>
                  <th className="pb-3 font-medium">Manba</th>
                  <th className="pb-3 font-medium">Holat</th>
                  <th className="pb-3 font-medium">Vaqt</th>
                </tr>
              </thead>
              <tbody>
                {overview.recent_applications.map((a: any) => (
                  <tr key={a.id} className="border-b border-slate-900">
                    <td className="py-3 text-white">{a.name}</td>
                    <td className="py-3 text-slate-300 font-mono text-xs">{a.phone}</td>
                    <td className="py-3 text-slate-400">{a.product || "—"}</td>
                    <td className="py-3"><span className="text-xs px-2 py-0.5 bg-slate-800 rounded text-slate-300">{a.source}</span></td>
                    <td className="py-3"><StatusBadge status={a.status} /></td>
                    <td className="py-3 text-slate-500 text-xs">{new Date(a.created_at).toLocaleString("uz-UZ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    in_progress: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    done: "bg-green-500/10 text-green-400 border-green-500/30",
    rejected: "bg-red-500/10 text-red-400 border-red-500/30",
  };
  const labels: Record<string, string> = {
    new: "Yangi",
    in_progress: "Jarayonda",
    done: "Bajarildi",
    rejected: "Rad etildi",
  };
  return <span className={`text-xs px-2 py-0.5 rounded border ${colors[status] || "bg-slate-700 text-slate-300"}`}>{labels[status] || status}</span>;
}
