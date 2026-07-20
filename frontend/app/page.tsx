import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Features from "@/components/Features";
import CompanyStats from "@/components/CompanyStats";
import WhyEcoBasalt from "@/components/WhyEcoBasalt";
import FeaturedProjects from "@/components/FeaturedProjects";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";
import Newsletter from "@/components/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Features />
      <CompanyStats />
      <WhyEcoBasalt />
      <FeaturedProjects />
      <Testimonials />
      <FinalCTA />
      <Newsletter />
    </>
  );
}
