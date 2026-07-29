"use client";
import useSWR from "swr";
import Link from "next/link";
import { Facebook, Instagram, Send as Telegram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { fetcher, blocksToMap, pickLang } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import Logo from "./Logo";

export default function Footer() {
  const { lang } = useLang();
  const { data } = useSWR("/api/content/blocks?section=contact", fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  });
  const blocks = blocksToMap(data || []);

  const phone = pickLang(blocks["contact.phone"], lang) || "+998 55 510 26 88";
  const email = pickLang(blocks["contact.email"], lang) || "info@uzecobasalt.uz";
  const tg = pickLang(blocks["contact.telegram"], lang) || "https://t.me/eco_basalt";
  const ig = pickLang(blocks["contact.instagram"], lang) || "https://instagram.com/eco.basalt";
  const fb = pickLang(blocks["contact.facebook"], lang) || "#";
  const yt = pickLang(blocks["contact.youtube"], lang) || "#";

  const socials = [
    { href: tg, Icon: Telegram, color: "hover:bg-[#229ED9]/20 hover:border-[#229ED9]/50 hover:text-[#229ED9]" },
    { href: ig, Icon: Instagram, color: "hover:bg-[#e6683c]/20 hover:border-[#e6683c]/50 hover:text-[#e6683c]" },
    { href: fb, Icon: Facebook, color: "hover:bg-[#1877f2]/20 hover:border-[#1877f2]/50 hover:text-[#1877f2]" },
    { href: yt, Icon: Youtube, color: "hover:bg-[#ff0000]/20 hover:border-[#ff0000]/50 hover:text-[#ff0000]" },
  ].filter((s) => s.href !== "#");

  // Manzil — kompaniya haqiqiy manzili (3 qatorda)
  const addressLines = lang === "uz"
    ? ["O'zbekiston, Namangan viloyati,", "Chust tumani, Chust sh.,", "Gulzor ko'chasi, 247-uy"]
    : lang === "ru"
    ? ["Узбекистан, Наманганская область,", "Чустский район, г. Чуст,", "улица Гульзор, дом 247"]
    : ["Uzbekistan, Namangan Region,", "Chust District, Chust,", "247 Gulzor Street"];

  return (
    <footer className="bg-onyx-950 pt-16 sm:pt-20 pb-8 border-t border-pearl-100/5 relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 sm:gap-10 mb-12">
          {/* Brand — simplified logo (no tagline, no description, socials directly under) */}
          <div className="col-span-2 md:col-span-5">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <Logo size={52} className="group-hover:rotate-12 transition-transform duration-500" />
              <div className="font-bold text-gold-400 text-2xl tracking-tight">ECO BASALT</div>
            </Link>

            {socials.length > 0 && (
              <div className="flex gap-2">
                {socials.map((s, i) => {
                  const Icon = s.Icon;
                  return (
                    <a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-full bg-pearl-100/5 border border-pearl-100/10 flex items-center justify-center text-pearl-200 transition-all duration-300 ${s.color}`}
                    >
                      <Icon className="w-4 h-4" strokeWidth={1.8} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Products */}
          <div className="md:col-span-3">
            <div className="text-pearl-100 text-sm font-semibold mb-5">{t(lang, "footer.products")}</div>
            <ul className="space-y-3 text-pearl-200 text-sm">
              <li><Link href="/products?cat=thermal" className="hover:text-gold-400 transition-colors">
                {lang === "uz" ? "Issiqlik izolyatsiya materiallari" : lang === "ru" ? "Теплоизоляционные материалы" : "Thermal insulation materials"}
              </Link></li>
              <li><Link href="/products?cat=hydroponics" className="hover:text-gold-400 transition-colors">
                {lang === "uz" ? "Gidroponika substratlari" : lang === "ru" ? "Гидропонные субстраты" : "Hydroponic substrates"}
              </Link></li>
              <li><Link href="/downloads" className="hover:text-gold-400 transition-colors">
                {lang === "uz" ? "Texnik hujjatlar" : lang === "ru" ? "Техническая документация" : "Technical documentation"}
              </Link></li>
              <li><Link href="/downloads" className="hover:text-gold-400 transition-colors">
                {lang === "uz" ? "Katalogni yuklab olish" : lang === "ru" ? "Скачать каталог" : "Download catalog"}
              </Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <div className="text-pearl-100 text-sm font-semibold mb-5">{t(lang, "footer.company")}</div>
            <ul className="space-y-3 text-pearl-200 text-sm">
              <li><Link href="/about" className="hover:text-gold-400 transition-colors">
                {lang === "uz" ? "Kompaniya haqida" : lang === "ru" ? "О компании" : "About us"}
              </Link></li>
              <li><Link href="/about#production" className="hover:text-gold-400 transition-colors">
                {lang === "uz" ? "Ishlab chiqarish" : lang === "ru" ? "Производство" : "Production"}
              </Link></li>
              <li><Link href="/about#geography" className="hover:text-gold-400 transition-colors">
                {lang === "uz" ? "Yetkazib berish geografiyasi" : lang === "ru" ? "География поставок" : "Delivery geography"}
              </Link></li>
              <li><Link href="/contact" className="hover:text-gold-400 transition-colors">
                {lang === "uz" ? "Aloqa" : lang === "ru" ? "Контакты" : "Contacts"}
              </Link></li>
            </ul>
          </div>

          {/* Contacts — new address (3 lines) */}
          <div className="md:col-span-2">
            <div className="text-pearl-100 text-sm font-semibold mb-5">{t(lang, "footer.contacts")}</div>
            <ul className="space-y-3 text-pearl-200 text-sm">
              <li><a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-gold-400 transition-colors flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 mt-0.5 shrink-0" strokeWidth={2} />
                <span>{phone}</span>
              </a></li>
              <li><a href={`mailto:${email}`} className="hover:text-gold-400 transition-colors flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 mt-0.5 shrink-0" strokeWidth={2} />
                <span className="break-all">{email}</span>
              </a></li>
              <li className="flex items-start gap-2 text-pearl-200">
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" strokeWidth={2} />
                <span>
                  {addressLines.map((line, i) => (
                    <span key={i} className="block">{line}</span>
                  ))}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-pearl-100/5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-pearl-300">
          <div>© {new Date().getFullYear()} ECO BASALT — {t(lang, "footer.rights")}</div>
          <div className="font-medium">Made in Uzbekistan 🇺🇿</div>
        </div>
      </div>
    </footer>
  );
}
