"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sahifa o'zgarganda mobile menu yopiladi
  useEffect(() => { setOpen(false); }, [pathname]);

  const navItems = [
    { href: "/products", label: t(lang, "nav.products") },
    { href: "/projects", label: t(lang, "nav.projects") },
    { href: "/calculator", label: t(lang, "nav.calculator") },
    { href: "/blog", label: t(lang, "nav.blog") },
    { href: "/about", label: t(lang, "nav.about") },
    { href: "/contact", label: t(lang, "nav.contact") },
  ];

  const langLabels: Record<Lang, string> = { uz: "UZ", ru: "RU", en: "EN" };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled || pathname !== "/"
          ? "bg-onyx-950/95 backdrop-blur border-b border-onyx-700"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <Logo size={36} className="sm:w-11 sm:h-11 transition-transform duration-300 group-hover:scale-105" />
            <div>
              <div className="font-display font-bold text-pearl-100 text-sm sm:text-base tracking-[0.15em] leading-none">ECO BASALT</div>
              <div className="text-[8px] sm:text-[9px] text-gold-400 font-semibold tracking-[0.2em] sm:tracking-[0.25em] uppercase mt-1 sm:mt-1.5 hidden xs:block">Fire · Eco · Mineral</div>
            </div>
          </Link>

          {/* Center nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map((it) => {
              const active = isActive(it.href);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={`relative text-xs uppercase tracking-[0.1em] font-semibold transition-colors ${
                    active ? "text-gold-400" : "text-pearl-200 hover:text-gold-400"
                  }`}
                >
                  {it.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-gold-400"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right */}
          <div className="hidden lg:flex items-center gap-5">
            <div className="flex items-center text-xs font-semibold">
              {(["uz", "ru", "en"] as Lang[]).map((l, i) => (
                <span key={l} className="flex items-center">
                  {i > 0 && <span className="text-pearl-300 mx-1.5">/</span>}
                  <button
                    onClick={() => setLang(l)}
                    className={`transition-colors px-1 ${
                      l === lang ? "text-gold-400" : "text-pearl-300 hover:text-pearl-100"
                    }`}
                  >
                    {langLabels[l]}
                  </button>
                </span>
              ))}
            </div>

            <button onClick={() => showModal()} className="btn-solid-gold !py-2.5 !px-5 text-[11px]">
              {t(lang, "nav.apply")}
            </button>
          </div>

          <button
            className="lg:hidden text-pearl-100 p-2"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-onyx-950 lg:hidden"
          >
            <div className="flex items-center justify-between h-20 px-8 border-b border-onyx-700">
              <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                <Logo size={36} />
                <div className="font-display font-bold text-pearl-100 text-base tracking-[0.15em]">ECO BASALT</div>
              </Link>
              <button onClick={() => setOpen(false)} className="text-pearl-100 p-2"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 space-y-1">
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
                      className={`block py-4 text-xl font-semibold tracking-wider border-b border-onyx-800 transition-colors ${
                        active ? "text-gold-400" : "text-pearl-100 hover:text-gold-400"
                      }`}
                    >
                      <span className="text-gold-400 text-xs mr-4 font-mono">0{i + 1}</span>
                      {it.label}
                    </Link>
                  </motion.div>
                );
              })}
              <div className="pt-8 flex gap-3 justify-center text-xs tracking-[0.15em] font-semibold">
                {(["uz", "ru", "en"] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-4 py-2 border ${
                      l === lang ? "text-gold-400 border-gold-400" : "text-pearl-300 border-onyx-700"
                    }`}
                  >
                    {langLabels[l]}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setOpen(false); showModal(); }}
                className="btn-solid-gold w-full mt-8 !flex"
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
