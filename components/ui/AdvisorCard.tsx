"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AdvisorCardProps {
  name: string;
  hanja: string;
  label: string;
  emoji: string;
  image: string;
  imageFallback: string;
  summary: string;
  example: string;
  fit: readonly string[];
  color: "hyeon" | "on";
  selected?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

export function AdvisorCard({
  name,
  hanja,
  label,
  emoji,
  image,
  imageFallback,
  summary,
  example,
  fit,
  color,
  selected,
  compact,
  onClick,
}: AdvisorCardProps) {
  const variant = color;
  const [imgSrc, setImgSrc] = useState(image);

  const inner = (
    <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-5 sm:text-left">
      <div className="relative mb-4 shrink-0 sm:mb-0">
        <div
          className={cn(
            "relative h-24 w-24 overflow-hidden rounded-full border-2 shadow-lg",
            variant === "hyeon" ? "border-advisor-hyeon" : "border-advisor-on",
          )}
        >
          <Image
            src={imgSrc}
            alt={`${name} ${label} 상담가`}
            fill
            className="object-cover"
            unoptimized={imgSrc.endsWith(".svg")}
            onError={() => setImgSrc(imageFallback)}
          />
        </div>
        <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-base shadow-md">
          {emoji}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-lg font-semibold">
          {name} {hanja} · {label}
        </h3>
        <p className="mt-1 font-sans text-sm text-text-secondary">{summary}</p>
        {!compact && (
          <>
            <p className="mt-3 font-sans text-[15px] leading-relaxed text-text-primary">{example}</p>
            <p className="mt-3 font-sans text-xs text-text-secondary">추천: {fit.join(" · ")}</p>
          </>
        )}
      </div>
    </div>
  );

  const cardClass = cn(
    "rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)] transition-all md:p-6",
    variant === "hyeon" && "rounded-[var(--radius-card-hyeon)] border-advisor-hyeon/20 bg-advisor-hyeon-soft/20",
    variant === "on" && "rounded-[var(--radius-card-on)] border-advisor-on/20 bg-advisor-on-soft/20",
    selected && "ring-2 ring-brand ring-offset-2 ring-offset-canvas",
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-pressed={selected} className="w-full text-left">
        <div className={cardClass}>{inner}</div>
      </button>
    );
  }

  return <div className={cardClass}>{inner}</div>;
}
