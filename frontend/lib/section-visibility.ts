"use client";
import useSWR from "swr";
import { fetcher } from "./api";

type VisibilityMap = Record<string, boolean>;

// Backenddan barcha bo'lim ko'rinishlarini olib turadi
// section.{key}.visible content_block'lar bo'yicha
export function useSectionVisible(key: string): boolean {
  const { data } = useSWR<VisibilityMap>("/api/sections/visibility", fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: true,
  });
  // Default: ko'rinadi
  if (!data) return true;
  return data[key] !== false;
}
