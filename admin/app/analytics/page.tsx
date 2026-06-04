"use client";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import AuthLayout from "@/components/AuthLayout";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Eye, Users, Smartphone, Monitor, Tablet, TrendingUp, FileText } from "lucide-react";

const COLORS = ["#f97316", "#3b82f6", "#10b981", "#a855f7", "#ec4899", "#eab308"];

type Stats = {
  total_views: number;
  unique_sessions: number;
  views_today: number;
  applications_total: number;
  applications_today: number;
  active_now: number;
  top_pages: { path: string; views: number }[];
  views_by_day: { day: string; views: number }[];
  top_products: { name: string; slug: string; views: number }[];
  devices: { device: string; count: number }[];
};

type ActiveSession = {
  session_id: string;
  path: string;
  device: string | null;
  last_seen: string;
};

export default function AnalyticsPage() {
  const { data } = useSWR<Stats>("/analytics/stats", fetcher, { refreshInterval: 30000 });
  const { data: active = [] } = useSWR<ActiveSession[]>("/analytics/active", fetcher, { refreshInterval: 10000 });

  const stats = [
    { label: "Bugungi ko'rishlar", value: data?.views_today || 0, icon: Eye, color: "text-blue-400" },
    { label: "Hozir faol", value: data?.active_now || 0, icon: Users, color: "text-green-400" },
    { label: "Jami ko'rishlar", value: data?.total_views || 0, icon: TrendingUp, color: "text-orange-400" },
    { label: "Unikal sessiyalar", value: data?.unique_sessions || 0, icon: Users, color: "text-purple-400" },
    { label: "Bugungi arizalar", value: data?.applications_today || 0, icon: FileText, color: "text-pink-400" },
    { label: "Jami arizalar", value: data?.applications_total || 0, icon: FileText, color: "text-yellow-400" },
  ];

  const devicesArr = data?.devices || [];

  return (
    <AuthLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Analitika</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="card p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-400">{s.label}</span>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="text-2xl font-bold">{s.value.toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="card p-5 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">14 kunlik ko'rishlar</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data?.views_by_day || []}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="day" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8 }}
                  labelStyle={{ color: "#e4e4e7" }}
                />
                <Area type="monotone" dataKey="views" stroke="#f97316" fill="url(#g1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <h2 className="text-lg font-semibold mb-4">Qurilmalar</h2>
            {devicesArr.length === 0 ? (
              <div className="text-zinc-500 text-sm py-10 text-center">Ma'lumot yo'q</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={devicesArr}
                      dataKey="count"
                      nameKey="device"
                      innerRadius={45}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {devicesArr.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                  {devicesArr.map((d, i) => {
                    const Icon = d.device === "mobile" ? Smartphone : d.device === "tablet" ? Tablet : Monitor;
                    return (
                      <div key={i} className="text-xs">
                        <Icon className="w-4 h-4 mx-auto mb-1" style={{ color: COLORS[i % COLORS.length] }} />
                        <div className="text-zinc-400 capitalize">{d.device}</div>
                        <div className="font-semibold">{d.count}</div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="card p-5">
            <h2 className="text-lg font-semibold mb-4">Eng ko'p ochilgan sahifalar (7 kun)</h2>
            <div className="space-y-3">
              {(data?.top_pages || []).slice(0, 10).map((p, i) => {
                const max = (data?.top_pages?.[0]?.views ?? 1) || 1;
                const pct = (p.views / max) * 100;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-mono text-zinc-300 truncate flex-1 mr-2">{p.path}</span>
                      <span className="text-zinc-400 shrink-0">{p.views}</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-lg font-semibold mb-4">Top mahsulotlar</h2>
            {(data?.top_products || []).length === 0 ? (
              <div className="text-zinc-500 text-sm">Ma'lumot yo'q</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.top_products || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis type="number" stroke="#71717a" fontSize={12} />
                  <YAxis type="category" dataKey="name" stroke="#71717a" fontSize={11} width={140} />
                  <Tooltip
                    contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8 }}
                  />
                  <Bar dataKey="views" fill="#f97316" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-lg font-semibold mb-4">Hozir faol foydalanuvchilar</h2>
          {active.length === 0 ? (
            <div className="text-zinc-500 text-sm py-6 text-center">Faol foydalanuvchilar yo'q</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-zinc-400 text-xs">
                <tr>
                  <th className="py-2">Sessiya</th>
                  <th className="py-2">Sahifa</th>
                  <th className="py-2">Qurilma</th>
                  <th className="py-2">Oxirgi faol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {active.map((a) => (
                  <tr key={a.session_id}>
                    <td className="py-2 font-mono text-xs text-orange-400">{a.session_id}</td>
                    <td className="py-2 font-mono text-xs">{a.path}</td>
                    <td className="py-2 capitalize">{a.device || "?"}</td>
                    <td className="py-2 text-zinc-400">
                      {a.last_seen ? new Date(a.last_seen).toLocaleTimeString("ru-RU") : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
