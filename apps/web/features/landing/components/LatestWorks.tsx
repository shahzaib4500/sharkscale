"use client";
import work1 from "@shared/assets/work_1.webp";
import work2 from "@shared/assets/work_2.webp";
import work3 from "@shared/assets/work_3.webp";
import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

const TERTIARY = "#1b0a50";

type Project = {
  title: string;
  tagline: string;
  image: StaticImageData;
  accent: string;
};

const projects: Project[] = [
  { title: "E-Commerce Promotions", tagline: "Revenue & Retention", image: work1, accent: "#d97706" },
  { title: "Newsletter Management", tagline: "Audience Loyalty", image: work2, accent: "#7c3aed" },
  { title: "Analytics & Optimization", tagline: "A/B Testing & Insights", image: work3, accent: "#0891b2" }
] as const;

export default function LatestWorks() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="ourWork" data-nav-theme="light" style={{ background: "#ffffff", padding: "clamp(4rem, 8vw, 8rem) clamp(1.5rem, 5vw, 5rem)" }}>
      <div style={{ margin: "0 auto", maxWidth: "80rem" }}>
        <div style={{ marginBottom: "clamp(2rem, 4vw, 3.5rem)" }}>
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: TERTIARY + "80"
            }}
          >
            Selected Projects
          </span>
          <h2
            style={{
              marginTop: "0.75rem",
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: TERTIARY
            }}
          >
            Latest Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "clamp(2rem, 5vw, 5rem)", alignItems: "stretch" }}>
          <ul onMouseLeave={() => setActive(null)} style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {projects.map((project, index) => {
              const isActive = index === active;
              return (
                <li
                  key={project.title}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  style={{
                    borderTop: "1px solid " + TERTIARY + "18",
                    borderBottom: index === projects.length - 1 ? "1px solid " + TERTIARY + "18" : "none"
                  }}
                >
                  <a
                    href="#"
                    tabIndex={0}
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "clamp(1rem, 2vw, 2rem)",
                      padding: "clamp(1.25rem, 2.5vw, 2rem) 0.5rem",
                      textDecoration: "none",
                      transition: "padding-left 0.4s ease, opacity 0.4s ease",
                      paddingLeft: isActive ? "1.5rem" : "0.5rem",
                      opacity: active === null || isActive ? 1 : 0.35
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color: project.accent,
                        minWidth: "2rem"
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      <span
                        style={{
                          fontSize: "clamp(1.6rem, 4vw, 3rem)",
                          fontWeight: 800,
                          lineHeight: 1,
                          letterSpacing: "-0.03em",
                          color: TERTIARY
                        }}
                      >
                        {project.title}
                      </span>
                      <span
                        style={{
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: TERTIARY + "80"
                        }}
                      >
                        {project.tagline}
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Preview area — empty by default, shows tilted image on hover */}
          <div
            aria-hidden
            className="relative hidden md:block"
            style={{
              minHeight: "clamp(280px, 34vw, 460px)"
            }}
          >
            {projects.map((project, index) => {
              const isActive = index === active;
              const tilt = index % 2 === 0 ? 6 : -6;
              return (
                <div
                  key={project.title}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: "clamp(280px, 30vw, 420px)",
                    aspectRatio: "4 / 3",
                    borderRadius: "1rem",
                    overflow: "hidden",
                    boxShadow: "0 30px 70px -30px rgba(27,10,80,0.5)",
                    transformOrigin: "center",
                    transform: "translate(-50%, -50%) rotate(" + (isActive ? tilt : tilt * 0.4) + "deg) scale(" + (isActive ? 1 : 0.9) + ")",
                    opacity: isActive ? 1 : 0,
                    transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease",
                    pointerEvents: "none"
                  }}
                >
                  <Image src={project.image} alt="" fill sizes="420px" style={{ objectFit: "cover" }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
