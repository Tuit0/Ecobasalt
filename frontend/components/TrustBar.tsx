"use client";
import useSWR from "swr";
import { motion } from "framer-motion";
import { fetcher } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

type Client = {
  id: number;
  name: string;
  logo_url?: string;
  website?: string;
  order: number;
};

export default function TrustBar() {
  const { lang } = useLang();
  const { data: clients = [], isLoading } = useSWR<Client[]>("/api/clients", fetcher);

  if (!isLoading && clients.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-onyx-950 border-y border-onyx-700 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-semibold mb-2">
            {t(lang, "trustbar.title")}
          </div>
          <div className="w-12 h-px bg-gold-400 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px bg-onyx-700">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-onyx-900 h-20 animate-pulse" />
              ))
            : clients.map((c, i) => {
                const inner = c.logo_url ? (
                  <img src={c.logo_url} alt={c.name} className="max-h-10 max-w-[80%] object-contain opacity-60 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <span className="text-pearl-300 text-sm font-bold tracking-[0.15em] group-hover:text-gold-400 transition-colors">
                    {c.name}
                  </span>
                );
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    className="bg-onyx-900 h-20 flex items-center justify-center group hover:bg-onyx-800 transition-colors cursor-default"
                  >
                    {c.website ? (
                      <a href={c.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
                        {inner}
                      </a>
                    ) : inner}
                  </motion.div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
