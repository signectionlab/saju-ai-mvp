import type { Reading } from "@/lib/ai/schema";
import { readingSchema } from "@/lib/ai/schema";
import type { ChartJSON } from "@/packages/saju-engine/schema";
import { KNOWLEDGE_DOCS } from "@/packages/knowledge";

export function validateReading(reading: unknown, chart: ChartJSON): Reading {
  const parsed = readingSchema.parse(reading);
  const allowedEvidence = new Set([
    ...chart.evidence_ids,
    ...KNOWLEDGE_DOCS.map((d) => d.doc_id),
  ]);

  for (const section of parsed.sections) {
    for (const id of section.evidence_ids) {
      if (id && !allowedEvidence.has(id)) {
        section.evidence_ids = section.evidence_ids.filter((e) => allowedEvidence.has(e));
      }
    }
    if (!chart.input.birth_time_known && /시주|시간/.test(section.content)) {
      throw new Error("출생시간 미상 상태에서 시주 해석이 포함되었습니다.");
    }
  }

  return parsed;
}
