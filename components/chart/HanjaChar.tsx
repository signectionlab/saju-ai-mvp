import { cn } from "@/lib/utils";
import {
  getStemElement,
  getBranchElement,
  ELEMENT_TEXT_CLASS,
  ELEMENT_GLOW_CLASS,
} from "@/lib/elements";
import { branchReading, stemReading } from "@/lib/hanja-labels";

export function HanjaChar({
  char,
  type,
  className,
}: {
  char: string;
  type: "stem" | "branch";
  className?: string;
}) {
  const element = type === "stem" ? getStemElement(char) : getBranchElement(char);
  return (
    <span
      className={cn(
        "font-serif text-2xl font-semibold",
        ELEMENT_TEXT_CLASS[element],
        ELEMENT_GLOW_CLASS[element],
        className,
      )}
    >
      {char}
    </span>
  );
}

export function HanjaWithReading({
  char,
  type,
  reading,
  className,
}: {
  char: string;
  type: "stem" | "branch";
  reading?: string;
  className?: string;
}) {
  const label =
    type === "stem" ? stemReading(char, reading) : branchReading(char, reading);

  return (
    <span className={cn("inline-flex items-baseline justify-center gap-0.5", className)}>
      <HanjaChar char={char} type={type} className="text-xl md:text-2xl" />
      {label ? (
        <span className="font-sans text-sm font-medium text-text-secondary">({label})</span>
      ) : null}
    </span>
  );
}
