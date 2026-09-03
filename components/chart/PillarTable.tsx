import type { ChartJSON } from "@/packages/saju-engine/schema";
import { HanjaWithReading } from "@/components/chart/HanjaChar";
import { TermTooltip } from "@/components/ui/TermTooltip";
import { formatHanjaText } from "@/lib/hanja-labels";

const PILLAR_ORDER = ["hour", "day", "month", "year"] as const;
const PILLAR_LABELS: Record<string, string> = {
  hour: "시주",
  day: "일주",
  month: "월주",
  year: "년주",
};

interface PillarTableProps {
  chart: ChartJSON;
  detailed?: boolean;
}

function TenGodCell({ raw }: { raw: string }) {
  const text = formatHanjaText(raw);
  return (
    <TermTooltip term={raw} className="text-text-primary">
      {text}
    </TermTooltip>
  );
}

export function PillarTable({ chart, detailed = false }: PillarTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-text-secondary">
            <th className="py-2 pr-4 font-sans">구분</th>
            {PILLAR_ORDER.map((key) => (
              <th key={key} className="px-2 py-2 text-center font-serif font-semibold">
                <TermTooltip term={PILLAR_LABELS[key]}>{PILLAR_LABELS[key]}</TermTooltip>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border">
            <td className="py-3 pr-4 font-sans font-medium">
              <TermTooltip term="천간">천간</TermTooltip>
            </td>
            {PILLAR_ORDER.map((key) => {
              const pillar = chart.pillars[key];
              return (
                <td key={key} className="px-2 py-3 text-center">
                  {pillar ? (
                    <HanjaWithReading char={pillar.stem} type="stem" reading={pillar.stemKorean} />
                  ) : (
                    <span className="text-text-secondary">—</span>
                  )}
                  {!chart.input.birth_time_known && key === "hour" && (
                    <span className="mt-1 block font-sans text-xs text-warning">시간 미상</span>
                  )}
                </td>
              );
            })}
          </tr>
          <tr className="border-b border-border">
            <td className="py-3 pr-4 font-sans font-medium">
              <TermTooltip term="지지">지지</TermTooltip>
            </td>
            {PILLAR_ORDER.map((key) => {
              const pillar = chart.pillars[key];
              return (
                <td key={key} className="px-2 py-3 text-center">
                  {pillar ? (
                    <HanjaWithReading char={pillar.branch} type="branch" reading={pillar.branchKorean} />
                  ) : (
                    <span className="text-text-secondary">—</span>
                  )}
                </td>
              );
            })}
          </tr>
          {detailed &&
            PILLAR_ORDER.map((key) => {
              if (!chart.ten_gods[key]) return null;
              const gods = chart.ten_gods[key];
              return (
                <tr key={`tg-${key}`} className="border-b border-border text-text-secondary">
                  <td className="py-2 pr-4 font-sans">
                    <TermTooltip term={PILLAR_LABELS[key]}>{PILLAR_LABELS[key]}</TermTooltip>{" "}
                    <TermTooltip term="십성">십성</TermTooltip>
                  </td>
                  {PILLAR_ORDER.map((col) => (
                    <td key={col} className="px-2 py-2 text-center font-sans text-xs">
                      {col === key ? (
                        <span className="inline-flex flex-col gap-0.5">
                          <span>
                            <TermTooltip term="천간 십성" className="mr-1 text-[10px] text-text-secondary">
                              천
                            </TermTooltip>
                            <TenGodCell raw={gods.stem} />
                          </span>
                          <span>
                            <TermTooltip term="지지 십성" className="mr-1 text-[10px] text-text-secondary">
                              지
                            </TermTooltip>
                            <TenGodCell raw={gods.branch} />
                          </span>
                        </span>
                      ) : (
                        ""
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
        </tbody>
      </table>
      {detailed && (
        <p className="mt-3 font-sans text-xs text-text-secondary">
          밑줄 점선 용어에 마우스를 올리면 쉬운 설명을 볼 수 있어요.
        </p>
      )}
    </div>
  );
}
