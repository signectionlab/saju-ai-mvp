const CRISIS_PATTERNS = [
  /자살|자해|죽고\s*싶/,
  /폭력|구타|스토킹|협박/,
  /투자\s*대박|100%\s*수익|반드시\s*합격/,
];

export function detectSafetyIssue(text: string): { unsafe: boolean; category?: string } {
  if (/자살|자해|죽고\s*싶/.test(text)) return { unsafe: true, category: "crisis" };
  if (/폭력|구타|스토킹|협박/.test(text)) return { unsafe: true, category: "violence" };
  if (/투자\s*대박|100%\s*수익|반드시\s*합격/.test(text)) return { unsafe: true, category: "prediction" };
  return { unsafe: CRISIS_PATTERNS.some((p) => p.test(text)), category: "prediction" };
}

export function safetyResponse(category?: string) {
  if (category === "crisis" || category === "violence") {
    return {
      headline: "지금은 안전이 먼저입니다",
      summary:
        "사주 해석보다 현재 안전을 확보하는 것이 우선입니다. 가까운 신뢰할 사람, 지역 긴급 서비스(119, 1393)에 연락해 주세요.",
      safety_note: "위기 상황에서는 점술 해석을 제공하지 않습니다.",
    };
  }
  return {
    headline: "확정적 예언은 제공하지 않습니다",
    summary:
      "투자·합격·재회 성공 여부는 사주만으로 확정할 수 없습니다. 현실 정보와 해당 분야 전문가 의견을 함께 확인해 주세요.",
    safety_note: "중요한 결정은 사주 외 객관적 정보를 병행하세요.",
  };
}
