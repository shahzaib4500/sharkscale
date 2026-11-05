import BookACallLazy from "@features/landing/components/BookACallLazy";
import BrandTicker from "@features/landing/components/BrandTicker";
import EmailEngineLazy from "@features/landing/components/EmailEngineLazy";
import FAQLazy from "@features/landing/components/FAQLazy";
import Hero from "@features/landing/components/Hero";
import OwnedChannelLazy from "@features/landing/components/OwnedChannelLazy";
import PartnerBandLazy from "@features/landing/components/PartnerBandLazy";
import ProcessLazy from "@features/landing/components/ProcessLazy";
import RevenueProofLazy from "@features/landing/components/RevenueProofLazy";
import ReviewsLazy from "@features/landing/components/ReviewsLazy";
import SocialProofLazy from "@features/landing/components/SocialProofLazy";
import TeamLazy from "@features/landing/components/TeamLazy";
import ToolsLazy from "@features/landing/components/ToolsLazy";
import WhatWeDoLazy from "@features/landing/components/WhatWeDoLazy";
import FooterLazy from "@shared/components/layout/FooterLazy";
import Navbar from "@shared/components/layout/Navbar";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <SocialProofLazy />
      <RevenueProofLazy />
      <section data-nav-theme="light" className="w-full bg-white py-8 sm:py-10">
        <BrandTicker className="mx-auto w-full max-w-260 px-4 sm:px-6" />
      </section>
      <WhatWeDoLazy />
      <PartnerBandLazy />
      <OwnedChannelLazy />
      <ProcessLazy />
      <ReviewsLazy />
      <EmailEngineLazy />
      <TeamLazy />
      <ToolsLazy />
      <FAQLazy />
      <div id="book-a-call" className="h-0 w-full scroll-mt-24" aria-hidden />
      <BookACallLazy />
      <FooterLazy />
    </main>
  );
}
