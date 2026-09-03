import { describe, expect, it } from "vitest";
import { calculateChart } from "@/packages/saju-engine";

const baseInput = {
  calendarType: "solar" as const,
  birthDate: "2026-02-17",
  birthTime: "14:30",
  isLeapMonth: false,
  gender: "female" as const,
  location: {
    city: "서울",
    country: "대한민국",
    latitude: 37.5665,
    longitude: 126.978,
    timezone: "Asia/Seoul",
  },
  solarTimeEnabled: false,
  dayBoundaryPolicy: "midnight" as const,
};

describe("saju-engine golden cases", () => {
  it("calculates documented example pillars", () => {
    const chart = calculateChart(baseInput);
    expect(chart.pillars.year.stem).toBe("丙");
    expect(chart.pillars.year.branch).toBe("午");
    expect(chart.pillars.month.stem).toBe("庚");
    expect(chart.pillars.month.branch).toBe("寅");
    expect(chart.pillars.day.stem).toBe("壬");
    expect(chart.pillars.day.branch).toBe("戌");
    expect(chart.pillars.hour?.stem).toBe("丁");
    expect(chart.pillars.hour?.branch).toBe("未");
  });

  it("omits hour pillar when birth time unknown", () => {
    const chart = calculateChart({ ...baseInput, birthTime: "unknown" });
    expect(chart.pillars.hour).toBeNull();
    expect(chart.input.birth_time_known).toBe(false);
    expect(chart.uncertainties.some((u) => u.type === "HOUR_UNKNOWN")).toBe(true);
  });

  it("returns stable calculation hash", () => {
    const a = calculateChart(baseInput);
    const b = calculateChart(baseInput);
    expect(a.calculation_hash).toBe(b.calculation_hash);
  });

  it("applies local mean solar correction for Seoul afternoon birth", () => {
    const chart = calculateChart({ ...baseInput, birthTime: "15:28" });
    expect(chart.pillars.hour?.stem).toBe("丁");
    expect(chart.pillars.hour?.branch).toBe("未");
    expect(chart.corrections.time_correction_policy).toBe("local_mean_solar_time");
    expect(chart.corrections.longitude_correction_minutes).toBeLessThan(0);
  });

  it("maps legal 15:28 without correction to next shichen (regression guard)", () => {
    const chart = calculateChart({
      ...baseInput,
      birthTime: "15:28",
      location: { ...baseInput.location, longitude: 135 },
      solarTimeEnabled: false,
    });
    // 동경 135°(표준 자오선)에서는 경도 보정 0 → 법정시 15:28 = 신시
    expect(chart.pillars.hour?.branch).toBe("申");
  });

  it("flags zi-hour boundary uncertainty", () => {
    const chart = calculateChart({ ...baseInput, birthTime: "23:30" });
    expect(chart.uncertainties.some((u) => u.type === "DAY_BOUNDARY")).toBe(true);
  });
});
