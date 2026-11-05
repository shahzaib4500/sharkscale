"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BLUE = "#123CE8";
const GOLD = "#FFD400";
const INK = "#0A1033";

const PHASES = [
  {
    no: "01",
    title: "Audit",
    when: "Days 1–3",
    body: "We go through your account, last 90 days of sends and your list health, then show you exactly where the money is leaking.",
    tags: ["Account audit", "List health", "Benchmarks"]
  },
  {
    no: "02",
    title: "Strategy",
    when: "Days 4–7",
    body: "Segment map, flow architecture and a 90-day campaign calendar, priced and prioritised by revenue impact.",
    tags: ["Segment map", "Flow architecture", "Calendar"]
  },
  {
    no: "03",
    title: "Build",
    when: "Days 8–14",
    body: "First core flows written, designed, built and QA-tested in your account. You approve, we ship.",
    tags: ["Copy", "Design", "QA & deploy"]
  },
  {
    no: "04",
    title: "Scale",
    when: "Ongoing",
    body: "Monthly campaigns, continuous flow testing and a report that ties every send back to revenue.",
    tags: ["Campaigns", "A/B testing", "Reporting"]
  }
] as const;

export default function Process() {
  const railRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const miniRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const update = () => {
        const rect = rail.getBoundingClientRect();
        const mid = window.innerHeight * 0.55;
        const progress = Math.max(0, Math.min(1, (mid - rect.top) / (rect.height || 1)));

        if (fillRef.current) {
          fillRef.current.style.height = `${progress * (rect.height - 16)}px`;
        }
        if (miniRef.current) {
          miniRef.current.style.width = `${progress * 100}%`;
        }
        if (pctRef.current) {
          pctRef.current.textContent = `${Math.round(progress * 100)}%`;
        }

        let activePhase = 1;
        phaseRefs.current.forEach((phase, index) => {
          if (!phase) {
            return;
          }
          const phaseRect = phase.getBoundingClientRect();
          const isOn = phaseRect.top < window.innerHeight * 0.72 && phaseRect.bottom > window.innerHeight * 0.14;
          phase.style.opacity = isOn ? "1" : "0.3";
          phase.style.transform = isOn ? "translateY(0)" : "translateY(22px)";
          if (isOn) {
            activePhase = index + 1;
          }
        });

        if (numberRef.current) {
          numberRef.current.textContent = String(activePhase).padStart(2, "0");
        }

        nodeRefs.current.forEach((node, index) => {
          if (!node) {
            return;
          }
          const nodeRect = node.getBoundingClientRect();
          const isOn = nodeRect.top + nodeRect.height / 2 <= mid;
          node.style.borderColor = isOn ? GOLD : "rgba(255,255,255,0.35)";
          node.style.backgroundColor = isOn ? GOLD : BLUE;
          node.style.boxShadow = isOn ? "0 0 30px rgba(255,212,0,0.6)" : "none";
          node.style.transform = isOn ? "scale(1.06)" : "scale(1)";

          const dot = dotRefs.current[index];
          if (dot) {
            dot.style.backgroundColor = isOn ? INK : "rgba(255,255,255,0.35)";
          }
        });
      };

      const trigger = ScrollTrigger.create({
        trigger: rail,
        start: "top bottom",
        end: "bottom top",
        onUpdate: update,
        onRefresh: update
      });

      update();

      return () => trigger.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="process" className="w-full px-6 py-20 sm:px-10 sm:py-28" style={{ backgroundColor: BLUE, color: "#ffffff" }}>
      <div className="mx-auto grid w-full max-w-345 items-start gap-14 lg:grid-cols-2">
        <div className="flex flex-col justify-center py-5 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:min-h-120">
          <p className="text-[clamp(70px,9vw,150px)] leading-[0.82] font-extrabold tracking-[-0.06em]">
            <span ref={numberRef}>01</span>
            <span className="ml-3.5 align-super text-[13px] font-normal tracking-[0.16em] text-white/55 uppercase">of 04</span>
          </p>

          <div className="mt-6.5 mb-5 flex items-center gap-3 text-[11.5px] font-medium tracking-[0.18em] uppercase" style={{ color: GOLD }}>
            <span className="h-px w-7" style={{ backgroundColor: GOLD }} />
            Process
          </div>

          <h2 className="max-w-[14ch] text-[clamp(33px,4.2vw,58px)] leading-[0.98] font-extrabold tracking-[-0.04em]">Four phases. No surprises.</h2>

          <p className="mt-5.5 max-w-100 text-base leading-relaxed text-white/70">
            Two weeks to your first live flow, then a steady monthly rhythm. You see work weekly, and nothing reaches your list without your approval.
          </p>

          <div className="mt-7.5 flex items-center gap-3.5 text-[11px] font-medium tracking-[0.14em] text-white/55 uppercase">
            <span>Phase progress</span>
            <span className="h-0.75 max-w-45 flex-1 overflow-hidden rounded-full bg-white/20">
              <span ref={miniRef} className="block h-0.75 w-0" style={{ backgroundColor: GOLD }} />
            </span>
            <span ref={pctRef}>0%</span>
          </div>
        </div>

        <div ref={railRef} className="relative pl-16">
          <div
            className="absolute top-2 bottom-2 left-4.75 w-1.5 rounded-full"
            style={{ background: "repeating-linear-gradient(rgba(255,255,255,0.32) 0 7px, transparent 7px 14px)" }}
          />
          <span
            ref={fillRef}
            className="absolute top-2 left-4.75 h-0 w-1.5 rounded-full"
            style={{ backgroundColor: GOLD, boxShadow: "0 0 26px rgba(255,212,0,0.7)" }}
          />

          {PHASES.map((phase, index) => (
            <div
              key={phase.no}
              ref={(el) => {
                phaseRefs.current[index] = el;
              }}
              className={`relative min-h-[38vh] ${index === PHASES.length - 1 ? "pb-6" : "pb-10"}`}
              style={{
                opacity: 0.3,
                transform: "translateY(22px)",
                transition: "opacity 0.5s cubic-bezier(0.2,0.7,0.2,1), transform 0.5s cubic-bezier(0.2,0.7,0.2,1)"
              }}
            >
              <span
                ref={(el) => {
                  nodeRefs.current[index] = el;
                }}
                className="absolute top-1 -left-16 flex size-11 items-center justify-center rounded-full border-2"
                style={{
                  borderColor: "rgba(255,255,255,0.35)",
                  backgroundColor: BLUE,
                  transition: "border-color 0.35s, background-color 0.35s, box-shadow 0.35s, transform 0.35s"
                }}
              >
                <span
                  ref={(el) => {
                    dotRefs.current[index] = el;
                  }}
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: "rgba(255,255,255,0.35)", transition: "background-color 0.35s" }}
                />
              </span>

              <div className="flex flex-wrap items-baseline gap-4.5">
                <span className="text-[clamp(34px,4vw,54px)] leading-none font-extrabold tracking-tighter text-white/28">{phase.no}</span>
                <h3 className="text-[clamp(24px,2.6vw,34px)] font-bold tracking-[-0.03em]">{phase.title}</h3>
                <span className="ml-auto text-[11px] font-medium tracking-[0.16em] whitespace-nowrap uppercase" style={{ color: GOLD }}>
                  {phase.when}
                </span>
              </div>

              <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-white/72">{phase.body}</p>

              <div className="mt-4.5 flex flex-wrap gap-2.5">
                {phase.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-white/78">
                    <span className="size-1.5 rounded-full" style={{ backgroundColor: GOLD }} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div className="relative flex flex-wrap items-center gap-4.5">
            <span
              className="absolute top-0 -left-16 flex size-11 items-center justify-center rounded-full"
              style={{ backgroundColor: GOLD, boxShadow: "0 0 34px rgba(255,212,0,0.55)" }}
            >
              <span className="relative block h-3.5 w-5 overflow-hidden rounded-[3px] border-2" style={{ borderColor: INK }}>
                <span
                  className="absolute -inset-x-px -top-px block h-2.25 origin-left"
                  style={{ borderBottom: `2px solid ${INK}`, transform: "skewY(26deg)" }}
                />
              </span>
            </span>
            <span className="text-[clamp(19px,2.1vw,26px)] font-bold tracking-tight">Beyond launch. Monthly campaigns, always on.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
