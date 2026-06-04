import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Stats from "@/components/Stats";
import Features from "@/components/Features";
import Process from "@/components/Process";
import Products from "@/components/Products";
import Industries from "@/components/Industries";
import FeaturedProjects from "@/components/FeaturedProjects";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";
import Newsletter from "@/components/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Stats />
      <Features />
      <Process />
      <Products />
      <Industries />
      <FeaturedProjects />
      <Testimonials />
      <FinalCTA />
      <Newsletter />
    </>
  );
}
