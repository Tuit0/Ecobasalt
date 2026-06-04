import type { Metadata } from "next";
import Calculator from "@/components/Calculator";
import Comparison from "@/components/Comparison";

export const metadata: Metadata = {
  title: "Narx kalkulyatori — ECO BASALT",
  description: "Loyihangiz uchun sendvich panel narxini onlayn hisoblang. Qalinlik, maydon va mahsulot turini tanlang.",
  openGraph: {
    title: "Sendvich Panel Narx Kalkulyatori",
    description: "Tez va aniq onlayn hisoblagich",
  },
};

export default function CalculatorPage() {
  return (
    <div className="pt-20">
      <Calculator />
      <Comparison />
    </div>
  );
}
