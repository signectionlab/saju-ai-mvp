export interface KnowledgeDoc {
  doc_id: string;
  title: string;
  collection: string;
  tags: string[];
  school: string;
  review_status: string;
  content: string;
}

export const KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  {
    doc_id: "policy_calculation_v1",
    title: "계산 정책과 해석 경계",
    collection: "00_policy",
    tags: ["policy", "calculation"],
    school: "project-standard-v1",
    review_status: "approved",
    content: "명식 계산은 코드 엔진이 담당한다. AI는 계산값을 수정하지 않는다. 출생시간 미상 시 시주 해석을 하지 않는다. 용신은 MVP에서 제공하지 않는다.",
  },
  {
    doc_id: "foundation_day_master_v1",
    title: "일간 중심 해석 원칙",
    collection: "10_foundation",
    tags: ["일간", "foundation"],
    school: "project-standard-v1",
    review_status: "approved",
    content: "일간(日干)은 사주 해석의 중심이다. 일간의 오행과 음양을 기준으로 십성 관계를 읽는다. 일간 하나만으로 성격을 단정하지 않고 월지·통근·주변 구조를 함께 본다.",
  },
  {
    doc_id: "foundation_five_elements_v1",
    title: "오행 분포 읽기",
    collection: "10_foundation",
    tags: ["오행", "foundation"],
    school: "project-standard-v1",
    review_status: "approved",
    content: "오행 개수는 참고 지표일 뿐 좋고 나쁨을 의미하지 않는다. 계절(월지)과의 상호작용, 생극 관계, 합충에 따른 변화를 함께 고려한다.",
  },
  {
    doc_id: "interactions_ten_gods_v1",
    title: "십성 기본 원칙",
    collection: "20_interactions",
    tags: ["십성", "비견", "겁재"],
    school: "project-standard-v1",
    review_status: "approved",
    content: "비견·겁재는 자아·독립성·경쟁 의식과 연결될 수 있다. 식신·상관은 표현·창의·개혁 성향과 연결될 수 있다. 편재·정재는 자원·현실 감각과 연결될 수 있다. 편관·정관은 기준·책임·구조와 연결될 수 있다. 편인·정인은 학습·내면·보호와 연결될 수 있다.",
  },
  {
    doc_id: "interactions_clash_v1",
    title: "충(冲) 해석 원칙",
    collection: "20_interactions",
    tags: ["충", "합충"],
    school: "project-standard-v1",
    review_status: "approved",
    content: "충은 변화·마찰·긴장을 만들 수 있는 구조 신호다. 충이 있다고 반드시 나쁜 결과가 오는 것은 아니며, 어떤 영역에서 변화 압력이 커지는지를 설명한다.",
  },
  {
    doc_id: "domain_personality_v1",
    title: "성향 해석 연결 규칙",
    collection: "30_domains",
    tags: ["성향", "basic"],
    school: "project-standard-v1",
    review_status: "approved",
    content: "성향 설명은 최소 두 개의 명식 근거(십성, 오행, 합충 등)를 교차 확인한 뒤 작성한다. 포괄적 성격 문구 대신 반복 패턴과 발현 조건을 설명한다.",
  },
  {
    doc_id: "domain_love_v1",
    title: "연애 패턴 해석 규칙",
    collection: "30_domains",
    tags: ["연애", "관계"],
    school: "project-standard-v1",
    review_status: "approved",
    content: "상대 정보 없이 상대의 감정·의도를 추정하지 않는다. 궁합을 단일 점수로 판정하지 않는다. 소통 방식, 갈등 요인, 현실적 행동을 제시한다.",
  },
  {
    doc_id: "domain_success_v1",
    title: "성공운 해석 규칙",
    collection: "30_domains",
    tags: ["성공", "직업"],
    school: "project-standard-v1",
    review_status: "approved",
    content: "합격·투자·창업 성공을 보장하지 않는다. 강점이 발휘되는 환경, 의사결정 방식, 방해 패턴을 구분한다. 현실 데이터 확인 항목을 함께 제시한다.",
  },
  {
    doc_id: "safety_crisis_v1",
    title: "위기 상황 대응",
    collection: "50_safety",
    tags: ["safety", "crisis"],
    school: "project-standard-v1",
    review_status: "approved",
    content: "자해·타해·폭력·스토킹 신호가 있으면 사주 해석을 중단하고 안전 확보, 긴급 연락, 전문 기관 안내를 우선한다.",
  },
  {
    doc_id: "glossary_ten_gods_v1",
    title: "십성 쉬운 설명",
    collection: "90_glossary",
    tags: ["glossary", "십성"],
    school: "project-standard-v1",
    review_status: "approved",
    content: "비견: 나와 같은 기운, 자아·주체성. 겁재: 비슷하지만 경쟁·협력이 섞이는 기운. 식신: 표현·창의·생산. 상관: 개혁·비판·자유로운 표현. 편재: 기회·유동적 자원. 정재: 안정적 자원·관리. 편관: 압박·도전·규율. 정관: 책임·질서·기준. 편인: 학습·직관·내면. 정인: 보호·지원·학습.",
  },
];

export function searchKnowledge(params: {
  serviceType: string;
  tags?: string[];
  limit?: number;
}): KnowledgeDoc[] {
  const limit = params.limit ?? 5;
  const serviceTagMap: Record<string, string[]> = {
    basic: ["성향", "basic", "foundation", "십성"],
    love: ["연애", "관계", "십성"],
    success: ["성공", "직업", "십성"],
  };
  const wanted = new Set([...(params.tags ?? []), ...(serviceTagMap[params.serviceType] ?? [])]);

  return KNOWLEDGE_DOCS.filter(
    (doc) =>
      doc.review_status === "approved" &&
      (wanted.size === 0 || doc.tags.some((t) => wanted.has(t)) || doc.collection.startsWith("00") || doc.collection.startsWith("50")),
  ).slice(0, limit);
}

export function formatKnowledgeContext(docs: KnowledgeDoc[]): string {
  return docs
    .map((doc) => `[${doc.doc_id}] ${doc.title}\n${doc.content}`)
    .join("\n\n");
}
