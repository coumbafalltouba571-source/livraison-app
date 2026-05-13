"use client";

import HeroSection from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import HowItWorks from "../components/HowItWorks";
import AdvantagesSection from "../components/AdvantagesSection";
import Footer from "../components/Footer";

export default function LandingPage() {
  const handleStartClick = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/commander";
    }
  };

  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <HowItWorks />
      <AdvantagesSection />
      <Footer />
    </main>
  );
}
