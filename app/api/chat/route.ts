import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { chartJsonSchema } from "@/packages/saju-engine/schema";
import { readingSchema } from "@/lib/ai/schema";
import { generateChatReply } from "@/lib/ai/client";
import { detectSafetyIssue, safetyResponse } from "@/lib/ai/safety";
import { checkRateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  chart: chartJsonSchema,
  reading: readingSchema,
  style: z.enum(["objective", "empathetic"]),
  question: z.string().min(1).max(1000),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const rate = checkRateLimit(`chat:${ip}`);
  if (!rate.allowed) {
    return NextResponse.json({ error: "일일 요청 한도를 초과했습니다." }, { status: 429 });
  }

  try {
    const body = bodySchema.parse(await request.json());
    const safety = detectSafetyIssue(body.question);
    if (safety.unsafe) {
      const safe = safetyResponse(safety.category);
      return NextResponse.json({ reply: safe.summary, safetyBlocked: true });
    }

    const reply = await generateChatReply({
      chart: body.chart,
      reading: body.reading,
      question: body.question,
      style: body.style,
    });

    return NextResponse.json({ reply, rateRemaining: rate.remaining });
  } catch (error) {
    const message = error instanceof Error ? error.message : "상담 응답 생성에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
