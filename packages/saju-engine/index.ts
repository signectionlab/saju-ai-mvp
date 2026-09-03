import { createHash } from "crypto";
import {
  calculateFourPillars,
  HEAVENLY_STEMS_HANJA,
  EARTHLY_BRANCHES_HANJA,
} from "manseryeok";
import type { DayBoundary } from "manseryeok";
import policy from "@/policy/project-standard-v1.json";
import { HIDDEN_STEMS, STEM_HANJA, BRANCH_HANJA, ELEMENT_MAP } from "./constants";
import { detectRelations } from "./relations";
import {
  getAppliedTimeCorrectionPolicy,
  getLongitudeCorrectionMinutes,
  resolveTrueSolarTimeOptions,
} from "./time-correction";
import type { CalculateInput, ChartJSON } from "./schema";

function toHanjaStem(korean: string): string {
  return STEM_HANJA[korean] ?? korean;
}

function toHanjaBranch(korean: string): string {
  return BRANCH_HANJA[korean] ?? korean;
}

function mapDayBoundary(policyValue: string): DayBoundary {
  if (policyValue === "early_zi") return "jasi";
  if (policyValue === "split_zi") return "splitJasi";
  return "midnight";
}

function countElements(
  stems: string[],
  branches: string[],
  elementPairs: Array<{ stem: string; branch: string }>,
) {
  const raw: Record<string, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const hidden: Record<string, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };

  for (const pair of elementPairs) {
    raw[ELEMENT_MAP[pair.stem] ?? pair.stem] = (raw[ELEMENT_MAP[pair.stem] ?? pair.stem] ?? 0) + 1;
    raw[ELEMENT_MAP[pair.branch] ?? pair.branch] = (raw[ELEMENT_MAP[pair.branch] ?? pair.branch] ?? 0) + 1;
  }

  for (const branch of branches) {
    const hiddenList = HIDDEN_STEMS[branch] ?? [];
    for (const item of hiddenList) {
      const el = stemToElement(item.stem);
      hidden[el] = (hidden[el] ?? 0) + (item.role === "main" ? 1 : 0.5);
    }
  }

  const weighted = { ...raw };
  for (const [key, value] of Object.entries(hidden)) {
    weighted[key] = (weighted[key] ?? 0) + value * 0.3;
  }

  return { raw_count: raw, hidden_stem_count: hidden, weighted_strength: weighted };
}

function stemToElement(hanjaStem: string): string {
  const idx = HEAVENLY_STEMS_HANJA.indexOf(hanjaStem as typeof HEAVENLY_STEMS_HANJA[number]);
  const elements = ["wood", "wood", "fire", "fire", "earth", "earth", "metal", "metal", "water", "water"];
  return elements[idx] ?? "earth";
}

function buildUncertainties(input: CalculateInput, hour: number, minute: number) {
  const uncertainties: ChartJSON["uncertainties"] = [];

  if (input.birthTime === "unknown") {
    uncertainties.push({
      type: "HOUR_UNKNOWN",
      message: "출생시간을 모르므로 시주 관련 해석은 제외됩니다.",
      alternative_available: false,
    });
  }

  if (hour === 23 || (hour === 0 && minute <= 59) || hour === 22) {
    uncertainties.push({
      type: "DAY_BOUNDARY",
      message: "자시 경계 정책에 따라 일주 또는 시주가 달라질 수 있습니다.",
      alternative_available: true,
    });
  }

  return uncertainties;
}

function buildEvidenceIds(chart: Partial<ChartJSON>): string[] {
  const ids: string[] = [];
  if (chart.day_master) ids.push(`day_master_${chart.day_master.stem}`);
  if (chart.pillars) {
    ids.push(`pillar_year_${chart.pillars.year.stem}${chart.pillars.year.branch}`);
    ids.push(`pillar_month_${chart.pillars.month.stem}${chart.pillars.month.branch}`);
    ids.push(`pillar_day_${chart.pillars.day.stem}${chart.pillars.day.branch}`);
    if (chart.pillars.hour) {
      ids.push(`pillar_hour_${chart.pillars.hour.stem}${chart.pillars.hour.branch}`);
    }
  }
  for (const rel of chart.relations ?? []) {
    ids.push(`relation_${rel.type}_${rel.members.join("")}`);
  }
  return ids;
}

