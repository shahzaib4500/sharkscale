"use client";
import { colors } from "@shared/constants/colors";
import { cn } from "@shared/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const GOLD = colors.secondary;
const INK = colors.tertiary;
const WHITE = colors.white;

const SCROLL_DURATION_S = 52;

type Review = {
  id: string;
  brand: string;
  author: string;
  quote: string;
};

const REVIEWS: Review[] = [
  {
    id: "herbellavita",
    brand: "HerbellaVita",
    author: "Laura M., Founder",
    quote:
      "We were getting sales, but email wasn’t doing enough. SharkScale rebuilt our flows, improved our campaigns, and started using our customer data properly. Now email drives 36%+ of our total revenue. We’re simply making more from the customers we already have."
  },
  {
    id: "sleep-on",
    brand: "Sleep-On",
    author: "Marcus Hill, Founder",
    quote:
      "Our biggest problem was repeat purchases. People bought once, then we barely spoke to them again. SharkScale built the post-purchase, replenishment, and winback journeys we were missing. Email finally feels like a retention channel, not just another place to send discounts."
  },
  {
    id: "xpand-laces",
    brand: "XPAND Laces",
    author: "Ryan Cooper, Co-Founder",
    quote:
      "We had a big customer list, but everyone was basically getting the same emails. SharkScale changed that. New customers, repeat buyers, VIPs, and inactive customers now get completely different journeys. The whole account feels smarter, and the numbers followed."
  },
  {
    id: "omg-commerce",
    brand: "OMG Commerce",
    author: "Jason Miller, Founder",
    quote:
      "I didn’t want another agency sending pretty emails and calling it strategy. SharkScale actually looks at AOV, LTV, segments, flow performance, and revenue per recipient. We finally know what’s working, what isn’t, and what we should test next."
  },
  {
    id: "noura-skin",
    brand: "Noura Skin",
    author: "Amelia Reed, Founder",
    quote:
      "We thought we needed more traffic. Turns out, we needed to do more with the traffic we already had. SharkScale found gaps across our welcome, cart, post-purchase, and winback flows. There was revenue sitting there, we just weren’t capturing it."
  },
  {
    id: "mellow-labs",
    brand: "Mellow Labs",
    author: "Chris Bennett, Co-Founder",
    quote:
      "Our Klaviyo had become a mess after years of adding random flows and segments. SharkScale cleaned everything up and gave every email a purpose. Now we have a system we actually understand, and customers get messages that make sense for where they are."
  },
  {
    id: "bare-theory",
    brand: "Bare Theory",
    author: "Sophie Grant, Founder",
    quote:
      "The designs were the first thing we noticed. They actually looked like our brand. But what impressed me more was the thinking behind them. Every campaign has an audience, an angle, and a reason to send. Nothing feels like filler anymore."
  },
  {
    id: "sunday-supply",
    brand: "Sunday Supply",
    author: "Daniel Brooks, Founder",
    quote:
      "We were way too dependent on paid ads. SharkScale helped us focus on the second and third purchase instead of constantly chasing the first. Better segmentation and retention flows have made our existing customer base much more valuable."
  },
  {
    id: "north-bloom",
    brand: "North & Bloom",
    author: "Emma Carter, Co-Founder",
    quote:
      "Before SharkScale, campaigns were basically: ‘What should we send this week?’ Now there’s an actual calendar built around customer behavior, products, segments, and business goals. It feels less like email marketing and more like a real growth channel."
  }
];

const COLUMN_REVIEWS: Review[][] = [
  [REVIEWS[0], REVIEWS[3], REVIEWS[6]].filter((r): r is Review => r !== undefined),
  [REVIEWS[1], REVIEWS[4], REVIEWS[7]].filter((r): r is Review => r !== undefined),
  [REVIEWS[2], REVIEWS[5], REVIEWS[8]].filter((r): r is Review => r !== undefined)
];

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex flex-none flex-col rounded-xl border border-white/12 bg-white/[0.06] p-4 backdrop-blur-sm sm:p-5">
      <p className="text-[13px] font-bold tracking-[-0.02em] text-white sm:text-sm">
        {review.brand}
        <span className="font-normal text-white/45"> — </span>
        <span className="font-semibold text-white/75">{review.author}</span>
      </p>
      <blockquote className="mt-3 text-[12.5px] leading-[1.55] text-white/82 sm:text-[13px]">&ldquo;{review.quote}&rdquo;</blockquote>
    </article>
  );
}

