import NavbarWrapper from "@/src/components/NavbarWrapper";
import Header from "@/src/components/Header";
import CitiesSection from "@/src/features/cities/section/CitiesSection";
import BenefitSection from "@/src/components/BenefitSection";
import FreshSpaceSection from "@/src/features/offices/sections/FreshSpaceSectionNew";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OfficeHub - Find Your Perfect Office Space",
  description: "Browse and rent the best office spaces across Indonesia. From Jakarta to Surabaya, find your ideal workspace.",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7FD]">
      <NavbarWrapper />
      <Header />
      <CitiesSection />
      <BenefitSection />
      <FreshSpaceSection />
    </div>
  );
}