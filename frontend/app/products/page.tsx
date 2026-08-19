import type { Metadata } from "next";
import { Suspense } from "react";
import Products from "@/components/Products";
import Comparison from "@/components/Comparison";

export const metadata: Metadata = {
  title: "Mahsulotlar — ECO BASALT sendvich panellar",
  description: "Sendvich panellar, bazalt izolyatsiya, bazalt tola. Yong'inga chidamli EI 240, ekologik, 50+ yil xizmat.",
  openGraph: {
    title: "ECO BASALT Mahsulotlar — Sendvich panel va izolyatsiya",
    description: "Premium bazalt panel mahsulotlari katalogi",
  },
};

export default function ProductsPage() {
  return (
    <div className="pt-20">
      <Suspense fallback={<div className="min-h-screen" />}>
        <Products />
      </Suspense>
      <Comparison />
    </div>
  );
}
