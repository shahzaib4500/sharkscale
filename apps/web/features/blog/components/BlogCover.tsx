import { getCoverSeed, safeHref, seededValue } from "@features/blog/lib/blogUtils";
import { colors } from "@shared/constants/colors";
import { cn } from "@shared/lib/utils";
import Image from "next/image";
import type { CSSProperties } from "react";

const BLUE = "#2F5BFF";

interface ArtProps {
  seed: number;
}

function EnvelopesArt({ seed }: ArtProps) {
  return (
    <>
      {[0, 1, 2].map((index) => {
        const x = 150 + index * 62 + seededValue(seed, index) * 16;
        const y = 64 + index * 34 - seededValue(seed, index + 3) * 18;
        const isFront = index === 2;
        return (
          <g key={index} transform={`rotate(${-8 + index * 6} ${x + 70} ${y + 45})`}>
            <rect
              x={x}
              y={y}
              width="140"
              height="92"
              rx="12"
              fill={isFront ? colors.secondary : colors.white}
              fillOpacity={isFront ? 1 : 0.14 + index * 0.08}
            />
            <path
              d={`M${x + 8} ${y + 10} L${x + 70} ${y + 54} L${x + 132} ${y + 10}`}
              fill="none"
              stroke={isFront ? colors.tertiary : colors.white}
              strokeOpacity={isFront ? 0.85 : 0.5}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );
      })}
      <circle cx="358" cy="62" r="17" fill={BLUE} />
      <text x="358" y="68" textAnchor="middle" fontSize="16" fontWeight="800" fill={colors.white}>
        {1 + Math.floor(seededValue(seed, 9) * 9)}
      </text>
    </>
  );
}

function BarsArt({ seed }: ArtProps) {
  return (
    <>
      {Array.from({ length: 7 }, (_, index) => {
        const height = 36 + index * 24 + seededValue(seed, index) * 18;
        const isLast = index === 6;
        return (
          <rect
            key={index}
            x={130 + index * 36}
            y={232 - height}
            width="24"
            height={height}
            rx="6"
            fill={isLast ? colors.secondary : colors.white}
            fillOpacity={isLast ? 1 : 0.12 + index * 0.08}
          />
        );
      })}
      <path d="M120 190 C190 170 230 120 290 104 S360 60 390 40" fill="none" stroke={BLUE} strokeWidth="5" strokeLinecap="round" />
      <circle cx="390" cy="40" r="8" fill={BLUE} />
    </>
  );
}

function OrbitArt({ seed }: ArtProps) {
  const cx = 270 + seededValue(seed, 0) * 70;
  const cy = 110 + seededValue(seed, 1) * 40;
  return (
    <>
      {[36, 72, 110, 150, 192].map((radius) => (
        <circle key={radius} cx={cx} cy={cy} r={radius} fill="none" stroke={colors.white} strokeOpacity="0.16" />
      ))}
      <circle cx={cx} cy={cy} r="16" fill={colors.secondary} />
      {[72, 110, 150].map((radius, index) => {
        const angle = seededValue(seed, index + 2) * Math.PI * 2;
        return (
          <circle
            key={radius}
            cx={cx + Math.cos(angle) * radius}
            cy={cy + Math.sin(angle) * radius}
            r={index === 1 ? 8 : 5}
            fill={index === 1 ? BLUE : colors.white}
          />
        );
      })}
    </>
  );
}

function WavesArt({ seed }: ArtProps) {
  return (
    <>
      {Array.from({ length: 6 }, (_, index) => {
        const lift = seededValue(seed, index) * 24;
        const y = 70 + index * 30;
        const isAccent = index === 3;
        return (
          <path
            key={index}
            d={`M100 ${y} C170 ${y - 40 - lift} 230 ${y + 40 + lift} 300 ${y} S400 ${y - 30} 430 ${y}`}
            fill="none"
            stroke={isAccent ? colors.secondary : colors.white}
            strokeOpacity={isAccent ? 1 : 0.18}
            strokeWidth={isAccent ? 6 : 3}
            strokeLinecap="round"
          />
        );
      })}
      <circle cx="330" cy="72" r="10" fill={BLUE} />
    </>
  );
}

const ART = [EnvelopesArt, BarsArt, OrbitArt, WavesArt];

interface BlogCoverProps {
  slug: string;
  imageUrl?: string | null;
  title?: string;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
  priority?: boolean;
}

/** An uploaded cover image, or on-brand generated artwork that's unique to the post. */
export default function BlogCover({
  slug,
  imageUrl,
  title = "",
  className,
  style,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false
}: BlogCoverProps) {
  const src = safeHref(imageUrl);
  const seed = getCoverSeed(slug);
  const Art = ART[seed % ART.length] ?? EnvelopesArt;

  return (
    <div className={cn("relative overflow-hidden bg-tertiary", className)} style={style}>
      {src ? (
        <Image
          src={src}
          alt={title}
          fill
          unoptimized
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div aria-hidden className="absolute inset-0" style={{ background: `linear-gradient(140deg, ${colors.primary} 0%, ${colors.tertiary} 65%)` }}>
          <div className="absolute -right-1/4 -top-1/3 aspect-square w-3/4 rounded-full blur-3xl" style={{ background: BLUE, opacity: 0.35 }} />
          <div className="absolute -bottom-1/2 -left-1/4 aspect-square w-2/3 rounded-full blur-3xl" style={{ background: colors.secondary, opacity: 0.12 }} />
          <svg
            viewBox="0 0 440 250"
            preserveAspectRatio="xMaxYMid slice"
            className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
          >
            <Art seed={seed} />
          </svg>
        </div>
      )}
    </div>
  );
}
