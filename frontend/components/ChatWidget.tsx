"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, MessageCircleMore } from "lucide-react";
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
  const [typing, setTyping] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
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
          setTyping(false);
        } else if (data.type === "history") {
          setMessages(data.messages || []);
        } else if (data.type === "typing") {
          setTyping(true);
          setTimeout(() => setTyping(false), 3000);
        }
      } catch {}
    };
    ws.onclose = () => { wsRef.current = null; };

    return () => { ws.close(); };
  }, [started, open, name]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  // Auto-focus on input when chat opens
  useEffect(() => {
    if (open && started && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [open, started]);

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

  const formatTime = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString(lang === "ru" ? "ru-RU" : "en-US", { hour: "2-digit", minute: "2-digit" });
    } catch { return ""; }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-7rem)] sm:max-h-[calc(100vh-9rem)] flex flex-col overflow-hidden rounded-3xl shadow-2xl shadow-black/50"
        >
          {/* Glass background */}
          <div className="absolute inset-0 bg-onyx-900/95 backdrop-blur-2xl border border-pearl-100/10 rounded-3xl" />
          {/* Decorative orbs */}
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gold-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gold-400/15 blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="relative bg-gradient-to-b from-onyx-900/80 to-transparent border-b border-pearl-100/8 p-5 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              {/* Animated avatar */}
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold-400 via-red-500 to-gold-600 p-[2px]">
                  <div className="w-full h-full rounded-full bg-onyx-900 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-gold-400" strokeWidth={2} />
                  </div>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-onyx-900 animate-pulse" />
              </div>
              <div>
                <div className="font-bold text-pearl-100 text-base leading-none">ECO BASALT</div>
                <div className="text-xs text-pearl-300 mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {t(lang, "chat.online")}
                </div>
              </div>
            </div>
            <button
              onClick={hide}
              className="w-9 h-9 rounded-full bg-pearl-100/5 border border-pearl-100/10 text-pearl-200 hover:text-pearl-100 hover:bg-pearl-100/10 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>

          {/* Body */}
          {!started ? (
            // Welcome / name input
            <form onSubmit={handleStart} className="relative flex-1 flex flex-col justify-center p-7 gap-5 z-10">
              <div className="text-center mb-2">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-400/20 to-red-500/10 border border-gold-400/40 flex items-center justify-center">
                  <MessageCircleMore className="w-7 h-7 text-gold-400" strokeWidth={1.8} />
                </div>
                <h3 className="font-bold text-pearl-100 text-lg mb-2">
                  {lang === "uz" ? "Salom! 👋" : lang === "ru" ? "Привет! 👋" : "Hello! 👋"}
                </h3>
                <p className="text-pearl-200 text-sm leading-relaxed">{t(lang, "chat.intro")}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-pearl-300 mb-2 block">
                  {t(lang, "chat.name_placeholder")}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-onyx-950/60 backdrop-blur border border-pearl-100/10 rounded-2xl px-4 py-3 text-pearl-100 focus:border-gold-400 focus:bg-onyx-950/90 focus:ring-4 focus:ring-gold-400/10 outline-none text-sm transition-all"
                  placeholder={lang === "uz" ? "Ismingiz" : lang === "ru" ? "Ваше имя" : "Your name"}
                  required
                />
              </div>
              <button type="submit" className="btn-solid-gold w-full !flex group">
                {t(lang, "chat.start")}
                <Send className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
              </button>
            </form>
          ) : (
            <>
              {/* Messages */}
              <div ref={scrollRef} className="relative flex-1 overflow-y-auto p-4 space-y-3 z-10">
                {messages.map((m, i) => {
                  const isUser = m.sender === "user";
                  const isBot = m.sender === "bot";
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex items-end gap-2 max-w-[85%] ${isUser ? "flex-row-reverse" : ""}`}>
                        {/* Avatar */}
                        {!isUser && (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-400 to-red-500 flex-shrink-0 mb-1 flex items-center justify-center text-[10px] font-bold text-pearl-100">
                            {isBot ? "🤖" : "EB"}
                          </div>
                        )}

                        <div className="flex flex-col gap-0.5">
                          <div className={`px-4 py-2.5 text-sm leading-relaxed ${
                            isUser
                              ? "bg-gradient-to-br from-gold-400 to-gold-600 text-pearl-100 rounded-2xl rounded-br-md"
                              : "bg-pearl-100/5 backdrop-blur-sm border border-pearl-100/8 text-pearl-100 rounded-2xl rounded-bl-md"
                          }`}>
                            {m.text}
                          </div>
                          <div className={`text-[10px] text-pearl-300/60 px-2 ${isUser ? "text-right" : ""}`}>
                            {formatTime(m.ts)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Typing indicator */}
                <AnimatePresence>
                  {typing && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="flex items-end gap-2"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-400 to-red-500 flex items-center justify-center text-[10px] font-bold text-pearl-100">EB</div>
                      <div className="bg-pearl-100/5 backdrop-blur-sm border border-pearl-100/8 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                            className="w-1.5 h-1.5 rounded-full bg-pearl-200"
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="relative p-4 border-t border-pearl-100/8 z-10">
                <div className="flex items-center gap-2 bg-onyx-950/60 backdrop-blur border border-pearl-100/10 rounded-full pl-5 pr-1 py-1 focus-within:border-gold-400/50 focus-within:ring-4 focus-within:ring-gold-400/10 transition-all">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t(lang, "chat.placeholder")}
                    className="flex-1 bg-transparent text-pearl-100 placeholder-pearl-300/50 text-sm outline-none py-2"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-pearl-100 hover:scale-105 disabled:opacity-40 disabled:scale-100 flex items-center justify-center transition-all shadow-lg shadow-gold-400/30"
                  >
                    <Send className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
