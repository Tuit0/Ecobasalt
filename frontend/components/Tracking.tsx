"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView, sendHeartbeat } from "@/lib/api";

export default function Tracking() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  useEffect(() => {
    const id = setInterval(() => sendHeartbeat(pathname), 15000);
    sendHeartbeat(pathname);
    return () => clearInterval(id);
  }, [pathname]);

  return null;
}
