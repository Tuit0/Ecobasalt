"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { generateSessionId } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { useChat } from "@/lib/chat-context";

type Msg = { sender: "user" | "operator" | "bot"; text: string; ts: string };

export default function ChatWidget() {
  const { lang } = useLang();
  const { open, hide } = useChat();
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sessionIdRef = useRef<string>("");

  useEffect(() => {
    sessionIdRef.current = generateSessionId();
    const saved = localStorage.getItem("basalt_chat_name");
    if (saved) {
      setName(saved);
      setStarted(true);
    }
  }, []);

  useEffect(() => {
    if (!started || !open) return;
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${proto}//${window.location.host}/api/chat/ws/user/${sessionIdRef.current}`);
    wsRef.current = ws;

    ws.onopen = () => { ws.send(JSON.stringify({ type: "init", name })); };
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === "message") {
          setMessages((m) => [...m, { sender: data.sender, text: data.text, ts: data.ts }]);
        } else if (data.type === "history") {
          setMessages(data.messages || []);
        }
      } catch {}
    };
    ws.onclose = () => { wsRef.current = null; };

    return () => { ws.close(); };
  }, [started, open, name]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    localStorage.setItem("basalt_chat_name", name);
    setStarted(true);
    setMessages([{ sender: "bot", text: t(lang, "chat.greeting"), ts: new Date().toISOString() }]);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !wsRef.current) return;
    wsRef.current.send(JSON.stringify({ type: "message", text }));
    setMessages((m) => [...m, { sender: "user", text, ts: new Date().toISOString() }]);
    setInput("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[560px] max-h-[calc(100vh-9rem)] bg-onyx-950 border border-gold-400/30 flex flex-col overflow-hidden shadow-2xl"
        >
          <div className="bg-onyx-900 border-b border-gold-400/20 p-5 flex items-center justify-between">
            <div>
              <div className="font-display font-bold text-pearl-100 text-lg tracking-[0.18em] leading-none">ECO BASALT</div>
              <div className="text-[10px] text-gold-400/90 tracking-[0.3em] uppercase mt-2 flex items-center gap-2 font-semibold">
                <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse" />
                {t(lang, "chat.online")}
              </div>
            </div>
            <button onClick={hide} className="text-pearl-200 hover:text-gold-400 transition-colors">
              <X className="w-5 h-5" strokeWidth={1.8} />
            </button>
          </div>

          {!started ? (
            <form onSubmit={handleStart} className="flex-1 flex flex-col justify-center p-8 gap-6">
              <p className="text-pearl-200 text-center text-base leading-relaxed">{t(lang, "chat.intro")}</p>
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase text-gold-400 mb-2 block font-semibold">
                  {t(lang, "chat.name_placeholder")}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-onyx-800 border border-onyx-700 px-4 py-3 text-pearl-100 focus:border-gold-400 outline-none transition-colors text-base"
                  required
                />
              </div>
              <button type="submit" className="btn-solid-gold mt-2">
                {t(lang, "chat.start")}
              </button>
            </form>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] px-4 py-2.5 text-sm ${
                      m.sender === "user"
                        ? "bg-gold-400 text-pearl-100"
                        : "bg-onyx-800 text-pearl-100 border border-onyx-700"
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSend} className="p-4 border-t border-onyx-700 flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t(lang, "chat.placeholder")}
                  className="flex-1 bg-onyx-900 border border-onyx-700 px-4 py-2.5 text-pearl-100 placeholder-pearl-300/50 focus:border-gold-400 outline-none text-sm"
                />
                <button type="submit" className="bg-gold-400 hover:bg-gold-600 text-pearl-100 px-4 transition-colors">
                  <Send className="w-4 h-4" strokeWidth={2} />
                </button>
              </form>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