function ScrollingReviewColumn({ reviews, delayOffsetS }: { reviews: Review[]; delayOffsetS: number }) {
  const loop = [...reviews, ...reviews];

  return (
    <div className="relative min-h-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
      <div className="reviews-scroll-up flex flex-col gap-3 sm:gap-4" style={{ animationDelay: `${delayOffsetS}s` }}>
        {loop.map((review, index) => (
          <ReviewCard key={`${review.id}-${index}`} review={review} />
        ))}
      </div>
    </div>
  );
}

export default function Reviews() {
  const wrapperRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const sticky = stickyRef.current;
    if (!wrapper || !sticky) {
      return;
    }

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (headingRef.current) {
        gsap.set(headingRef.current, { scale: 1, y: 0, color: INK, transformOrigin: "center top" });
      }
      if (bgRef.current) {
        gsap.set(bgRef.current, { backgroundColor: GOLD });
      }
      if (reviewsRef.current) {
        gsap.set(reviewsRef.current, { opacity: 0, y: 72 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "+=72%",
          pin: sticky,
          scrub: 0.35,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress < 0.55) {
              sticky.setAttribute("data-nav-theme", "light");
            } else {
              sticky.removeAttribute("data-nav-theme");
            }
          }
        }
      });

      if (headingRef.current) {
        tl.fromTo(headingRef.current, { scale: 1, y: 0 }, { scale: 0.4, y: -20, ease: "none", duration: 0.38, transformOrigin: "center top" }, 0);
        tl.fromTo(headingRef.current, { color: INK }, { color: WHITE, ease: "none", duration: 0.2 }, 0.14);
      }

      if (bgRef.current) {
        tl.fromTo(bgRef.current, { backgroundColor: GOLD }, { backgroundColor: INK, ease: "none", duration: 0.24 }, 0.1);
      }

      if (reviewsRef.current) {
        tl.fromTo(reviewsRef.current, { opacity: 0, y: 72 }, { opacity: 1, y: 0, ease: "none", duration: 0.22 }, 0.22);
      }

      ScrollTrigger.refresh();

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      if (bgRef.current) {
        gsap.set(bgRef.current, { backgroundColor: INK });
      }
      if (headingRef.current) {
        gsap.set(headingRef.current, { color: WHITE, scale: 0.4, y: -20, transformOrigin: "center top" });
      }
      if (reviewsRef.current) {
        gsap.set(reviewsRef.current, { opacity: 1, y: 0 });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={wrapperRef} id="reviews" className="relative w-full">
      <style>{`
        @keyframes reviews-scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .reviews-scroll-up {
          animation: reviews-scroll-up ${SCROLL_DURATION_S}s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .reviews-scroll-up {
            animation: none;
          }
        }
      `}</style>

      <div ref={stickyRef} className="flex h-screen w-full flex-col overflow-hidden px-4 pt-24 pb-6 sm:px-8 sm:pt-28 sm:pb-8">
        <div ref={bgRef} className="absolute inset-0 -z-10" style={{ backgroundColor: GOLD }} />

        <div ref={headingRef} className="w-full shrink-0 text-center" style={{ color: INK, willChange: "transform" }}>
          <h2 className="text-[12.4vw] leading-[0.9] font-black tracking-tighter uppercase motion-reduce:text-[6.5vw]">Reviews</h2>
        </div>

        <div
          ref={reviewsRef}
          className={cn("mt-5 grid min-h-0 flex-1 grid-cols-3 items-stretch gap-2 sm:mt-7 sm:gap-4")}
          style={{ willChange: "transform, opacity" }}
        >
          {COLUMN_REVIEWS.map((columnReviews, index) => (
            <ScrollingReviewColumn key={index} reviews={columnReviews} delayOffsetS={index * -17} />
          ))}
        </div>
      </div>
    </section>
  );
}
