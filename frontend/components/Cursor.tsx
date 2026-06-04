"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const [variant, setVariant] = useState<"default" | "hover" | "text">("default");
  const [hidden, setHidden] = useState(true);

  const springConfig = { damping: 25, stiffness: 350, mass: 0.4 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const ringX = useSpring(mouseX, { damping: 20, stiffness: 150, mass: 0.5 });
  const ringY = useSpring(mouseY, { damping: 20, stiffness: 150, mass: 0.5 });

  useEffect(() => {
    // Touch device — cursor yashirinadi
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }
    setHidden(false);

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target?.closest) return;
      const interactive = target.closest("a, button, [role='button'], input, textarea, select, label");
      if (interactive) {
        const isText = target.closest("input, textarea, [contenteditable='true']");
        setVariant(isText ? "text" : "hover");
      } else {
        setVariant("default");
      }
    };

    const onLeave = () => setVariant("default");

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [mouseX, mouseY]);

  if (hidden) return null;

  return (
    <>
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            scale: variant === "hover" ? 0.5 : variant === "text" ? 0.3 : 1,
            width: variant === "text" ? "3px" : "8px",
            height: variant === "text" ? "20px" : "8px",
          }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-full"
        />
      </motion.div>

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            scale: variant === "hover" ? 1.6 : variant === "text" ? 0 : 1,
            opacity: variant === "text" ? 0 : 1,
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-9 h-9 rounded-full border border-pearl-100/50 backdrop-blur-sm"
          style={{ boxShadow: variant === "hover" ? "0 0 40px rgba(220, 38, 38, 0.4)" : "none" }}
        />
      </motion.div>
    </>
  );
}
