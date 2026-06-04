"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, Package, ClipboardList, Image as ImageIcon,
  MessageSquare, BarChart3, LogOut, Building2, Sparkles,
  Newspaper, HelpCircle, Star, Users, Calculator, GitCompare,
} from "lucide-react";
import { clearToken } from "@/lib/api";

const SECTIONS = [
  {
    title: "Asosiy",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/analytics", label: "Analitika", icon: BarChart3 },
      { href: "/applications", label: "Arizalar", icon: ClipboardList },
      { href: "/chat", label: "Chat", icon: MessageSquare },
    ],
  },
  {
    title: "Kontent",
    items: [
      { href: "/content", label: "Kontent bloklari", icon: FileText },
      { href: "/hero-slides", label: "Hero slaydlar", icon: Sparkles },
      { href: "/products", label: "Mahsulotlar", icon: Package },
      { href: "/projects", label: "Loyihalar", icon: Building2 },
      { href: "/blog", label: "Blog", icon: Newspaper },
    ],
  },
  {
    title: "CMS",
    items: [
      { href: "/features", label: "Xususiyatlar", icon: Star },
      { href: "/faq", label: "FAQ", icon: HelpCircle },
      { href: "/clients", label: "Mijozlar", icon: Users },
      { href: "/calculator", label: "Kalkulyator", icon: Calculator },
      { href: "/comparison", label: "Taqqoslash", icon: GitCompare },
      { href: "/media", label: "Media", icon: ImageIcon },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    clearToken();
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="ECO BASALT" width={36} height={36} style={{ objectFit: "contain" }} />
          <div>
            <div className="font-bold text-white tracking-wider text-sm">ECO BASALT</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Admin Panel</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-5 overflow-y-auto">
        {SECTIONS.map((sec) => (
          <div key={sec.title}>
            <div className="text-[9px] tracking-[0.25em] uppercase text-slate-600 font-bold px-3 mb-2">
              {sec.title}
            </div>
            <div className="space-y-1">
              {sec.items.map((it) => {
                const Icon = it.icon;
                const active = pathname === it.href || (it.href !== "/" && pathname?.startsWith(it.href));
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      active ? "bg-brand-500/10 text-brand-400 border border-brand-500/30" : "text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {it.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-800">
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-900">
          <LogOut className="w-4 h-4" />
          Chiqish
        </button>
      </div>
    </aside>
  );
}
