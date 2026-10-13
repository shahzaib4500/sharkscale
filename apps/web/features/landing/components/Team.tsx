"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const IK_BASE = "https://ik.imagekit.io/isclzlt7q/humaan-v6-production/images/";
const IK_PARAMS = "?tr=w-456,h-560,q-80";

function ikImage(file: string): string {
  return IK_BASE + file + IK_PARAMS;
}

type Member = { name: string; role: string; image: string };

const members: Member[] = [
  { name: "Teegan", role: "Front-end Developer", image: ikImage("teegan-898106_8W3C1qCTk.jpg") },
  { name: "Sam", role: "Front-end Developer", image: ikImage("sam-694032_p55PEwgty.jpg") },
  { name: "Jay", role: "Founder & CEO", image: ikImage("jay-694037_NiFRHfcts.jpg") },
  { name: "Lee", role: "Technical Director", image: ikImage("lee-278426_0_RTv426f.jpg") },
  { name: "Janmay", role: "Mobile Developer", image: ikImage("Janmay__1fgD4B2D.jpg") },
  { name: "Niaal", role: "Agency Director", image: ikImage("niaal-694006_8enhClHjn.jpg") },
  { name: "Jodie", role: "Production Manager", image: ikImage("jodie-119355524838181_WXzi0_nfE.jpg") },
  { name: "Ross", role: "Back-end Developer", image: ikImage("ross-278438_TDeSH2knK.jpg") },
  { name: "Matt", role: "Back-end Developer", image: ikImage("matt-1302546_fTHhuKGSQ.jpg") },
  { name: "Dan", role: "Creative Director", image: ikImage("dan-694038_Rp6I5c4EF.jpg") },
  { name: "DT", role: "Back-end Developer", image: ikImage("dt-694039_JjuR13QgW.jpg") },
  { name: "Jess", role: "Designer", image: ikImage("ross-jess-289004_Cd807V1Pl.jpg") },
  { name: "Dedy", role: "Back-end Developer", image: ikImage("dedy-278440_S0uv3Re5v.jpg") },
  { name: "Jasmine", role: "Designer", image: ikImage("jasmine-292655_8C2hrOaCA.jpg") },
  { name: "Paul", role: "Implementation Director", image: ikImage("paul-278430_k4jUEP3w_.jpg") },
  { name: "Alistair", role: "SEO Specialist", image: ikImage("alistair-898108_cYfS_p1wQ.jpg") }
];

const COLUMN_COUNT = 4;

function buildColumns(): Member[][] {
  const columns: Member[][] = Array.from({ length: COLUMN_COUNT }, () => []);
  members.forEach((member, index) => {
    const column = columns[index % COLUMN_COUNT];
    if (column) {
      column.push(member);
    }
  });
  return columns;
}

function TeamCard({ member, cardRef }: { member: Member; cardRef: (el: HTMLDivElement | null) => void }) {
  return (
    <div ref={cardRef} className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "456 / 560", willChange: "transform, opacity" }}>
      <Image
        src={member.image}
        alt={member.name}
        fill
        draggable="false"
        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
        style={{ objectFit: "cover" }}
      />
      <div className="absolute inset-x-3 bottom-3 flex flex-col rounded-xl bg-white/90 px-4 py-2.5 backdrop-blur-sm">
        <span className="text-sm font-semibold text-tertiary sm:text-base">{member.name}</span>
        <span className="text-xs text-tertiary/60 sm:text-sm">{member.role}</span>
      </div>
    </div>
  );
}

export default function Team() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);
  const columns = buildColumns();

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (!section || cards.length === 0) {
      return;
    }

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true }
        });
      }

      gsap.set(cards, { y: 60, opacity: 0 });

      ScrollTrigger.batch(cards, {
        start: "top 88%",
        onEnter: (batch) => {
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.1,
            overwrite: true
          });
        }
      });

      // Scroll-linked parallax: alternate columns move at different speeds.
      const cols = columnRefs.current.filter((el): el is HTMLDivElement => el !== null);
      cols.forEach((col, columnIndex) => {
        const isEven = columnIndex % 2 === 0;
        gsap.fromTo(
          col,
          { y: isEven ? 0 : 60 },
          {
            y: isEven ? -160 : -40,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          }
        );
      });
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    const images = Array.from(section.querySelectorAll("img"));
    images.forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", refresh, { once: true });
      }
    });
    window.addEventListener("load", refresh);
    refresh();

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, []);

  let cardIndex = 0;

  return (
    <section
      ref={sectionRef}
      data-nav-theme="light"
      className="relative overflow-hidden px-6 pt-24 pb-40 sm:px-10 lg:px-16 lg:pb-48"
      style={{ background: "linear-gradient(180deg, #f5f0e8 0%, #f5f0e8 82%, #ffffff 100%)" }}
    >
      <div ref={headingRef} className="mx-auto mb-16 max-w-3xl text-center">
        <span className="text-xs font-bold uppercase tracking-[0.22em] text-tertiary/50">Our People</span>
        <h2 className="mt-4 text-4xl font-extrabold uppercase tracking-tight text-tertiary sm:text-5xl lg:text-6xl">Meet the Team</h2>
        <p className="mt-4 text-lg text-tertiary/60">The people behind the campaigns that scale your brand.</p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {columns.map((column, columnIndex) => (
          <div
            key={columnIndex}
            ref={(el) => {
              columnRefs.current[columnIndex] = el;
            }}
            className="flex flex-col gap-4 lg:gap-6"
          >
            {column.map((member) => {
              const index = cardIndex;
              cardIndex += 1;
              return (
                <TeamCard
                  key={member.name}
                  member={member}
                  cardRef={(el) => {
                    cardRefs.current[index] = el;
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
