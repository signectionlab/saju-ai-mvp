import { NextRequest, NextResponse } from "next/server";
import { calculateChart, calculateInputSchema } from "@/packages/saju-engine";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const rate = checkRateLimit(`chart:${ip}`);
  if (!rate.allowed) {
    return NextResponse.json({ error: "일일 요청 한도를 초과했습니다." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const input = calculateInputSchema.parse(body);
    const chart = calculateChart(input);
    return NextResponse.json({ chart, rateRemaining: rate.remaining });
  } catch (error) {
    const message = error instanceof Error ? error.message : "계산에 실패했습니다.";
    return NextResponse.json(
      { status: "calculation_failed", error_code: "CALCULATION_ERROR", message, retryable: true },
      { status: 400 },
    );
  }
}
