"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Loader2, Globe } from "lucide-react";
import { api, setToken } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t, Lang } from "@/lib/i18n";

export default function LoginPage() {
  const router = useRouter();
  const { lang, setLang } = useLang();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await api<{ access_token: string }>("/auth/login-json", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      setToken(data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(t(lang, "login.error"));
    } finally {
      setLoading(false);
    }
  };

  const langLabels: Record<Lang, string> = { uz: "UZ", ru: "RU", en: "EN" };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      {/* Language switcher */}
      <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
        <Globe className="w-3.5 h-3.5 text-slate-500" />
        <div className="flex gap-1">
          {(["uz", "ru", "en"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
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

      <div className="relative w-full max-w-md card p-8">
        <div className="flex items-center gap-3 mb-8">
          <img src="/logo.png" alt="ECO BASALT" width={48} height={48} style={{ objectFit: "contain" }} />
          <div>
            <div className="text-2xl font-bold text-white">{t(lang, "login.title")}</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">{t(lang, "login.subtitle")}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">{t(lang, "login.username")}</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input pl-10"
                required
              />
            </div>
          </div>
          <div>
            <label className="label">{t(lang, "login.password")}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-10"
                required
              />
            </div>
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t(lang, "login.button")}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500 text-center">
          {t(lang, "login.default")}: <span className="font-mono text-slate-400">admin / admin123</span>
        </div>
      </div>
    </div>
  );
}
