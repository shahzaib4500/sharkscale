"use client";
import fatimah from "@shared/assets/fatimah.webp";
import shazaib from "@shared/assets/shazaib.webp";
import yasir from "@shared/assets/yasir.webp";
import zarlish from "@shared/assets/zarlish.webp";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Member = { name: string; role: string; image: StaticImageData };

const members: Member[] = [
  { name: "Shahzaib Farooq", role: "Founder and CEO", image: shazaib },
  { name: "Yasir Khalil", role: "Co-founder and Marketing Lead", image: yasir },
  { name: "Zarlish Farooq", role: "Co-founder and Human Resource Lead", image: zarlish },
  { name: "Fatima Ali", role: "Human Resource Executive", image: fatimah }
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
    <div ref={cardRef} className="group relative overflow-hidden rounded-2xl" style={{ aspectRatio: "456 / 560", willChange: "transform, opacity" }}>
      <Image
        src={member.image}
        alt={member.name}
        fill
        draggable="false"
        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
        className="rounded-2xl transition-transform duration-500 ease-out group-hover:scale-95"
        style={{ objectFit: "cover" }}
      />
      <div className="absolute inset-x-3 bottom-3 flex flex-col rounded-xl bg-white/90 px-4 py-2.5 backdrop-blur-sm transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
        <span className="text-sm font-semibold text-[#12141F] sm:text-base">{member.name}</span>
        <span className="text-xs text-[#12141F]/60 sm:text-sm">{member.role}</span>
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
    <section ref={sectionRef} data-nav-theme="light" className="relative overflow-hidden bg-white px-6 pt-24 pb-40 sm:px-10 lg:px-16 lg:pb-48">
      <div ref={headingRef} className="mx-auto mb-16 max-w-3xl text-center">
        <span
          className="inline-block rounded-full border px-3.5 py-1.5 text-[12.5px] font-bold tracking-[0.02em]"
          style={{ color: "#123CE8", borderColor: "#123CE859" }}
        >
          Our people
        </span>
        <h2 className="mt-4 text-[clamp(32px,4.4vw,62px)] leading-[1.04] font-bold tracking-[-0.04em] text-[#12141F]">Meet Your Retention Team</h2>
        <p className="mt-4 text-lg" style={{ color: "rgba(18,20,31,0.6)" }}>
          The sharks behind the emails that scale your brand.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 pt-20 sm:pt-28 lg:grid-cols-4 lg:gap-6 lg:pt-36">
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
