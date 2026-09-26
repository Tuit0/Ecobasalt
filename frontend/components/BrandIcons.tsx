/**
 * ECO BASALT — maxsus yo'nalish ikonkalari (lucide shablonlari o'rniga).
 * Asosiy chiziqlar `currentColor`, aksent qismlar brend qizil rangida.
 */
type IconProps = { className?: string; accent?: string };

const ACCENT = "#c8323f";

/** Issiqlik izolyatsiyasi: bazalt tolali plitalar to'plami + to'xtatilgan issiqlik to'lqinlari */
export function ThermalIcon({ className = "", accent = ACCENT }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {/* Issiqlik to'lqinlari */}
      <path d="M15 14c-1.6-1.6 1.6-3.2 0-4.8s1.6-3.2 0-4.8" opacity={0.55} />
      <path d="M24 14c-1.6-1.6 1.6-3.2 0-4.8s1.6-3.2 0-4.8" stroke={accent} />
      <path d="M33 14c-1.6-1.6 1.6-3.2 0-4.8s1.6-3.2 0-4.8" opacity={0.55} />
      {/* Plitalar */}
      <rect x="6" y="18" width="36" height="7" rx="1.6" />
      <rect x="6" y="27.5" width="36" height="7" rx="1.6" stroke={accent} />
      <rect x="6" y="37" width="36" height="7" rx="1.6" />
      {/* Bazalt tolasi tuzilishi */}
      <path d="M10 31c2-1.6 4 1.6 6 0s4 1.6 6 0 4 1.6 6 0 4 1.6 6 0 4 1.6 4 0" stroke={accent} strokeWidth={1.3} />
      <path d="M10 21.5h6M20 21.5h9M33 21.5h5M10 40.5h9M23 40.5h5M32 40.5h6" strokeWidth={1.2} opacity={0.5} />
    </svg>
  );
}

/** Gidroponika: tosh paxta kubigidan o'sib chiqqan nihol, ichida ildizlar */
export function HydroponicsIcon({ className = "", accent = ACCENT }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {/* Kub */}
      <path d="M24 21 38 28 24 35 10 28Z" />
      <path d="M10 28v11l14 7V35M38 28v11l-14 7" />
      {/* Ildizlar */}
      <path d="M24 35v6M24 38l-3.5 2.5M24 38l3.5 2.5" stroke={accent} strokeWidth={1.3} opacity={0.85} />
      <path d="M13.5 33.5l3 1.5M13.5 37l3 1.5M34.5 33.5l-3 1.5M34.5 37l-3 1.5" strokeWidth={1.1} opacity={0.4} />
      {/* Nihol */}
      <path d="M24 28V11" />
      <path d="M24 17c-5.5 0-9.5-3.6-9.5-9.5 5.5 0 9.5 3.6 9.5 9.5Z" stroke={accent} fill={accent} fillOpacity={0.18} />
      <path d="M24 13.5c4.8 0 8.5-3 8.5-8.5-4.8 0-8.5 3-8.5 8.5Z" />
    </svg>
  );
}

/** Sendvich panel: profillangan metall qoplamalar orasida bazalt tolali yadro (kesim) */
export function PanelsIcon({ className = "", accent = ACCENT }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {/* Yuqori profil (trapetsiya to'lqinlari) */}
      <path d="M4 20h5l2.5-6h4l2.5 6h4l2.5-6h4l2.5 6h4l2.5-6h4l2.5 6H44" />
      {/* Yadro */}
      <path d="M4 20v14M44 20v14" />
      <path d="M8 24.5c2-1.6 4 1.6 6 0s4 1.6 6 0 4 1.6 6 0 4 1.6 6 0 4 1.6 6 0" stroke={accent} strokeWidth={1.3} />
      <path d="M8 29.5c2-1.6 4 1.6 6 0s4 1.6 6 0 4 1.6 6 0 4 1.6 6 0 4 1.6 6 0" stroke={accent} strokeWidth={1.3} opacity={0.6} />
      {/* Pastki tekis qoplama */}
      <path d="M4 34h40M4 37h40" />
      {/* Qulf birikmasi */}
      <path d="M44 25h2.5v4H44" opacity={0.6} />
    </svg>
  );
}

export const DIRECTION_ICONS = {
  thermal: ThermalIcon,
  hydroponics: HydroponicsIcon,
  panels: PanelsIcon,
} as const;

export type DirectionSlug = keyof typeof DIRECTION_ICONS;
