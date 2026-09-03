import type { ChartJSON } from "@/packages/saju-engine/schema";
import { cn } from "@/lib/utils";
import { formatElementLabel } from "@/lib/hanja-labels";

const ELEMENT_ORDER = ["wood", "fire", "earth", "metal", "water"] as const;

const ELEMENT_META: Record<
  (typeof ELEMENT_ORDER)[number],
  { label: string; hanja: string; bar: string; text: string; track: string }
> = {
  wood: {
    label: "목",
    hanja: "木",
    bar: "bg-element-wood",
    text: "text-element-wood",
    track: "bg-element-wood/15",
  },
  fire: {
    label: "화",
    hanja: "火",
    bar: "bg-element-fire",
    text: "text-element-fire",
    track: "bg-element-fire/15",
  },
  earth: {
    label: "토",
    hanja: "土",
    bar: "bg-element-earth",
    text: "text-element-earth",
    track: "bg-element-earth/15",
  },
  metal: {
    label: "금",
    hanja: "金",
    bar: "bg-element-metal",
    text: "text-element-metal",
    track: "bg-element-metal/15",
  },
  water: {
    label: "수",
    hanja: "水",
    bar: "bg-element-water",
    text: "text-element-water",
    track: "bg-element-water/15",
  },
};

interface ElementBarChartProps {
  chart: ChartJSON;
}

export function ElementBarChart({ chart }: ElementBarChartProps) {
  const raw = chart.elements.raw_count;
  const total = ELEMENT_ORDER.reduce((sum, key) => sum + (raw[key] ?? 0), 0) || 1;

  const rows = ELEMENT_ORDER.map((key) => {
    const count = raw[key] ?? 0;
    const percent = Math.round((count / total) * 100);
    return { key, count, percent, meta: ELEMENT_META[key] };
  });

  return (
    <div className="space-y-4">
      <p className="text-xs text-text-secondary">천간·지지 글자 수 기준 · 총 {total}개</p>
      <ul className="space-y-3">
        {rows.map(({ key, count, percent, meta }) => {
          const showInsideFill = percent >= 20;

          return (
            <li key={key}>
              <div className="mb-1.5 text-sm">
                <span className={cn("font-medium", meta.text)}>
                  {formatElementLabel(meta.label, meta.hanja)}
                </span>
              </div>

              <div
                className={cn(
                  "relative h-[24px] overflow-hidden rounded-lg border border-border/80 sm:h-[27px] md:h-[30px]",
                  meta.track,
                )}
                role="meter"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${meta.label} ${percent}%`}
              >
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 transition-[width] duration-500 ease-out",
                    meta.bar,
                    percent >= 100 ? "rounded-lg md:rounded-xl" : "rounded-l-lg md:rounded-l-xl",
                  )}
                  style={{ width: `${percent}%` }}
                />

                {percent === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold tabular-nums leading-none text-text-secondary sm:text-[11px] md:text-xs">
                      0% · 0개
                    </span>
                  </div>
                ) : showInsideFill ? (
                  <div
                    className="absolute inset-y-0 left-0 flex items-center justify-end px-2 sm:px-2.5 md:px-3"
                    style={{ width: `${percent}%` }}
                  >
                    <span className="text-[10px] font-bold tabular-nums leading-none text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] sm:text-[11px] md:text-xs">
                      {percent}% · {count}개
                    </span>
                  </div>
                ) : (
                  <div
                    className="absolute inset-y-0 flex items-center pl-1.5 sm:pl-2"
                    style={{ left: `${percent}%` }}
                  >
                    <span className="whitespace-nowrap text-[10px] font-bold tabular-nums leading-none text-text-primary sm:text-[11px] md:text-xs">
                      {percent}% · {count}개
                    </span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="text-xs leading-relaxed text-text-secondary">
        단순 개수만으로 용신이나 운세를 판단하지 않습니다.
      </p>
    </div>
  );
}
