import Hero from "@/components/Hero";
import Directions from "@/components/Directions";
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
      <Directions />
      <TrustBar />
      <Features />
      <CompanyStats />
      <FeaturedProjects />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
