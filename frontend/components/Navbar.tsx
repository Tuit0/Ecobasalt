"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { t, Lang } from "@/lib/i18n";
import { useApplicationModal } from "@/lib/application-modal";
import Logo from "./Logo";

export default function Navbar() {
  const { lang, setLang } = useLang();
  const pathname = usePathname();
  const { show: showModal } = useApplicationModal();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setLangOpen(false); }, [pathname]);

  const navItems = [
    { href: "/products?cat=thermal", label: t(lang, "nav.thermal") },
    { href: "/products?cat=hydroponics", label: t(lang, "nav.hydroponics") },
    { href: "/about", label: t(lang, "nav.about") },
    { href: "/downloads", label: t(lang, "nav.docs") },
    { href: "/blog", label: t(lang, "nav.blog") },
    { href: "/contact", label: t(lang, "nav.contact") },
  ];

  const langLabels: Record<Lang, string> = { uz: "UZ", ru: "RU", en: "EN" };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header
      className={`fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] max-w-7xl`}
    >
      {/* Root flex: pill (chapda) + CTA button (o'ngda, alohida) */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex-1 min-w-0 bg-onyx-900/75 backdrop-blur-xl border border-pearl-100/12 rounded-full px-5 sm:px-6 xl:px-8 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo — kattaroq, oq subtle ring bilan */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative">
                <div className="absolute inset-0 rounded-full ring-1 ring-pearl-100/20 group-hover:ring-pearl-100/40 transition-all" />
                <Logo size={42} className="sm:w-12 sm:h-12 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />
              </div>
              <div
                className="font-bold text-gold-400 text-lg sm:text-xl leading-none tracking-tight"
                style={{ textShadow: "0 0 20px rgba(169, 29, 42, 0.35), 0 1px 0 rgba(0, 0, 0, 0.5)" }}
              >
                ECO BASALT
              </div>
            </Link>

            {/* Center nav — bir xil oraliqlar, kattaroq shrift */}
            <nav className="hidden lg:flex items-center gap-1 mx-auto">
              {navItems.map((it) => {
                const active = isActive(it.href);
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={`relative px-3.5 xl:px-4 py-2.5 text-sm xl:text-[15px] font-medium rounded-full transition-all duration-300 text-center whitespace-nowrap ${
                      active
                        ? "text-pearl-100 bg-pearl-100/10"
                        : "text-pearl-200 hover:text-pearl-100 hover:bg-pearl-100/5"
                    }`}
                  >
                    {it.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active-dot"
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold-400"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right (pill ichida faqat lang dropdown qoladi) */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  onBlur={() => setTimeout(() => setLangOpen(false), 150)}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-[15px] font-medium text-pearl-200 hover:text-pearl-100 hover:bg-pearl-100/5 transition-colors"
                >
                  {langLabels[lang]}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${langOpen ? "rotate-180" : ""}`} strokeWidth={2.5} />
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 bg-onyx-900/95 backdrop-blur-xl border border-pearl-100/10 rounded-2xl overflow-hidden min-w-[90px] shadow-2xl"
                    >
                      {(["uz", "ru", "en"] as Lang[]).map((l) => (
                        <button
                          key={l}
                          onClick={() => { setLang(l); setLangOpen(false); }}
                          className={`block w-full text-left px-4 py-2.5 text-sm font-medium ${
                            l === lang ? "bg-gold-400 text-pearl-100" : "text-pearl-200 hover:bg-pearl-100/5"
                          }`}
                        >
                          {langLabels[l]}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button
              className="lg:hidden text-pearl-100 p-2 rounded-full hover:bg-pearl-100/5 transition-colors"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CTA button — pill'dan TASHQARIDA, alohida element (Linear/Vercel pattern) */}
        <button
          onClick={() => showModal()}
          className="hidden lg:inline-flex btn-solid-gold !py-3 !px-5 xl:!px-6 !text-sm shrink-0 !rounded-full whitespace-nowrap"
        >
          {t(lang, "nav.apply")}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-onyx-950/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center justify-between h-16 px-5 border-b border-pearl-100/5">
              <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                <Logo size={34} />
                <div className="font-bold text-gold-400 tracking-tight">ECO BASALT</div>
              </Link>
              <button onClick={() => setOpen(false)} className="text-pearl-100 p-2 rounded-full hover:bg-pearl-100/5">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-1">
              {navItems.map((it, i) => {
                const active = isActive(it.href);
                return (
                  <motion.div
                    key={it.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={it.href}
                      onClick={() => setOpen(false)}
                      className={`block py-3.5 px-4 rounded-2xl text-base font-medium transition-colors ${
                        active ? "bg-gold-400/10 text-gold-400" : "text-pearl-100 hover:bg-pearl-100/5"
                      }`}
                    >
                      {it.label}
                    </Link>
                  </motion.div>
                );
              })}
              <div className="pt-6 flex gap-2 justify-center text-sm font-semibold">
                {(["uz", "ru", "en"] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-5 py-2 rounded-full transition-all ${
                      l === lang ? "bg-gold-400 text-pearl-100" : "bg-pearl-100/5 text-pearl-300"
                    }`}
                  >
                    {langLabels[l]}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setOpen(false); showModal(); }}
                className="btn-solid-gold w-full mt-6 !flex"
              >
                {t(lang, "nav.apply")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
