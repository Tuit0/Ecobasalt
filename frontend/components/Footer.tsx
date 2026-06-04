"use client";
import useSWR from "swr";
import Link from "next/link";
import { Facebook, Instagram, Send as Telegram, Youtube } from "lucide-react";
import { fetcher, blocksToMap, pickLang } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import Logo from "./Logo";

export default function Footer() {
  const { lang } = useLang();
  const { data } = useSWR("/api/content/blocks?section=contact", fetcher);
  const blocks = blocksToMap(data || []);

  const phone = pickLang(blocks["contact.phone"], lang) || "+998 90 000 00 00";
  const email = pickLang(blocks["contact.email"], lang) || "info@basalt.uz";
  const address = pickLang(blocks["contact.address"], lang) || "Toshkent, O'zbekiston";
  const tg = pickLang(blocks["contact.telegram"], lang) || "https://t.me/basalt_uz";
  const ig = pickLang(blocks["contact.instagram"], lang) || "https://instagram.com/basalt.uz";
  const fb = pickLang(blocks["contact.facebook"], lang) || "#";
  const yt = pickLang(blocks["contact.youtube"], lang) || "#";

  const socials = [
    { href: tg, icon: Telegram },
    { href: ig, icon: Instagram },
    { href: fb, icon: Facebook },
    { href: yt, icon: Youtube },
  ].filter((s) => s.href !== "#");

  return (
    <footer className="bg-onyx-950 border-t border-onyx-700 pt-12 sm:pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 sm:gap-10 mb-10 sm:mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <Logo size={48} />
              <div>
                <div className="font-display font-bold text-pearl-100 text-lg tracking-[0.15em] leading-none">ECO BASALT</div>
                <div className="text-[9px] text-gold-400 font-semibold tracking-[0.25em] uppercase mt-1.5">Fire · Eco · Mineral</div>
              </div>
            </div>
            <p className="text-pearl-300 text-sm leading-relaxed max-w-md">
              {t(lang, "footer.tagline")}
            </p>

            {socials.length > 0 && (
              <div className="flex gap-2 mt-6">
                {socials.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 border border-onyx-700 flex items-center justify-center hover:border-gold-400 hover:bg-gold-400 group transition-all"
                    >
                      <Icon className="w-4 h-4 text-pearl-200 group-hover:text-pearl-100 transition-colors" strokeWidth={1.8} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Products */}
          <div className="md:col-span-3">
            <div className="text-[10px] text-gold-400 tracking-[0.2em] uppercase font-semibold mb-4">{t(lang, "footer.products")}</div>
            <ul className="space-y-3 text-pearl-200 text-sm">
              <li><Link href="/products" className="hover:text-gold-400 transition-colors">{t(lang, "footer.panels")}</Link></li>
              <li><Link href="/products" className="hover:text-gold-400 transition-colors">{t(lang, "footer.rockwool")}</Link></li>
              <li><Link href="/products" className="hover:text-gold-400 transition-colors">{t(lang, "footer.fiber")}</Link></li>
              <li><Link href="/calculator" className="hover:text-gold-400 transition-colors">{t(lang, "nav.calculator")}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <div className="text-[10px] text-gold-400 tracking-[0.2em] uppercase font-semibold mb-4">{t(lang, "footer.company")}</div>
            <ul className="space-y-3 text-pearl-200 text-sm">
              <li><Link href="/about" className="hover:text-gold-400 transition-colors">{t(lang, "footer.about")}</Link></li>
              <li><Link href="/projects" className="hover:text-gold-400 transition-colors">{t(lang, "footer.projects")}</Link></li>
              <li><Link href="/faq" className="hover:text-gold-400 transition-colors">{t(lang, "nav.faq")}</Link></li>
              <li><Link href="/contact" className="hover:text-gold-400 transition-colors">{t(lang, "footer.contact")}</Link></li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="md:col-span-2">
            <div className="text-[10px] text-gold-400 tracking-[0.2em] uppercase font-semibold mb-4">{t(lang, "footer.contacts")}</div>
            <ul className="space-y-3 text-pearl-200 text-sm">
              <li><a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-gold-400 transition-colors block">{phone}</a></li>
              <li><a href={`mailto:${email}`} className="hover:text-gold-400 transition-colors block">{email}</a></li>
              <li className="text-pearl-300">{address}</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-onyx-700 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-pearl-300">
          <div>© {new Date().getFullYear()} ECO BASALT — {t(lang, "footer.rights")}</div>
          <div className="font-mono text-[10px]">{t(lang, "footer.made")}</div>
        </div>
      </div>
    </footer>
  );
}
