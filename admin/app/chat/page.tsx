"use client";
import { useEffect, useRef, useState } from "react";
import useSWR, { mutate } from "swr";
import { api, fetcher, getToken } from "@/lib/api";
import AuthLayout from "@/components/AuthLayout";
import { Send, MessageCircle, User } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

type Session = {
  session_id: string;
  name: string | null;
  phone: string | null;
  last_message_at: string | null;
  unread_count: number;
};

type Message = {
  id: number;
  session_id: string;
  sender: "user" | "operator" | "bot";
  text: string;
  created_at: string;
};

export default function ChatPage() {
  const { lang } = useLang();
  const { data: sessions = [] } = useSWR<Session[]>("/chat/sessions", fetcher, { refreshInterval: 5000 });
  const [activeId, setActiveId] = useState<string | null>(null);
  const { data: messages = [] } = useSWR<Message[]>(
    activeId ? `/chat/messages/${activeId}` : null,
    fetcher,
    { refreshInterval: 2000 }
  );
  const [text, setText] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = getToken();
    if (!token) return;
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${proto}//${window.location.host}/api/chat/ws/operator?token=${token}`);
    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        if (data.type === "message") {
          mutate("/chat/sessions");
          if (data.session_id === activeId) {
            mutate(`/chat/messages/${activeId}`);
          }
        }
      } catch {}
    };
    wsRef.current = ws;
    return () => ws.close();
  }, [activeId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (activeId) {
      api(`/chat/sessions/${activeId}/read`, { method: "POST" }).catch(() => {});
    }
  }, [activeId]);

  async function send() {
    if (!activeId || !text.trim()) return;
    // WebSocket orqali yuborish
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ session_id: activeId, text }));
    } else {
      // Fallback: REST
      await api(`/chat/messages`, {
        method: "POST",
        body: JSON.stringify({ session_id: activeId, sender: "operator", text }),
      });
    }
    setText("");
    setTimeout(() => mutate(`/chat/messages/${activeId}`), 300);
  }

  return (
    <AuthLayout>
      <div className="h-screen flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-2xl font-bold">{t(lang, "chat.title")}</h1>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="w-80 border-r border-zinc-800 overflow-y-auto">
            {sessions.length === 0 ? (
              <div className="p-6 text-center text-zinc-500">
                <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
                {t(lang, "chat.no_sessions")}
              </div>
            ) : (
              sessions.map((s) => (
                <button
                  key={s.session_id}
                  onClick={() => setActiveId(s.session_id)}
                  className={`w-full text-left p-4 border-b border-zinc-800 hover:bg-zinc-900 transition-colors ${
                    activeId === s.session_id ? "bg-zinc-900" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-semibold truncate">{s.name || t(lang, "chat.guest")}</div>
                        {s.unread_count > 0 && (
                          <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full shrink-0">
                            {s.unread_count}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-zinc-500 truncate">{s.phone || s.session_id.slice(0, 8)}</div>
                      <div className="text-xs text-zinc-600 mt-1">
                        {s.last_message_at ? new Date(s.last_message_at).toLocaleString("ru-RU") : ""}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="flex-1 flex flex-col">
            {!activeId ? (
              <div className="flex-1 flex items-center justify-center text-zinc-500">
                {t(lang, "chat.select_chat")}
              </div>
            ) : (
              <>
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-3">
                  {messages.map((m) => {
                    const isOp = m.sender === "operator";
                    const isBot = m.sender === "bot";
                    return (
                      <div key={m.id} className={`flex ${isOp ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-md px-4 py-2.5 rounded-2xl ${
                            isOp
                              ? "bg-orange-500 text-white"
                              : isBot
                              ? "bg-zinc-700 text-zinc-100"
                              : "bg-zinc-800 text-zinc-100"
                          }`}
                        >
                          <div className="text-sm whitespace-pre-wrap break-words">{m.text}</div>
                          <div className="text-xs opacity-60 mt-1">
                            {new Date(m.created_at).toLocaleTimeString("ru-RU")}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-zinc-800 p-4 flex gap-2">
                  <input
                    className="input flex-1"
                    placeholder={t(lang, "chat.placeholder")}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
                  />
                  <button onClick={send} disabled={!text.trim()} className="btn btn-primary">
                    <Send className="w-4 h-4" /> {t(lang, "chat.send")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
