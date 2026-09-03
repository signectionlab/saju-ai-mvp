import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "hyeon" | "on";
}

export function Card({ children, className, variant = "default" }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)] md:p-6",
        variant === "hyeon" && "rounded-[var(--radius-card-hyeon)] border-advisor-hyeon/20 bg-advisor-hyeon-soft/30",
        variant === "on" && "rounded-[var(--radius-card-on)] border-advisor-on/20 bg-advisor-on-soft/30",
        className,
      )}
    >
      {children}
    </div>
  );
}
