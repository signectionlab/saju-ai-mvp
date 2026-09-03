import OpenAI from "openai";
import { formatChatReply } from "@/lib/ai/format-chat";
import type { ChartJSON } from "@/packages/saju-engine/schema";
import type { Reading } from "@/lib/ai/schema";
import { READING_JSON_SCHEMA } from "@/lib/ai/schema";
import { BASE_SYSTEM, getServicePrompt, getStylePrompt, STYLE_REWRITE } from "@/lib/ai/prompts";
import { formatKnowledgeContext, searchKnowledge } from "@/packages/knowledge";
import { buildAnalysisFacts } from "@/packages/rule-engine";
import { generateFallbackReading } from "@/lib/ai/fallback-reading";
import { validateReading } from "@/lib/ai/validate-reading";
import type { AdvisorStyle, ServiceType } from "@/lib/types";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export async function generateReading(params: {
  chart: ChartJSON;
  serviceType: ServiceType;
  style: AdvisorStyle;
  currentSituation?: string;
  loveMode?: string;
}): Promise<Reading> {
  const client = getClient();
  const knowledge = searchKnowledge({ serviceType: params.serviceType });
  const facts = buildAnalysisFacts(params.chart);

  if (!client) {
    return generateFallbackReading(params);
  }

  const userPayload = {
    CHART_JSON: params.chart,
    ANALYSIS_FACTS: facts,
    KNOWLEDGE_CONTEXT: formatKnowledgeContext(knowledge),
    service_type: params.serviceType,
    style: params.style,
    current_situation: params.currentSituation ?? null,
    love_mode: params.loveMode ?? null,
  };

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: [BASE_SYSTEM, getStylePrompt(params.style), getServicePrompt(params.serviceType)].join("\n\n"),
        },
        {
          role: "user",
          content: `아래 데이터만 사용해 JSON으로 답하세요.\n${JSON.stringify(userPayload)}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "reading",
          strict: true,
          schema: READING_JSON_SCHEMA,
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("Empty AI response");
    return validateReading(JSON.parse(content), params.chart);
  } catch {
    return generateFallbackReading(params);
  }
}

export async function rewriteReadingStyle(params: {
  reading: Reading;
  targetStyle: AdvisorStyle;
  chart: ChartJSON;
}): Promise<Reading> {
  const client = getClient();
  if (!client) {
    return generateFallbackReading({
      chart: params.chart,
      serviceType: params.reading.service_type,
      style: params.targetStyle,
    });
  }

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      messages: [
        { role: "system", content: [BASE_SYSTEM, STYLE_REWRITE, getStylePrompt(params.targetStyle)].join("\n\n") },
        { role: "user", content: JSON.stringify({ VERIFIED_READING: params.reading, TARGET_STYLE: params.targetStyle }) },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: "reading", strict: true, schema: READING_JSON_SCHEMA },
      },
    });
    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("Empty rewrite response");
    const rewritten = validateReading(JSON.parse(content), params.chart);
    rewritten.actions = params.reading.actions;
    return rewritten;
  } catch {
    return generateFallbackReading({
      chart: params.chart,
      serviceType: params.reading.service_type,
      style: params.targetStyle,
    });
  }
}

export async function generateChatReply(params: {
  chart: ChartJSON;
  reading: Reading;
  question: string;
  style: AdvisorStyle;
}): Promise<string> {
  const client = getClient();
  if (!client) {
    return params.style === "empathetic"
      ? "질문해 주셔서 감사해요. 현재 세션의 명식과 이전 결과 범위 안에서, 성급한 단정보다 확인할 수 있는 행동부터 시작해 보시면 좋겠어요."
      : "현재 제공된 명식과 결과 범위 안에서 답변드립니다. 단정적 예언보다 확인 가능한 행동을 우선하세요.";
  }

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: [
          BASE_SYSTEM,
          getStylePrompt(params.style),
          "후속 상담 답변은 반드시 자연어 문장만 출력하세요.",
          "JSON, HTML 태그, 마크다운, 코드 블록을 사용하지 마세요.",
          "headline, summary 같은 필드명을 노출하지 마세요.",
        ].join("\n\n"),
      },
      {
        role: "user",
        content: JSON.stringify({
          CHART_JSON: params.chart,
          PREVIOUS_READING: params.reading,
          question: params.question,
        }),
      },
    ],
    max_tokens: 800,
  });

  const raw =
    response.choices[0]?.message?.content ??
    "현재 제공된 근거만으로는 추가 판단이 어렵습니다. 구체적 상황을 조금 더 알려주시면 현실적인 관점을 드릴 수 있어요.";

  return formatChatReply(raw);
}
