import campaignCalendarImage from "@shared/assets/campaignCalendar.webp";
import designAndBuildImage from "@shared/assets/designAndBuild.webp";
import flowArchitectureImage from "@shared/assets/flowArchitecture.webp";
import testingAndReportingImage from "@shared/assets/testingAndReporting.webp";
import Image from "next/image";

const SURFACE = "#F3F4F8";
const INK = "#12141F";

const WORKS = [
  {
    id: "flow",
    title: "Flow architecture",
    description:
      "Welcome, browse, cart, checkout, post-purchase, winback. Built as one connected system with logic that reflects how people actually buy from you.",
    tags: ["Welcome & browse flows", "Cart & checkout recovery", "Post-purchase sequences", "Winback & sunset logic", "Segment architecture"],
    background: "#2F5BFF",
    color: "#ffffff",
    muted: "rgba(255,255,255,0.72)",
    navTheme: "dark",
    image: {
      src: flowArchitectureImage,
      alt: "Flow architecture diagram",
      grayscale: false
    }
  },
  {
    id: "campaign",
    title: "Campaign calendar",
    description: "A planned month of sends: launches, offers, editorial and reactivation. Written, designed and scheduled by us, approved by you.",
    tags: ["Monthly send plan", "Copywriting", "Offer strategy", "Scheduling & QA", "SMS pairing"],
    background: "#FFD21F",
    color: INK,
    muted: "rgba(18,20,31,0.62)",
    navTheme: "light",
    image: {
      src: campaignCalendarImage,
      alt: "Campaign calendar planning",
      grayscale: false
    }
  },
  {
    id: "design",
    title: "Design & build",
    description: "On-brand templates that render everywhere, load fast and slay out of the promotions tab. Mobile first, because 70% of opens are.",
    tags: ["Template systems", "Mobile-first layouts", "Deliverability setup", "Accessible markup", "Brand guidelines"],
    background: "#171D4F",
    color: "#ffffff",
    muted: "rgba(255,255,255,0.7)",
    navTheme: "dark",
    image: {
      src: designAndBuildImage,
      alt: "Email design and template build",
      grayscale: true
    }
  },
  {
    id: "testing",
    title: "Testing & reporting",
    description: "Subject lines, offers, send times and flow timing tested against revenue per recipient. One report a month, in plain language.",
    tags: ["A/B test roadmap", "Revenue per recipient", "Flow timing tests", "List health tracking", "Monthly reporting"],
    background: "#0E1328",
    color: "#ffffff",
    muted: "rgba(255,255,255,0.7)",
    navTheme: "dark",
    image: {
      src: testingAndReportingImage,
      alt: "Testing and reporting analytics dashboard",
      grayscale: false
    }
  }
] as const;

type Work = (typeof WORKS)[number];

function WorkCard({ work, index }: { work: Work; index: number }) {
  return (
    <article
      data-nav-theme={work.navTheme === "light" ? "light" : undefined}
      className="sticky top-0 grid h-[50dvh] grid-rows-[auto_minmax(11rem,1fr)_auto] overflow-hidden shadow-[0_-18px_50px_rgba(18,20,31,0.18)] md:grid-cols-2 md:grid-rows-[1fr_auto]"
      style={{ zIndex: index + 1, background: work.background, color: work.color }}
    >
      <h3
        className="self-start px-6 pt-20 pb-6 font-extrabold tracking-[-0.045em] sm:px-10 sm:pb-8 md:col-start-1 md:row-start-1 md:px-12 md:pt-24 md:pb-0 lg:px-14 lg:pt-28"
        style={{ fontSize: "clamp(2.35rem, 6vw, 5.25rem)", lineHeight: 0.95, maxWidth: "14ch" }}
      >
        {work.title}
      </h3>

      <div className="relative mx-5 mb-6 min-h-0 overflow-hidden rounded-2xl bg-black/20 sm:mx-8 sm:mb-8 md:col-start-2 md:row-span-2 md:row-start-1 md:mx-0 md:mb-0 md:rounded-none">
        <Image
          src={work.image.src}
          alt={work.image.alt}
          fill
          priority
          sizes="(max-width: 767px) 100vw, 50vw"
          className={work.image.grayscale ? "object-cover grayscale" : "object-cover"}
          draggable={false}
        />
      </div>
    </article>
  );
}

export default function WhatWeDo() {
  return (
    <section id="what-we-do" className="relative isolate" style={{ background: SURFACE }}>
      <header data-nav-theme="light" className="relative z-0 px-4 pt-24 pb-4 sm:pt-28 sm:pb-6">
        <div className="flex items-center justify-center py-4 sm:py-6">
          <h2 className="text-center font-extrabold tracking-tighter text-[#111111]" style={{ fontSize: "clamp(3.25rem, 9vw, 6.75rem)", lineHeight: 0.95 }}>
            What we do
          </h2>
        </div>
      </header>

      {WORKS.map((work, index) => (
        <WorkCard key={work.id} work={work} index={index} />
      ))}
    </section>
  );
}
