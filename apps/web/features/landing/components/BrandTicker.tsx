"use client";
import { cn } from "@shared/lib/utils";

const BRANDS = ["Verta", "Oakfield", "Northwell", "Basil & Co", "Ridgeway", "Marlow", "Lumen"] as const;

interface BrandTickerProps {
  label?: string;
  className?: string;
}

export default function BrandTicker({ label, className }: BrandTickerProps) {
  return (
    <div className={className}>
      {label && <p className="text-center text-[11px] font-medium tracking-[0.22em] text-neutral-400 uppercase">{label}</p>}

      <div className={cn("overflow-hidden", label && "mt-6")} style={{ maskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)" }}>
        <div className="brand-ticker-track flex w-max items-center gap-x-10 sm:gap-x-14">
          {[...BRANDS, ...BRANDS].map((brand, index) => (
            <span key={`${brand}-${index}`} className="shrink-0 text-[15px] font-semibold tracking-[-0.02em] text-neutral-400/90 sm:text-base">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