export function calculateChart(input: CalculateInput): ChartJSON {
  const [year, month, day] = input.birthDate.split("-").map(Number);
  const birthTimeKnown = input.birthTime !== "unknown";
  const [hour, minute] = birthTimeKnown
    ? input.birthTime.split(":").map(Number)
    : [12, 0];

  if (year < policy.supported_year_minimum || year > policy.supported_year_maximum) {
    throw new Error(`지원 연도는 ${policy.supported_year_minimum}~${policy.supported_year_maximum}입니다.`);
  }

  const trueSolarTime = resolveTrueSolarTimeOptions(input);
  const timeCorrectionPolicy = getAppliedTimeCorrectionPolicy(input);

  const result = calculateFourPillars({
    year,
    month,
    day,
    hour,
    minute,
    isLunar: input.calendarType === "lunar",
    isLeapMonth: input.isLeapMonth,
    gender: input.gender,
    dayBoundary: mapDayBoundary(input.dayBoundaryPolicy),
    ...(trueSolarTime ? { trueSolarTime } : {}),
  });

  const hanja = result.toHanjaObject();
  const pillars = {
    year: {
      stem: hanja.year.hanja[0],
      branch: hanja.year.hanja[1],
      stemKorean: result.year.heavenlyStem,
      branchKorean: result.year.earthlyBranch,
    },
    month: {
      stem: hanja.month.hanja[0],
      branch: hanja.month.hanja[1],
      stemKorean: result.month.heavenlyStem,
      branchKorean: result.month.earthlyBranch,
    },
    day: {
      stem: hanja.day.hanja[0],
      branch: hanja.day.hanja[1],
      stemKorean: result.day.heavenlyStem,
      branchKorean: result.day.earthlyBranch,
    },
    hour: birthTimeKnown
      ? {
          stem: hanja.hour.hanja[0],
          branch: hanja.hour.hanja[1],
          stemKorean: result.hour.heavenlyStem,
          branchKorean: result.hour.earthlyBranch,
        }
      : null,
  };

  const pillarRefs = [
    { position: "year_branch", branch: pillars.year.branch },
    { position: "month_branch", branch: pillars.month.branch },
    { position: "day_branch", branch: pillars.day.branch },
    ...(pillars.hour ? [{ position: "hour_branch", branch: pillars.hour.branch }] : []),
  ];

  const relations = detectRelations(pillarRefs);
  const elementPairs = [
    { stem: result.yearElement.stem, branch: result.yearElement.branch },
    { stem: result.monthElement.stem, branch: result.monthElement.branch },
    { stem: result.dayElement.stem, branch: result.dayElement.branch },
    ...(birthTimeKnown
      ? [{ stem: result.hourElement.stem, branch: result.hourElement.branch }]
      : []),
  ];

  const stems = [
    pillars.year.stem,
    pillars.month.stem,
    pillars.day.stem,
    ...(pillars.hour ? [pillars.hour.stem] : []),
  ];
  const branches = pillarRefs.map((p) => p.branch);

  const elements = countElements(stems, branches, elementPairs);

  const tenGods: ChartJSON["ten_gods"] = {
    year: { stem: result.tenGods.year.stem, branch: result.tenGods.year.branch },
    month: { stem: result.tenGods.month.stem, branch: result.tenGods.month.branch },
    day: { stem: "일간", branch: result.tenGods.day.branch },
    ...(birthTimeKnown
      ? { hour: { stem: result.tenGods.hour.stem, branch: result.tenGods.hour.branch } }
      : {}),
  };

  const hidden_stems: ChartJSON["hidden_stems"] = {};
  for (const ref of pillarRefs) {
    hidden_stems[ref.position.replace("_branch", "")] = HIDDEN_STEMS[ref.branch] ?? [];
  }

  const luck_cycles = result.luckPillars
    ? {
        direction: result.luckPillars.forward ? ("forward" as const) : ("backward" as const),
        start_age: {
          years: result.luckPillars.startYears,
          months: result.luckPillars.startMonths,
          days: result.luckPillars.startDays,
        },
        pillars: result.luckPillars.pillars.map((p) => ({
          age: p.age,
          stem: toHanjaStem(p.pillar.heavenlyStem),
          branch: toHanjaBranch(p.pillar.earthlyBranch),
        })),
      }
    : undefined;

  const chartPartial: Partial<ChartJSON> = {
    pillars,
    day_master: {
      stem: pillars.day.stem,
      element: ELEMENT_MAP[result.dayElement.stem] ?? result.dayElement.stem,
      yin_yang: result.dayYinYang.stem,
    },
    relations,
  };

  const chart: ChartJSON = {
    engine_version: policy.engine_version,
    school_policy: policy.school_policy,
    policy,
    input: {
      calendar: input.calendarType,
      birth_local: `${input.birthDate}T${birthTimeKnown ? input.birthTime : "unknown"}`,
      timezone: input.location.timezone,
      location: {
        city: input.location.city,
        country: input.location.country,
        latitude: input.location.latitude,
        longitude: input.location.longitude,
      },
      birth_time_known: birthTimeKnown,
      gender: input.gender,
    },
    corrections: {
      time_correction_policy: timeCorrectionPolicy,
      dst_applied: Boolean(trueSolarTime),
      solar_time_applied: Boolean(trueSolarTime),
      longitude_correction_minutes: trueSolarTime
        ? getLongitudeCorrectionMinutes(input.location.longitude)
        : 0,
      day_boundary_policy: input.dayBoundaryPolicy,
    },
    pillars,
    hidden_stems,
    ten_gods: tenGods,
    elements,
    relations,
    luck_cycles,
    day_master: chartPartial.day_master!,
    uncertainties: buildUncertainties(input, hour, minute),
    calculation_hash: "",
    evidence_ids: [],
  };

  chart.evidence_ids = buildEvidenceIds(chart);
  chart.calculation_hash = createHash("sha256")
    .update(JSON.stringify({ input, policy: chart.policy, engine_version: chart.engine_version, pillars: chart.pillars }))
    .digest("hex");

  return chart;
}

export { chartJsonSchema, calculateInputSchema } from "./schema";
export type { ChartJSON, CalculateInput } from "./schema";
