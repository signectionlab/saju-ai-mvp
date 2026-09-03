import type { ChartJSON } from "@/packages/saju-engine/schema";

export interface AnalysisFact {
  id: string;
  category: "pillar" | "ten_god" | "element" | "relation" | "luck";
  summary: string;
  evidence_id: string;
}

export function buildAnalysisFacts(chart: ChartJSON): AnalysisFact[] {
  const facts: AnalysisFact[] = [];

  facts.push({
    id: "fact_day_master",
    category: "pillar",
    summary: `일간(日干)은 ${chart.day_master.stem}(${chart.day_master.element}, ${chart.day_master.yin_yang})입니다.`,
    evidence_id: `day_master_${chart.day_master.stem}`,
  });

  facts.push({
    id: "fact_year_pillar",
    category: "pillar",
    summary: `년주는 ${chart.pillars.year.stem}${chart.pillars.year.branch}입니다.`,
    evidence_id: `pillar_year_${chart.pillars.year.stem}${chart.pillars.year.branch}`,
  });

  facts.push({
    id: "fact_month_pillar",
    category: "pillar",
    summary: `월주는 ${chart.pillars.month.stem}${chart.pillars.month.branch}입니다.`,
    evidence_id: `pillar_month_${chart.pillars.month.stem}${chart.pillars.month.branch}`,
  });

  const tenGodEntries = Object.entries(chart.ten_gods).filter(([key]) => {
    if (!chart.input.birth_time_known && key === "hour") return false;
    return true;
  });

  for (const [position, gods] of tenGodEntries) {
    const pillar = chart.pillars[position as keyof typeof chart.pillars];
    if (!pillar) continue;
    facts.push({
      id: `fact_tengod_${position}`,
      category: "ten_god",
      summary: `${position}주 천간 십성 ${gods.stem}, 지지 십성 ${gods.branch}`,
      evidence_id: `pillar_${position}_${pillar.stem}${pillar.branch}`,
    });
  }

  const topElement = Object.entries(chart.elements.raw_count).sort((a, b) => b[1] - a[1])[0];
  if (topElement) {
    facts.push({
      id: "fact_element_dominant",
      category: "element",
      summary: `글자 기준 오행 분포에서 ${topElement[0]}가 ${topElement[1]}개로 가장 많습니다.`,
      evidence_id: `element_raw_${topElement[0]}`,
    });
  }

  for (const rel of chart.relations) {
    facts.push({
      id: `fact_relation_${rel.type}_${rel.members.join("")}`,
      category: "relation",
      summary: `${rel.type} 관계: ${rel.members.join("-")} (${rel.positions.join(", ")})`,
      evidence_id: `relation_${rel.type}_${rel.members.join("")}`,
    });
  }

  if (chart.luck_cycles?.pillars[0]) {
    const first = chart.luck_cycles.pillars[0];
    facts.push({
      id: "fact_luck_first",
      category: "luck",
      summary: `첫 대운은 ${first.age}세 ${first.stem}${first.branch} (${chart.luck_cycles.direction === "forward" ? "순행" : "역행"})`,
      evidence_id: `luck_first_${first.stem}${first.branch}`,
    });
  }

  return facts;
}
