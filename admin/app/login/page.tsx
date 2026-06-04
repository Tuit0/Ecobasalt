"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Loader2 } from "lucide-react";
import { api, setToken } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
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
      setError("Login yoki parol noto'g'ri");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md card p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-7 h-7"><polygon points="12,4 20,18 4,18" fill="#f97316" /></svg>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">BASALT Admin</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">Boshqaruv paneli</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Foydalanuvchi</label>
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
            <label className="label">Parol</label>
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Kirish"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500 text-center">
          Default: <span className="font-mono text-slate-400">admin / admin123</span>
        </div>
      </div>
    </div>
  );
}
