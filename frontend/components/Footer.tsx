"use client";
import useSWR from "swr";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
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

  // Sayt ishlab chiquvchi IT-kompaniya nomi (admin CMS'dan `contact.it_company` orqali o'zgartirish mumkin)
  const itCompanyName = pickLang(blocks["contact.it_company"], lang) || "Grepit";
  const itCompanyUrl = pickLang(blocks["contact.it_company_url"], lang) || "https://grepit.uz";

  // Manzil — kompaniya haqiqiy manzili (3 qatorda)
  const addressLines = lang === "uz"
    ? ["O'zbekiston, Namangan viloyati", "Chust tumani, Chust sh.", "Gulzor ko'chasi, 247"]
    : lang === "ru"
    ? ["Узбекистан, Наманганская обл.", "Чустский р-н, г. Чуст", "ул. Гулзор, 247"]
    : ["Uzbekistan, Namangan Region", "Chust District, Chust", "Gulzor St., 247"];

  return (
    <footer className="bg-onyx-950 pt-16 sm:pt-20 pb-8 border-t border-pearl-100/5 relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 mb-12 items-start">
          {/* Brand — kattaroq logo, o'ng ustunlar textiga nisbatan tik markazga joylashgan */}
          <div className="md:col-span-4 flex justify-center md:self-center">
            <Link href="/" className="flex flex-col items-center gap-4 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-full ring-2 ring-pearl-100/25 group-hover:ring-pearl-100/45 transition-all" />
                <Logo size={80} className="group-hover:rotate-12 transition-transform duration-500" />
              </div>
              <div
                className="font-bold text-gold-400 text-3xl tracking-tight"
                style={{ textShadow: "0 0 24px rgba(169, 29, 42, 0.4), 0 1px 0 rgba(0, 0, 0, 0.5)" }}
              >
                ECO BASALT
              </div>
            </Link>
            {/* Social ikonlar (Telegram/Instagram/YouTube) vaqtincha yashirilgan */}
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

          {/* Contacts — tekislangan, manzil 3 qatorda */}
          <div className="md:col-span-3">
            <div className="text-pearl-100 text-sm font-semibold mb-5">{t(lang, "footer.contacts")}</div>
            <ul className="space-y-3 text-pearl-200 text-sm">
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-gold-400 transition-colors flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-pearl-300 shrink-0" strokeWidth={2} />
                  <span>{phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="hover:text-gold-400 transition-colors flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-pearl-300 shrink-0" strokeWidth={2} />
                  <span className="break-all">{email}</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-pearl-200">
                <MapPin className="w-4 h-4 text-pearl-300 mt-0.5 shrink-0" strokeWidth={2} />
                <span className="leading-relaxed">
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
          <div className="font-medium flex items-center gap-1.5">
            <span>Made in Uzbekistan 🇺🇿</span>
            <span className="text-pearl-300/60">·</span>
            <span>{lang === "ru" ? "Разработано" : lang === "en" ? "Built by" : "Ishlab chiqildi"}</span>
            <a
              href={itCompanyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400 hover:text-gold-300 transition-colors font-semibold"
            >
              {itCompanyName}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
