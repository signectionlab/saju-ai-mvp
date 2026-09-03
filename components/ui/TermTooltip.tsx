"use client";

import { cn } from "@/lib/utils";
import { getTermTip } from "@/lib/glossary";

interface TermTooltipProps {
  term: string;
  children?: React.ReactNode;
  className?: string;
}

export function TermTooltip({ term, children, className }: TermTooltipProps) {
  const tip = getTermTip(term);
  const label = children ?? term;

  if (!tip) {
    return <span className={className}>{label}</span>;
  }

  return (
    <span
      className={cn(
        "group/tip relative inline cursor-help border-b border-dotted border-text-secondary/40",
        className,
      )}
      tabIndex={0}
      aria-label={`${term}: ${tip}`}
    >
      {label}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-30 hidden w-[min(16rem,calc(100vw-2rem))] -translate-x-1/2",
          "rounded-lg border border-border bg-surface px-3 py-2 text-left font-sans text-xs font-normal leading-relaxed text-text-primary shadow-[var(--shadow-card)]",
          "group-hover/tip:block group-focus-within/tip:block",
        )}
      >
        <span className="mb-0.5 block font-semibold text-text-primary">{term}</span>
        {tip}
      </span>
    </span>
  );
}
