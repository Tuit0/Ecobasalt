"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
  as?: "button" | "a" | "div";
  href?: string;
};

export default function MagneticButton({
  children,
  className = "",
  onClick,
  strength = 0.3,
  as = "button",
  href,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
    setPos({ x, y });
  };

  const onLeave = () => setPos({ x: 0, y: 0 });

  const inner = (
    <motion.div
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.4 }}
      style={{ display: "inline-flex" }}
    >
      {children}
    </motion.div>
  );

  if (as === "a" && href) {
    return (
      <a
        ref={ref as any}
        href={href}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={className}
        onClick={onClick}
      >
        {inner}
      </a>
    );
  }

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={className} onClick={onClick}>
      {inner}
    </div>
  );
}
