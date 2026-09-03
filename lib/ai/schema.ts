import { z } from "zod";

export const readingSectionSchema = z.object({
  title: z.string(),
  content: z.string(),
  basis: z.enum(["calculation", "knowledge", "counseling"]),
  confidence: z.enum(["high", "medium", "low"]),
  evidence_ids: z.array(z.string()),
});

export const readingActionSchema = z.object({
  action: z.string(),
  example: z.string(),
  timeframe: z.enum(["today", "7_days", "30_days", "90_days"]),
  success_signal: z.string(),
});

export const readingSchema = z.object({
  service_type: z.enum(["basic", "love", "success"]),
  style: z.enum(["objective", "empathetic"]),
  headline: z.string(),
  summary: z.string(),
  sections: z.array(readingSectionSchema).min(3),
  actions: z.array(readingActionSchema).min(1),
  uncertainties: z.array(z.string()),
  safety_note: z.string(),
  follow_up_questions: z.array(z.string()).length(3),
});

export type Reading = z.infer<typeof readingSchema>;

export const READING_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    service_type: { type: "string", enum: ["basic", "love", "success"] },
    style: { type: "string", enum: ["objective", "empathetic"] },
    headline: { type: "string" },
    summary: { type: "string" },
    sections: {
      type: "array",
      minItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          content: { type: "string" },
          basis: { type: "string", enum: ["calculation", "knowledge", "counseling"] },
          confidence: { type: "string", enum: ["high", "medium", "low"] },
          evidence_ids: { type: "array", items: { type: "string" } },
        },
        required: ["title", "content", "basis", "confidence", "evidence_ids"],
      },
    },
    actions: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          action: { type: "string" },
          example: { type: "string" },
          timeframe: { type: "string", enum: ["today", "7_days", "30_days", "90_days"] },
          success_signal: { type: "string" },
        },
        required: ["action", "example", "timeframe", "success_signal"],
      },
    },
    uncertainties: { type: "array", items: { type: "string" } },
    safety_note: { type: "string" },
    follow_up_questions: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: { type: "string" },
    },
  },
  required: [
    "service_type",
    "style",
    "headline",
    "summary",
    "sections",
    "actions",
    "uncertainties",
    "safety_note",
    "follow_up_questions",
  ],
} as const;
