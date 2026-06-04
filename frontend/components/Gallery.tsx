"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Expand } from "lucide-react";
import Lightbox from "./Lightbox";

type Props = {
  images: string[];
  alt?: string;
  className?: string;
};

export default function Gallery({ images, alt = "", className = "" }: Props) {
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });

  if (!images.length) return null;

  const main = images[0];
  const rest = images.slice(1, 5);

  return (
    <>
      <div className={`grid grid-cols-1 sm:grid-cols-4 sm:grid-rows-2 gap-2 sm:gap-3 ${className}`} style={{ aspectRatio: "16 / 11" }}>
        {/* Main image — large left */}
        <button
          onClick={() => setLightbox({ open: true, index: 0 })}
          className="sm:col-span-3 sm:row-span-2 relative group overflow-hidden rounded-2xl sm:rounded-3xl bg-onyx-800 cursor-pointer"
        >
          <motion.img
            src={main}
            alt={alt}
            className="w-full h-full object-cover"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-onyx-950/0 group-hover:bg-onyx-950/30 transition-colors duration-500" />
          <div className="absolute top-4 right-4 w-11 h-11 rounded-full bg-onyx-950/80 backdrop-blur-xl border border-pearl-100/20 text-pearl-100 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 flex items-center justify-center transition-all duration-500">
            <Expand className="w-4 h-4" strokeWidth={2} />
          </div>
        </button>

        {/* Side thumbnails — 4 ta */}
        {rest.map((img, i) => (
          <button
            key={i}
            onClick={() => setLightbox({ open: true, index: i + 1 })}
            className="relative group overflow-hidden rounded-2xl bg-onyx-800 cursor-pointer hidden sm:block"
          >
            <img
              src={img}
              alt=""
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-onyx-950/30 group-hover:bg-onyx-950/0 transition-colors duration-500" />
            {/* If more images exist, show +N on last thumbnail */}
            {i === rest.length - 1 && images.length > 5 && (
              <div className="absolute inset-0 bg-onyx-950/70 backdrop-blur-sm flex items-center justify-center">
                <div className="text-pearl-100 text-xl sm:text-2xl font-bold">+{images.length - 5}</div>
              </div>
            )}
          </button>
        ))}
      </div>

      <Lightbox
        images={images}
        open={lightbox.open}
        initialIndex={lightbox.index}
        onClose={() => setLightbox({ ...lightbox, open: false })}
      />
    </>
  );
}
