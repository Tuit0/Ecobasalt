"use client";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

type Props = {
  items: string[];
  speed?: number;
  className?: string;
};

export default function Marquee({ items, speed = 40, className = "" }: Props) {
  // Double items for seamless loop
  const doubled = [...items, ...items, ...items];

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-pearl-100/40 font-semibold text-2xl sm:text-3xl">
            <span>{item}</span>
            <Sparkles className="w-4 h-4 text-gold-400/60" strokeWidth={1.5} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
