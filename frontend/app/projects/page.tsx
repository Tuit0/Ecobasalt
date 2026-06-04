import type { Metadata } from "next";
import Projects from "@/components/Projects";

export const metadata: Metadata = {
  title: "Loyihalar — ECO BASALT portfolio",
  description: "Magnit, Artel, Agro Cold va boshqa loyihalarimiz. O'zbekiston bo'ylab amalga oshirilgan binolar.",
  openGraph: {
    title: "ECO BASALT Loyihalar",
    description: "Bizning portfolio: 2500+ amalga oshirilgan loyihalar",
  },
};

export default function ProjectsPage() {
  return (
    <div className="pt-20">
      <Projects />
    </div>
  );
}
