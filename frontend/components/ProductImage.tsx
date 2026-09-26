"use client";
import { useLang } from "@/lib/lang-context";
import { DIRECTION_ICONS, DirectionSlug } from "./BrandIcons";

/**
 * Mahsulot rasmi. Admin paneldan rasm yuklanmagan bo'lsa —
 * brend uslubidagi joy egallovchi (yo'nalish ikonkasi + "Foto tez orada").
 */
export default function ProductImage({
  src,
  alt,
  category,
  className = "",
  imgClassName = "",
}: {
  src?: string | null;
  alt: string;
  category?: string;
  className?: string;
  imgClassName?: string;
}) {
  const { lang } = useLang();

  if (src) {
    return (
      <div className={`relative overflow-hidden bg-onyx-800 ${className}`}>
        <img src={src} alt={alt} className={`w-full h-full object-cover ${imgClassName}`} />
      </div>
    );
  }

  const Icon = DIRECTION_ICONS[(category as DirectionSlug)] || DIRECTION_ICONS.thermal;
  const label = lang === "uz" ? "Foto tez orada" : lang === "ru" ? "Фото скоро" : "Photo coming soon";

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-onyx-800 via-onyx-900 to-onyx-950 flex flex-col items-center justify-center ${className}`}
      role="img"
      aria-label={alt}
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #f5f1ec 0 1px, transparent 1px 14px)",
        }}
      />
      <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-gold-400/15 blur-3xl" />
      <Icon className="relative w-16 h-16 sm:w-20 sm:h-20 text-pearl-100/70" />
      <span className="relative mt-4 text-[11px] font-semibold tracking-[0.2em] uppercase text-pearl-300/70">
        {label}
      </span>
    </div>
  );
}
