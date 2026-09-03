"use client";

import { Card } from "@/components/ui/Card";
import { ADVISOR_OPTIONS, type AdvisorStyle } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AdvisorStyleSwitchProps {
  value: AdvisorStyle;
  disabled?: boolean;
  onChange: (style: AdvisorStyle) => void;
  /** 결과 상단 헤더용 */
  variant?: "header" | "card";
}

export function AdvisorStyleSwitch({
  value,
  disabled,
  onChange,
  variant = "header",
}: AdvisorStyleSwitchProps) {
  const current = ADVISOR_OPTIONS.find((a) => a.id === value);

  const switchControl = (
    <div
      className={cn(
        "grid grid-cols-2 gap-1 rounded-xl border border-border bg-subtle p-1",
        variant === "header" ? "w-full min-w-[220px]" : "",
        disabled && "opacity-60",
      )}
      role="group"
      aria-label="상담가 유형 선택"
    >
      {ADVISOR_OPTIONS.map((opt) => {
        const selected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            disabled={disabled}
            aria-pressed={selected}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 rounded-lg font-sans transition-all",
              variant === "header" ? "px-3 py-2.5 text-sm" : "px-3 py-2 text-xs",
              selected
                ? opt.color === "hyeon"
                  ? "bg-advisor-hyeon text-canvas shadow-sm ring-1 ring-advisor-hyeon/40"
                  : "bg-advisor-on text-canvas shadow-sm ring-1 ring-advisor-on/40"
                : "text-text-secondary hover:bg-surface/80 hover:text-text-primary",
            )}
            onClick={() => onChange(opt.id)}
          >
            <span className={variant === "header" ? "text-lg" : "text-base"} aria-hidden>
              {opt.emoji}
            </span>
            <span className="font-semibold leading-tight">
              {opt.name} · {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );

  if (variant === "header") {
    return (
      <div className="w-full space-y-2 sm:w-auto">
        <p className="font-sans text-xs font-medium text-text-secondary">상담가 유형</p>
        {switchControl}
        <p className="font-sans text-[11px] leading-relaxed text-text-secondary">
          현재 {current?.emoji} {current?.name}({current?.hanja}) · 말하는 방식만 바뀌어요
        </p>
      </div>
    );
  }

  return (
    <Card className="space-y-3 border-border/80">
      <div>
        <p className="font-sans text-xs font-medium text-text-secondary">상담가 유형</p>
        <p className="mt-1 font-sans text-sm text-text-primary">
          현재{" "}
          <span className="font-semibold">
            {current?.emoji} {current?.name}({current?.hanja}) · {current?.label}
          </span>
        </p>
      </div>
      {switchControl}
      <p className="font-sans text-xs leading-relaxed text-text-secondary">
        스위치를 바꾸면 말하는 방식만 달라져요. 명식 계산과 핵심 해석은 그대로예요.
      </p>
    </Card>
  );
}
