import type { ChartJSON } from "@/packages/saju-engine/schema";
import type { Reading } from "@/lib/ai/schema";
import { buildAnalysisFacts } from "@/packages/rule-engine";
import type { AdvisorStyle, ServiceType } from "@/lib/types";

export function generateFallbackReading(params: {
  chart: ChartJSON;
  serviceType: ServiceType;
  style: AdvisorStyle;
  currentSituation?: string;
}): Reading {
  const { chart, serviceType, style } = params;
  const facts = buildAnalysisFacts(chart);
  const dayMasterFact = facts.find((f) => f.id === "fact_day_master");
  const relationFacts = facts.filter((f) => f.category === "relation");
  const empathetic = style === "empathetic";

  const headline = empathetic
    ? "먼저 당신의 사주 흐름을 차분히 정리해 드릴게요"
    : "명식 기준 핵심 흐름 요약";

  const summary = empathetic
    ? `${dayMasterFact?.summary ?? "일간을 중심으로"} 현재 제공된 정보 안에서 패턴을 살펴봤어요.`
    : `${dayMasterFact?.summary ?? "일간 기준"} 현재 근거로 확인 가능한 흐름입니다.`;

  const sections: Reading["sections"] = [
    {
      title: "강점과 성공조건",
      content: empathetic
        ? "일간의 기운이 잘 드러나는 환경에서는 집중력과 추진력이 함께 살아나요. 혼자 깊이 파고들 수 있는 시간과, 결과를 공유할 수 있는 파트너가 있을 때 강점이 더 분명해집니다."
        : "일간 기준으로 강점이 발휘되는 조건은 '충분한 준비 시간 + 명확한 목표'입니다. 혼자 판단 후 실행하는 구조에서 성과가 잘 연결됩니다.",
      basis: "calculation",
      confidence: "high",
      evidence_ids: [dayMasterFact?.evidence_id ?? `day_master_${chart.day_master.stem}`],
    },
    {
      title: "주의할 점",
      content:
        relationFacts.length > 0
          ? `명식에서 ${relationFacts.map((f) => f.summary).join(" ")} 같은 신호가 있어, 성급한 결정이나 감정적 반응에 주의가 필요합니다.`
          : "뚜렷한 합·충 신호는 제한적이나, 피로하거나 급할 때 판단이 흔들리기 쉬운 패턴을 기록해 두면 좋습니다.",
      basis: "calculation",
      confidence: relationFacts.length > 0 ? "medium" : "low",
      evidence_ids: relationFacts.map((f) => f.evidence_id).slice(0, 2),
    },
    {
      title: "운의 흐름과 기회",
      content: empathetic
        ? "지금은 작은 실행을 쌓아두면 다음 흐름에서 더 큰 기회로 이어지기 좋은 시기예요. 완벽함보다 꾸준함에 무게를 두면 마음도 편해집니다."
        : "현재 대운·세운 흐름상 단기 성과보다 30~90일 단위의 실행 누적이 유리합니다. 기회는 준비된 패턴이 반복될 때 포착하기 쉽습니다.",
      basis: "knowledge",
      confidence: "medium",
      evidence_ids: ["domain_personality_v1"],
    },
  ];

  if (params.currentSituation) {
    sections.push({
      title: "현재 상황 연결",
      content: empathetic
        ? `말씀해 주신 상황("${params.currentSituation.slice(0, 80)}")을 함께 고려하면, 성급한 결론보다 확인 가능한 신호를 보는 편이 좋아요.`
        : `입력하신 상황("${params.currentSituation.slice(0, 80)}") 기준, 단정보다 검증 가능한 행동을 우선하세요.`,
      basis: "counseling",
      confidence: "medium",
      evidence_ids: [],
    });
  }

  return {
    service_type: serviceType,
    style,
    headline,
    summary,
    sections,
    actions: [
      {
        action: empathetic
          ? "이번 주에 반복되는 내 반응을 하루 한 번 메모해 보세요."
          : "7일간 같은 상황에서의 선택을 기록하세요.",
        example: empathetic
          ? "예: 저녁 10시에 침대에 누워 메모 앱에 '오늘 화가 난 순간 / 내가 한 말 / 결과' 3줄만 적어 보세요. 화요일엔 '상사에게 먼저 말 걸기 vs 기다리기' 중 무엇을 택했는지도 함께 기록하세요."
          : "예: 출근 후 5분 동안 어제와 오늘의 의사결정 1가지를 비교해 적으세요. '회의에서 발언했는지 / 침묵했는지'와 그 결과를 7일간 같은 형식으로 기록하세요.",
        timeframe: "7_days",
        success_signal: "패턴이 보이기 시작함",
      },
      {
        action: empathetic
          ? "한 가지 작은 실행을 정하고 끝까지 지켜보세요."
          : "30일 실행 목표 1개를 정하고 매주 점검하세요.",
        example: empathetic
          ? "예: '이번 달 매주 수요일 점심 후 15분 산책'을 정했으면, 알람을 수요일 12:30에 맞추고 산책 후 '기분 1~5점'만 기록해 보세요. 4주 연속 실천하면 몸과 마음 반응을 비교할 수 있어요."
          : "예: '30일간 주 2회, 오후 3시에 25분 집중 업무'를 목표로 캘린더에 고정하세요. 매주 금요일에 '완료 횟수 / 방해된 요인'을 체크리스트로 점검하세요.",
        timeframe: "30_days",
        success_signal: "행동과 결과의 연결 확인",
      },
    ],
    uncertainties: chart.uncertainties.map((u) => u.message),
    safety_note:
      "이 결과는 전통 명리 관점의 자기성찰용 콘텐츠이며, 과학적으로 확정된 예측이나 의료·법률·금융 조언이 아닙니다.",
    follow_up_questions:
      serviceType === "love"
        ? [
            "제 관계에서 반복되는 패턴을 더 구체적으로 알려주세요.",
            "상대에게 어떤 문장으로 말하면 좋을까요?",
            "지금 연락 빈도를 어떻게 조절하면 좋을까요?",
          ]
        : serviceType === "success"
          ? [
              "제 강점을 업무에서 어떻게 쓸 수 있을까요?",
              "30일 계획을 제 상황에 맞게 구체화해 주세요.",
              "성과를 막는 패턴을 더 자세히 알려주세요.",
            ]
          : [
              "이 강점을 일상에서 어떻게 써볼 수 있을까요?",
              "주의할 패턴이 실제로 나타나는 상황은?",
              "30일 관찰 질문을 더 구체화해 주세요.",
            ],
  };
}
