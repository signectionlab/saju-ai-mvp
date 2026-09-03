import Image from "next/image";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  emoji: string;
  title: string;
  description: string;
  question: string;
  onClick: () => void;
  className?: string;
}

export function ServiceCard({ emoji, title, description, question, onClick, className }: ServiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center rounded-2xl border border-border bg-surface p-6 text-center transition-all",
        "hover:border-brand hover:shadow-[0_0_24px_rgba(154,136,104,0.12)]",
        className,
      )}
    >
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-subtle text-4xl transition-transform group-hover:scale-110">
        {emoji}
      </span>
      <h3 className="font-serif text-lg font-semibold">{title}</h3>
      <p className="mt-2 font-sans text-sm leading-relaxed text-text-secondary">{description}</p>
      <p className="mt-4 font-sans text-xs text-text-secondary">{question}</p>
    </button>
  );
}
