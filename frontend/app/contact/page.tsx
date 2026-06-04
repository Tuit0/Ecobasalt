import type { Metadata } from "next";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Aloqa — ECO BASALT",
  description: "Bog'lanish: +998 90 123 45 67, info@ecobasalt.uz, Toshkent shahar. 24 soat ichida javob beramiz.",
};

export default function ContactPage() {
  return (
    <div className="pt-20">
      <Contact />
    </div>
  );
}
