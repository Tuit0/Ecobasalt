"use client";
import { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type Props = {
  size?: number;
  color?: string;
  className?: string;
};

export default function CursorGradient({
  size = 600,
  color = "rgba(220, 38, 38, 0.18)",
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const x = useSpring(mouseX, { damping: 40, stiffness: 200, mass: 0.5 });
  const y = useSpring(mouseY, { damping: 40, stiffness: 200, mass: 0.5 });

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    // Touch device — orb yashirinadi
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };
    const onLeave = () => {
      mouseX.set(-1000);
      mouseY.set(-1000);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
        background: `radial-gradient(circle, ${color}, transparent 70%)`,
        filter: "blur(40px)",
        willChange: "transform",
      }}
    />
  );
}
