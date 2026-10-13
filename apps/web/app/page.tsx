import BookACallLazy from "@features/landing/components/BookACallLazy";
import Hero from "@features/landing/components/Hero";
import LatestWorksLazy from "@features/landing/components/LatestWorksLazy";
import ServicesShowcaseLazy from "@features/landing/components/ServicesShowcaseLazy";
import TeamLazy from "@features/landing/components/TeamLazy";
import ToolsLazy from "@features/landing/components/ToolsLazy";
import FooterLazy from "@shared/components/layout/FooterLazy";
import Navbar from "@shared/components/layout/Navbar";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <ServicesShowcaseLazy />
      <div
        aria-hidden
        style={{
          position: "relative",
          zIndex: 10,
          marginTop: "-8rem",
          height: "28rem",
          background:
            "linear-gradient(180deg, transparent 0%, #2b1470 18%, #46266f 30%, #664272 42%, #895f76 54%, #ac817d 64%, #c9a48f 74%, #e0cdb4 86%, #efe7d8 94%, #f5f0e8 100%)"
        }}
      />
      <TeamLazy />
      <ToolsLazy />
      <LatestWorksLazy />
      <BookACallLazy />
      <div
        aria-hidden
        style={{
          marginBottom: "-6rem",
          paddingBottom: "6rem",
          height: "16rem",
          background: "linear-gradient(180deg, #ffffff 0%, #efe9e0 20%, #d9c3b4 38%, #b48d86 54%, #7d5378 68%, #45256a 82%, #2a1358 92%, #1e0f52 100%)"
        }}
      />
      <FooterLazy />
    </main>
  );
}
