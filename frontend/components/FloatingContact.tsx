"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Send as Telegram, Instagram, Youtube, MessageCircle, X, MessagesSquare } from "lucide-react";
import useSWR from "swr";
import { fetcher, blocksToMap, pickLang } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { useChat } from "@/lib/chat-context";

export default function FloatingContact() {
  const { lang } = useLang();
  const { data } = useSWR("/api/content/blocks?section=contact", fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  });
  const blocks = blocksToMap(data || []);
  const { show: showChat, open: chatOpen } = useChat();
  const [open, setOpen] = useState(false);

  const phone = pickLang(blocks["contact.phone"], lang) || "+998 90 000 00 00";
  const tg = pickLang(blocks["contact.telegram"], lang) || "https://t.me/eco_basalt";
  const ig = pickLang(blocks["contact.instagram"], lang) || "https://instagram.com/eco.basalt";
  const yt = pickLang(blocks["contact.youtube"], lang) || "";

  type Item =
    | { kind: "link"; href: string; icon: any; label: string; gradient: string; external: boolean }
    | { kind: "action"; onClick: () => void; icon: any; label: string; gradient: string };

  const items: Item[] = [
    {
      kind: "action",
      onClick: () => { showChat(); setOpen(false); },
      icon: MessagesSquare,
      label: lang === "uz" ? "Live Chat" : lang === "ru" ? "Чат" : "Live Chat",
      gradient: "from-gold-400 to-red-500",
    },
    {
      kind: "link",
      href: `tel:${phone.replace(/\s/g, "")}`,
      icon: Phone,
      label: lang === "uz" ? "Telefon" : lang === "ru" ? "Телефон" : "Phone",
      gradient: "from-emerald-400 to-emerald-600",
      external: false,
    },
    {
      kind: "link",
      href: tg,
      icon: Telegram,
      label: "Telegram",
      gradient: "from-sky-400 to-[#229ED9]",
      external: true,
    },
    {
      kind: "link",
      href: ig,
      icon: Instagram,
      label: "Instagram",
      gradient: "from-[#f09433] via-[#e6683c] to-[#bc1888]",
      external: true,
    },
    ...(yt && yt !== "#"
      ? [{ kind: "link" as const, href: yt, icon: Youtube, label: "YouTube", gradient: "from-red-500 to-red-700", external: true }]
      : []),
  ];

  if (chatOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-end gap-2.5 mb-3"
          >
            {items.map((it, i) => {
              const Icon = it.icon;
              const inner = (
                <>
                  {/* Label pill */}
                  <span className="px-3.5 py-1.5 rounded-full bg-onyx-900/90 backdrop-blur-xl border border-pearl-100/10 text-pearl-100 text-xs font-semibold shadow-xl shadow-black/30 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap">
                    {it.label}
                  </span>
                  {/* Icon button */}
                  <span className={`w-12 h-12 rounded-full bg-gradient-to-br ${it.gradient} text-white flex items-center justify-center shadow-xl shadow-black/40 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </span>
                </>
              );

              const cls = "group flex items-center gap-3";

              return it.kind === "link" ? (
                <motion.a
                  key={it.label}
                  href={it.href}
                  target={it.external ? "_blank" : undefined}
                  rel={it.external ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, scale: 0.5, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.5, x: 20 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={cls}
                  aria-label={it.label}
                >
                  {inner}
                </motion.a>
              ) : (
                <motion.button
                  key={it.label}
                  onClick={it.onClick}
                  initial={{ opacity: 0, scale: 0.5, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.5, x: 20 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={cls}
                  aria-label={it.label}
                >
                  {inner}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-gold-400 via-red-500 to-gold-600 text-pearl-100 shadow-2xl shadow-gold-400/40 flex items-center justify-center transition-colors"
        aria-label={open ? "Close" : "Contact"}
      >
        {/* Animated outer ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full border-2 border-gold-400/50 animate-ping" />
        )}

        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" strokeWidth={2.5} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" strokeWidth={2} />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Notification dot */}
        {!open && (
          <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-onyx-950 animate-pulse" />
        )}
      </motion.button>
    </div>
  );
}
