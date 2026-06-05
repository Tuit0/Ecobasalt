"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, Package, ClipboardList, Image as ImageIcon,
  MessageSquare, BarChart3, LogOut, Building2, Sparkles,
  Newspaper, HelpCircle, Star, Users, Calculator, GitCompare, Globe,
} from "lucide-react";
import { clearToken } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t, Lang } from "@/lib/i18n";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang } = useLang();

  const SECTIONS = [
    {
      title: t(lang, "sidebar.main"),
      items: [
        { href: "/dashboard", label: t(lang, "sidebar.dashboard"), icon: LayoutDashboard },
        { href: "/analytics", label: t(lang, "sidebar.analytics"), icon: BarChart3 },
        { href: "/applications", label: t(lang, "sidebar.applications"), icon: ClipboardList },
        { href: "/chat", label: t(lang, "sidebar.chat"), icon: MessageSquare },
      ],
    },
    {
      title: t(lang, "sidebar.content"),
      items: [
        { href: "/content", label: t(lang, "sidebar.content_blocks"), icon: FileText },
        { href: "/hero-slides", label: t(lang, "sidebar.hero_slides"), icon: Sparkles },
        { href: "/products", label: t(lang, "sidebar.products"), icon: Package },
        { href: "/projects", label: t(lang, "sidebar.projects"), icon: Building2 },
        { href: "/blog", label: t(lang, "sidebar.blog"), icon: Newspaper },
      ],
    },
    {
      title: t(lang, "sidebar.cms"),
      items: [
        { href: "/features", label: t(lang, "sidebar.features"), icon: Star },
        { href: "/faq", label: t(lang, "sidebar.faq"), icon: HelpCircle },
        { href: "/clients", label: t(lang, "sidebar.clients"), icon: Users },
        { href: "/calculator", label: t(lang, "sidebar.calculator"), icon: Calculator },
        { href: "/comparison", label: t(lang, "sidebar.comparison"), icon: GitCompare },
        { href: "/media", label: t(lang, "sidebar.media"), icon: ImageIcon },
      ],
    },
  ];

  const logout = () => {
    clearToken();
    router.push("/login");
  };

  const langLabels: Record<Lang, string> = { uz: "UZ", ru: "RU", en: "EN" };

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

      {/* Language switcher */}
      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-2 px-3 mb-2">
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
            {t(lang, "lang.language")}
          </span>
        </div>
        <div className="flex gap-1 px-1">
          {(["uz", "ru", "en"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                l === lang
                  ? "bg-brand-500 text-white"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {langLabels[l]}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-slate-800">
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-900">
          <LogOut className="w-4 h-4" />
          {t(lang, "sidebar.logout")}
        </button>
      </div>
    </aside>
  );
}
