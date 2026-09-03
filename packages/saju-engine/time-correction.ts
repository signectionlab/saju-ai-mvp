import policy from "@/policy/project-standard-v1.json";
import type { CalculateInput } from "./schema";

type TimeCorrectionPolicy = "legal_standard_time" | "local_mean_solar_time" | "apparent_solar_time";

export function getLongitudeCorrectionMinutes(longitude: number, standardMeridian = 135) {
  return Math.round((longitude - standardMeridian) * 4);
}

/** project-standard-v1 시간 보정 정책 → manseryeok trueSolarTime 옵션 */
export function resolveTrueSolarTimeOptions(input: CalculateInput) {
  const mode = (policy.time_correction ?? "legal_standard_time") as TimeCorrectionPolicy;

  if (mode === "legal_standard_time" && !input.solarTimeEnabled) {
    return undefined;
  }

  const useFullApparent = mode === "apparent_solar_time" || input.solarTimeEnabled;

  return {
    longitude: input.location.longitude,
    applyEquationOfTime: useFullApparent,
    applyHistoricalDst: true,
  };
}

export function getAppliedTimeCorrectionPolicy(input: CalculateInput): TimeCorrectionPolicy {
  if (input.solarTimeEnabled) return "apparent_solar_time";
  return (policy.time_correction ?? "legal_standard_time") as TimeCorrectionPolicy;
}
