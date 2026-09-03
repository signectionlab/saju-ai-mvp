import { z } from "zod";

export const pillarSchema = z.object({
  stem: z.string(),
  branch: z.string(),
  stemKorean: z.string().optional(),
  branchKorean: z.string().optional(),
});

export const chartJsonSchema = z.object({
  engine_version: z.string(),
  school_policy: z.string(),
  policy: z.record(z.unknown()),
  input: z.object({
    calendar: z.enum(["solar", "lunar"]),
    birth_local: z.string(),
    timezone: z.string(),
    location: z.object({
      city: z.string(),
      country: z.string(),
      latitude: z.number(),
      longitude: z.number(),
    }),
    birth_time_known: z.boolean(),
    gender: z.enum(["male", "female"]),
  }),
  corrections: z.object({
    time_correction_policy: z
      .enum(["legal_standard_time", "local_mean_solar_time", "apparent_solar_time"])
      .optional(),
    dst_applied: z.boolean(),
    solar_time_applied: z.boolean(),
    longitude_correction_minutes: z.number(),
    day_boundary_policy: z.string(),
  }),
  pillars: z.object({
    year: pillarSchema,
    month: pillarSchema,
    day: pillarSchema,
    hour: pillarSchema.nullable(),
  }),
  hidden_stems: z.record(z.string(), z.array(z.object({
    stem: z.string(),
    role: z.enum(["main", "middle", "residual"]),
  }))),
  ten_gods: z.record(z.string(), z.object({
    stem: z.string(),
    branch: z.string(),
  })),
  elements: z.object({
    raw_count: z.record(z.string(), z.number()),
    hidden_stem_count: z.record(z.string(), z.number()),
    weighted_strength: z.record(z.string(), z.number()),
  }),
  relations: z.array(z.object({
    type: z.string(),
    members: z.array(z.string()),
    positions: z.array(z.string()),
    detected: z.boolean(),
    transformation_applied: z.boolean(),
  })),
  luck_cycles: z.object({
    direction: z.enum(["forward", "backward"]),
    start_age: z.object({
      years: z.number(),
      months: z.number(),
      days: z.number(),
    }),
    pillars: z.array(z.object({
      age: z.number(),
      stem: z.string(),
      branch: z.string(),
    })),
  }).optional(),
  day_master: z.object({
    stem: z.string(),
    element: z.string(),
    yin_yang: z.string(),
  }),
  uncertainties: z.array(z.object({
    type: z.string(),
    message: z.string(),
    alternative_available: z.boolean().optional(),
  })),
  calculation_hash: z.string(),
  evidence_ids: z.array(z.string()),
});

export type ChartJSON = z.infer<typeof chartJsonSchema>;

export const calculateInputSchema = z.object({
  calendarType: z.enum(["solar", "lunar"]),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  birthTime: z.union([z.string().regex(/^\d{2}:\d{2}$/), z.literal("unknown")]),
  isLeapMonth: z.boolean().default(false),
  gender: z.enum(["male", "female"]),
  location: z.object({
    city: z.string(),
    country: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    timezone: z.string(),
  }),
  solarTimeEnabled: z.boolean().default(false),
  dayBoundaryPolicy: z.enum(["midnight", "split_zi", "early_zi"]).default("midnight"),
});

export type CalculateInput = z.infer<typeof calculateInputSchema>;
