import type { Metadata } from "next";
import Blog from "@/components/Blog";

export const metadata: Metadata = {
  title: "Blog — ECO BASALT yangiliklari",
  description: "Sandwich panel sanoati, texnik standartlar va loyiha tajribasi haqida maqolalar.",
  openGraph: {
    title: "ECO BASALT Blog",
    description: "Industry insights va texnik maqolalar",
  },
};

export default function BlogPage() {
  return (
    <div className="pt-20">
      <Blog />
    </div>
  );
}
