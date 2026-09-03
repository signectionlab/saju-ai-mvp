import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { chartJsonSchema } from "@/packages/saju-engine/schema";
import { readingSchema } from "@/lib/ai/schema";
import { rewriteReadingStyle } from "@/lib/ai/client";
import { checkRateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  chart: chartJsonSchema,
  reading: readingSchema,
  targetStyle: z.enum(["objective", "empathetic"]),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const rate = checkRateLimit(`style:${ip}`);
  if (!rate.allowed) {
    return NextResponse.json({ error: "일일 요청 한도를 초과했습니다." }, { status: 429 });
  }

  try {
    const body = bodySchema.parse(await request.json());
    const reading = await rewriteReadingStyle({
      chart: body.chart,
      reading: body.reading,
      targetStyle: body.targetStyle,
    });
    return NextResponse.json({ reading, rateRemaining: rate.remaining });
  } catch (error) {
    const message = error instanceof Error ? error.message : "스타일 전환에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
