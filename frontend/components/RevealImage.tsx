"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type Props = {
  src: string;
  alt?: string;
  className?: string;
  aspectRatio?: string;
  direction?: "up" | "left" | "right";
};

export default function RevealImage({
  src,
  alt = "",
  className = "",
  aspectRatio = "aspect-[4/3]",
  direction = "up",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const clipPath =
    direction === "up"
      ? { initial: "inset(100% 0 0 0)", animate: "inset(0% 0 0 0)" }
      : direction === "left"
      ? { initial: "inset(0 100% 0 0)", animate: "inset(0 0% 0 0)" }
      : { initial: "inset(0 0 0 100%)", animate: "inset(0 0 0 0%)" };

  return (
    <div ref={ref} className={`relative overflow-hidden ${aspectRatio} ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        initial={{ clipPath: clipPath.initial, scale: 1.2 }}
        animate={inView ? { clipPath: clipPath.animate, scale: 1 } : {}}
        transition={{
          clipPath: { duration: 1.4, ease: [0.77, 0, 0.175, 1] },
          scale: { duration: 1.8, ease: [0.16, 1, 0.3, 1] },
        }}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
