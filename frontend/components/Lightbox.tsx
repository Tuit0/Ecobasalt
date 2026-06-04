"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

type Props = {
  images: string[];
  open: boolean;
  initialIndex?: number;
  onClose: () => void;
};

export default function Lightbox({ images, open, initialIndex = 0, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
    setZoomed(false);
  }, [images.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
    setZoomed(false);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " ") {
        e.preventDefault();
        setZoomed((z) => !z);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[200] bg-onyx-950/95 backdrop-blur-xl flex items-center justify-center"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-pearl-100/10 backdrop-blur-xl border border-pearl-100/20 text-pearl-100 hover:bg-pearl-100/20 flex items-center justify-center transition-all"
          aria-label="Close"
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>

        {/* Counter + Zoom */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10 flex items-center gap-2">
          <div className="badge-pill bg-onyx-900/80 backdrop-blur-xl border-pearl-100/15 text-pearl-100 tabular">
            {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </div>
          <button
            onClick={() => setZoomed((z) => !z)}
            className="w-10 h-10 rounded-full bg-pearl-100/10 backdrop-blur-xl border border-pearl-100/15 text-pearl-100 hover:bg-pearl-100/20 flex items-center justify-center transition-all"
            aria-label="Zoom"
          >
            {zoomed ? <ZoomOut className="w-4 h-4" strokeWidth={2} /> : <ZoomIn className="w-4 h-4" strokeWidth={2} />}
          </button>
        </div>

        {/* Prev */}
        {images.length > 1 && (
          <button
            onClick={prev}
            className="absolute left-3 sm:left-6 z-10 w-11 sm:w-14 h-11 sm:h-14 rounded-full bg-pearl-100/10 backdrop-blur-xl border border-pearl-100/15 text-pearl-100 hover:bg-pearl-100/20 hover:scale-110 flex items-center justify-center transition-all"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" strokeWidth={2.5} />
          </button>
        )}

        {/* Image */}
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: zoomed ? 1.6 : 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[90vw] max-h-[85vh] flex items-center justify-center cursor-zoom-in"
          onClick={() => setZoomed((z) => !z)}
          style={{ cursor: zoomed ? "zoom-out" : "zoom-in" }}
        >
          <img
            src={images[index]}
            alt=""
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          />
        </motion.div>

        {/* Next */}
        {images.length > 1 && (
          <button
            onClick={next}
            className="absolute right-3 sm:right-6 z-10 w-11 sm:w-14 h-11 sm:h-14 rounded-full bg-pearl-100/10 backdrop-blur-xl border border-pearl-100/15 text-pearl-100 hover:bg-pearl-100/20 hover:scale-110 flex items-center justify-center transition-all"
            aria-label="Next"
          >
            <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" strokeWidth={2.5} />
          </button>
        )}

        {/* Bottom thumbnails (desktop) */}
        {images.length > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2 max-w-[90vw] overflow-x-auto p-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => { setIndex(i); setZoomed(false); }}
                className={`shrink-0 w-14 sm:w-16 h-10 sm:h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  i === index
                    ? "border-gold-400 scale-110 shadow-lg shadow-gold-400/30"
                    : "border-pearl-100/20 opacity-50 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
