import { cn } from "@/lib/utils";

type BadgeBasis = "calculation" | "knowledge" | "counseling" | "uncertainty";

interface EvidenceBadgeProps {
  basis: BadgeBasis;
  confidence?: "high" | "medium" | "low";
  className?: string;
}

const labels: Record<BadgeBasis, string> = {
  calculation: "계산",
  knowledge: "명리 근거",
  counseling: "상담 제안",
  uncertainty: "불확실",
};

const styles: Record<BadgeBasis, string> = {
  calculation: "border-brand/30 bg-subtle text-text-secondary",
  knowledge: "border-advisor-hyeon/40 bg-advisor-hyeon-soft text-advisor-hyeon",
  counseling: "border-border bg-subtle text-text-secondary",
  uncertainty: "border-warning/40 bg-warning/10 text-warning",
};

export function EvidenceBadge({ basis, confidence, className }: EvidenceBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold",
        styles[basis],
        className,
      )}
    >
      {labels[basis]}
      {confidence && (
        <span className="font-normal opacity-80">
          · {confidence === "high" ? "높음" : confidence === "medium" ? "보통" : "낮음"}
        </span>
      )}
    </span>
  );
}
