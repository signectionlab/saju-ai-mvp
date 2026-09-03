"use client";

import { cn } from "@/lib/utils";
import { SERVICE_OPTIONS, type ServiceType } from "@/lib/types";

interface ServiceTypeSelectorProps {
  value: ServiceType;
  onChange: (type: ServiceType) => void;
}

export function ServiceTypeSelector({ value, onChange }: ServiceTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="font-sans text-[13px] font-semibold text-text-primary">상담 주제</p>
        <p className="mt-1 font-sans text-xs text-text-secondary">
          어떤 부분에 대해 상담받고 싶은지 선택해 주세요.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-1">
        {SERVICE_OPTIONS.map((service) => {
          const selected = value === service.id;
          return (
            <button
              key={service.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(service.id)}
              className={cn(
                "flex w-full gap-4 rounded-2xl border p-4 text-left transition-all",
                selected
                  ? "border-brand bg-brand/5 ring-1 ring-brand/30"
                  : "border-border bg-surface hover:border-brand/40 hover:bg-subtle/40",
              )}
            >
              <span
                className={cn(
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-3xl",
                  selected ? "bg-brand/10" : "bg-subtle",
                )}
                aria-hidden
              >
                {service.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif text-base font-semibold">{service.title}</h3>
                  {selected && (
                    <span className="shrink-0 rounded-full bg-brand px-2 py-0.5 font-sans text-[10px] font-semibold text-canvas">
                      선택됨
                    </span>
                  )}
                </div>
                <p className="mt-1 font-sans text-sm leading-relaxed text-text-secondary">
                  {service.description}
                </p>
                <p className="mt-2 font-sans text-xs text-text-secondary/80">{service.question}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function getServiceLabel(type: ServiceType): string {
  return SERVICE_OPTIONS.find((s) => s.id === type)?.title ?? "기본 사주";
}

export function getServiceEmoji(type: ServiceType): string {
  return SERVICE_OPTIONS.find((s) => s.id === type)?.emoji ?? "🔮";
}
