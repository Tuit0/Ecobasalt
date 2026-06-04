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
  const { data } = useSWR("/api/content/blocks?section=contact", fetcher);
  const blocks = blocksToMap(data || []);
  const { show: showChat, open: chatOpen } = useChat();
  const [open, setOpen] = useState(false);

  const phone = pickLang(blocks["contact.phone"], lang) || "+998 90 000 00 00";
  const tg = pickLang(blocks["contact.telegram"], lang) || "https://t.me/eco_basalt";
  const ig = pickLang(blocks["contact.instagram"], lang) || "https://instagram.com/eco.basalt";
  const yt = pickLang(blocks["contact.youtube"], lang) || "";

  type Item =
    | { kind: "link"; href: string; icon: any; label: string; color: string; external: boolean }
    | { kind: "action"; onClick: () => void; icon: any; label: string; color: string };

  const items: Item[] = [
    {
      kind: "action",
      onClick: () => { showChat(); setOpen(false); },
      icon: MessagesSquare,
      label: "Live Chat",
      color: "bg-gold-400",
    },
    {
      kind: "link",
      href: `tel:${phone.replace(/\s/g, "")}`,
      icon: Phone,
      label: "Phone",
      color: "bg-onyx-800 border border-onyx-700",
      external: false,
    },
    {
      kind: "link",
      href: tg,
      icon: Telegram,
      label: "Telegram",
      color: "bg-[#229ED9]",
      external: true,
    },
    {
      kind: "link",
      href: ig,
      icon: Instagram,
      label: "Instagram",
      color: "bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888]",
      external: true,
    },
    ...(yt && yt !== "#"
      ? [{ kind: "link" as const, href: yt, icon: Youtube, label: "YouTube", color: "bg-[#FF0000]", external: true }]
      : []),
  ];

  // Chat ochiq bo'lsa, floating button yashir
  if (chatOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-end gap-3 mb-3"
          >
            {items.map((it, i) => {
              const Icon = it.icon;
              const inner = (
                <>
                  <span className="absolute right-full mr-3 px-3 py-1.5 bg-onyx-900 text-pearl-100 text-xs uppercase tracking-wider font-semibold border border-onyx-700 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all whitespace-nowrap pointer-events-none">
                    {it.label}
                  </span>
                  <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
                </>
              );
              const cls = `group relative flex items-center justify-center w-12 h-12 ${it.color} text-white shadow-lg hover:shadow-2xl transition-all`;

              return it.kind === "link" ? (
                <motion.a
                  key={it.label}
                  href={it.href}
                  target={it.external ? "_blank" : undefined}
                  rel={it.external ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, scale: 0.5, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.5, x: 20 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.1, x: -4 }}
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
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.1, x: -4 }}
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

      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-gold-400 hover:bg-gold-600 text-pearl-100 shadow-2xl flex items-center justify-center transition-colors relative"
        aria-label={open ? "Close" : "Contact"}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" strokeWidth={2} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" strokeWidth={1.8} />
            </motion.span>
          )}
        </AnimatePresence>
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 border-2 border-gold-400 animate-ping opacity-50" />
        )}
      </motion.button>
    </div>
  );
}
