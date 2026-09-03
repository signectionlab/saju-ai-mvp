import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { chartJsonSchema } from "@/packages/saju-engine/schema";
import { generateReading } from "@/lib/ai/client";
import { detectSafetyIssue, safetyResponse } from "@/lib/ai/safety";
import { checkRateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  chart: chartJsonSchema,
  serviceType: z.enum(["basic", "love", "success"]),
  style: z.enum(["objective", "empathetic"]),
  currentSituation: z.string().optional(),
  loveMode: z.enum(["self_pattern", "compatibility", "current_issue"]).optional(),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const rate = checkRateLimit(`readings:${ip}`);
  if (!rate.allowed) {
    return NextResponse.json({ error: "일일 요청 한도를 초과했습니다." }, { status: 429 });
  }

  try {
    const body = bodySchema.parse(await request.json());
    const safety = detectSafetyIssue(body.currentSituation ?? "");
    if (safety.unsafe) {
      const safe = safetyResponse(safety.category);
      return NextResponse.json({ reading: safe, safetyBlocked: true });
    }

    const reading = await generateReading({
      chart: body.chart,
      serviceType: body.serviceType,
      style: body.style,
      currentSituation: body.currentSituation,
      loveMode: body.loveMode,
    });

    return NextResponse.json({ reading, rateRemaining: rate.remaining });
  } catch (error) {
    const message = error instanceof Error ? error.message : "해석 생성에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
