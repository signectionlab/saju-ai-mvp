/** 천간·지지·오행·명리 용어 한자 → 한글 읽기 */
export const STEM_READING: Record<string, string> = {
  甲: "갑",
  乙: "을",
  丙: "병",
  丁: "정",
  戊: "무",
  己: "기",
  庚: "경",
  辛: "신",
  壬: "임",
  癸: "계",
};

export const BRANCH_READING: Record<string, string> = {
  子: "자",
  丑: "축",
  寅: "인",
  卯: "묘",
  辰: "진",
  巳: "사",
  午: "오",
  未: "미",
  申: "신",
  酉: "유",
  戌: "술",
  亥: "해",
};

export const ELEMENT_READING: Record<string, string> = {
  木: "목",
  火: "화",
  土: "토",
  金: "금",
  水: "수",
};

/** 긴 용어부터 매칭 (년주·일간 등) */
const TERM_READINGS: Array<[string, string]> = [
  ["時柱", "시주"],
  ["日柱", "일주"],
  ["月柱", "월주"],
  ["年柱", "년주"],
  ["時支", "시지"],
  ["時干", "시간"],
  ["日支", "일지"],
  ["日干", "일간"],
  ["月支", "월지"],
  ["月干", "월간"],
  ["年支", "년지"],
  ["年干", "년간"],
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function fixReversedPairs(text: string, map: Record<string, string>) {
  let result = text;
  for (const [hanja, reading] of Object.entries(map)) {
    result = result.replace(new RegExp(`${escapeRegExp(reading)}\\(${escapeRegExp(hanja)}\\)`, "g"), `${hanja}(${reading})`);
  }
  return result;
}

function annotateTerms(text: string, map: Record<string, string>) {
  let result = text;
  for (const [hanja, reading] of Object.entries(map)) {
    const pattern = new RegExp(`${escapeRegExp(hanja)}(?!\\(${escapeRegExp(reading)}\\))`, "g");
    result = result.replace(pattern, `${hanja}(${reading})`);
  }
  return result;
}

/** 본문·채팅 등 사용자-facing 텍스트의 한자를 한자(한글) 형식으로 통일 */
export function formatHanjaText(text: string): string {
  if (!text) return text;

  let result = text;

  result = fixReversedPairs(result, BRANCH_READING);
  result = fixReversedPairs(result, STEM_READING);
  result = fixReversedPairs(result, ELEMENT_READING);

  for (const [hanja, reading] of TERM_READINGS) {
    result = result.replace(
      new RegExp(`${escapeRegExp(hanja)}(?!\\(${escapeRegExp(reading)}\\))`, "g"),
      `${hanja}(${reading})`,
    );
  }

  result = annotateTerms(result, STEM_READING);
  result = annotateTerms(result, BRANCH_READING);
  result = annotateTerms(result, ELEMENT_READING);

  return result;
}

export function stemReading(hanja: string, fallback?: string) {
  return STEM_READING[hanja] ?? fallback ?? "";
}

export function branchReading(hanja: string, fallback?: string) {
  return BRANCH_READING[hanja] ?? fallback ?? "";
}

/** 명식 표: 甲(갑) · 子(자) */
export function formatStemBranchLabel(stem: string, branch: string, stemKo?: string, branchKo?: string) {
  const s = stemReading(stem, stemKo) || stemKo;
  const b = branchReading(branch, branchKo) || branchKo;
  return `${stem}(${s}) · ${branch}(${b})`;
}

export function formatStemLabel(stem: string, stemKo?: string) {
  const reading = stemReading(stem, stemKo) || stemKo;
  return reading ? `${stem}(${reading})` : stem;
}

export function formatBranchLabel(branch: string, branchKo?: string) {
  const reading = branchReading(branch, branchKo) || branchKo;
  return reading ? `${branch}(${reading})` : branch;
}

export function formatElementLabel(label: string, hanja: string) {
  const reading = ELEMENT_READING[hanja] ?? label;
  return `${hanja}(${reading})`;
}
