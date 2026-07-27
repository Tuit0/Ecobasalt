import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Features from "@/components/Features";
import CompanyStats from "@/components/CompanyStats";
import FeaturedProjects from "@/components/FeaturedProjects";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Features />
      <CompanyStats />
      <FeaturedProjects />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
