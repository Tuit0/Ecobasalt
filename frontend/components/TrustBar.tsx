"use client";
import useSWR from "swr";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { fetcher } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { useSectionVisible } from "@/lib/section-visibility";

type Client = {
  id: number;
  name: string;
  logo_url?: string;
  website?: string;
  order: number;
};

export default function TrustBar() {
  const { lang } = useLang();
  const visible = useSectionVisible("trustbar");
  const { data: clients = [], isLoading } = useSWR<Client[]>("/api/clients", fetcher);

  if (!visible) return null;
  if (!isLoading && clients.length === 0) return null;

  // Doubled for seamless loop
  const looped = clients.length > 0 ? [...clients, ...clients, ...clients] : [];

  return (
    <section className="py-16 sm:py-20 bg-onyx-950 relative overflow-hidden border-y border-pearl-100/5">
      <div className="orb orb-red w-[500px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <span className="badge-pill mb-5">
            <Sparkles className="w-3 h-3" strokeWidth={2.5} />
            {t(lang, "trustbar.title")}
          </span>

          <h2 className="h-display text-pearl-100 text-2xl sm:text-3xl md:text-4xl text-balance">
            {lang === "uz" ? (
              <>320+ kompaniya <span className="text-gradient-red">ishonadi</span></>
            ) : lang === "ru" ? (
              <>320+ компаний <span className="text-gradient-red">нам доверяют</span></>
            ) : (
              <>320+ companies <span className="text-gradient-red">trust us</span></>
            )}
          </h2>
        </motion.div>
      </div>

      {/* Marquee */}
      <div
        className="relative overflow-hidden"
        style={{
          maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        }}
      >
        {isLoading ? (
          <div className="flex gap-6 px-8 justify-center">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton w-44 h-20 rounded-2xl shrink-0" />
            ))}
          </div>
        ) : (
          <motion.div
            className="flex gap-4 sm:gap-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, ease: "linear", repeat: Infinity }}
            style={{ width: "max-content" }}
          >
            {looped.map((c, i) => {
              const inner = c.logo_url ? (
                <img src={c.logo_url} alt={c.name} className="max-h-12 max-w-[140px] object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
              ) : (
                <span className="text-pearl-200 text-base sm:text-lg font-bold tracking-tight group-hover:text-pearl-100 transition-colors whitespace-nowrap">
                  {c.name}
                </span>
              );

              const cls = "group flex items-center justify-center min-w-[180px] sm:min-w-[220px] h-20 px-7 sm:px-9 rounded-2xl bg-pearl-100/[0.03] border border-pearl-100/8 backdrop-blur-sm hover:bg-pearl-100/[0.06] hover:border-gold-400/30 transition-all duration-500 shrink-0 hover:scale-105";

              return c.website ? (
                <a key={`${c.id}-${i}`} href={c.website} target="_blank" rel="noopener noreferrer" className={cls}>
                  {inner}
                </a>
              ) : (
                <div key={`${c.id}-${i}`} className={cls}>
                  {inner}
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
