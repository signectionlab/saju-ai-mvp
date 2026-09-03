export type ServiceType = "basic" | "love" | "success";
export type AdvisorStyle = "objective" | "empathetic";
export type LoveMode = "self_pattern" | "compatibility" | "current_issue";
export type CalendarType = "solar" | "lunar";

export interface BirthLocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface BirthInput {
  calendarType: CalendarType;
  birthDate: string;
  birthTime: string | "unknown";
  isLeapMonth: boolean;
  gender: "male" | "female";
  location: BirthLocation;
  solarTimeEnabled: boolean;
  dayBoundaryPolicy: "midnight" | "split_zi" | "early_zi";
}

export interface SessionData {
  serviceType: ServiceType;
  advisorStyle: AdvisorStyle;
  birthInput: BirthInput;
  partnerBirthInput?: BirthInput;
  loveMode?: LoveMode;
  currentSituation?: string;
  chartJson?: unknown;
  reading?: unknown;
  chatHistory?: ChatMessage[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const SERVICE_OPTIONS = [
  {
    id: "basic" as const,
    emoji: "🔮",
    title: "기본 사주",
    description: "나의 성향과 반복되는 패턴",
    question: "나는 어떤 환경에서 강점이 살아날까?",
  },
  {
    id: "love" as const,
    emoji: "💞",
    title: "연애 상담",
    description: "관계 패턴과 현실적인 대화 방법",
    question: "연락 문제를 어떻게 풀어야 할까?",
  },
  {
    id: "success" as const,
    emoji: "📈",
    title: "성공운",
    description: "성과 방식과 집중할 방향",
    question: "지금 무엇에 힘을 써야 할까?",
  },
] as const;

export const ADVISOR_OPTIONS = [
  {
    id: "objective" as const,
    name: "현",
    hanja: "玄",
    label: "객관형",
    emoji: "🧊",
    image: "/images/advisor-hyeon.png",
    imageFallback: "/images/advisor-hyeon.svg",
    color: "hyeon" as const,
    summary: "핵심부터 분명하게 말해요.",
    example:
      "현재 근거로는 기다리는 것보다 기준을 정하는 편이 낫습니다. 7일 동안 상대의 말과 행동이 일치하는지 확인하세요.",
    fit: ["결론이 먼저 필요한 분", "실행 기준이 필요한 분"],
  },
  {
    id: "empathetic" as const,
    name: "온",
    hanja: "溫",
    label: "감정형",
    emoji: "🌸",
    image: "/images/advisor-on.png",
    imageFallback: "/images/advisor-on.svg",
    color: "on" as const,
    summary: "마음을 살피며 솔직하게 말해요.",
    example:
      "기다리는 동안 마음이 많이 흔들렸을 수 있어요. 이제는 상대의 말과 행동이 맞는지 살피며 내 기준도 지켜보세요.",
    fit: ["마음을 정리하며 듣고 싶은 분", "부드러운 설명이 편한 분"],
  },
] as const;

export const POPULAR_CITIES: BirthLocation[] = [
  {
    city: "서울",
    country: "대한민국",
    latitude: 37.5665,
    longitude: 126.978,
    timezone: "Asia/Seoul",
  },
  {
    city: "부산",
    country: "대한민국",
    latitude: 35.1796,
    longitude: 129.0756,
    timezone: "Asia/Seoul",
  },
  {
    city: "도쿄",
    country: "일본",
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: "Asia/Tokyo",
  },
  {
    city: "뉴욕",
    country: "미국",
    latitude: 40.7128,
    longitude: -74.006,
    timezone: "America/New_York",
  },
  {
    city: "런던",
    country: "영국",
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: "Europe/London",
  },
];

export const DEFAULT_BIRTH_INPUT: BirthInput = {
  calendarType: "solar",
  birthDate: "2000-01-01",
  birthTime: "12:00",
  isLeapMonth: false,
  gender: "female",
  location: POPULAR_CITIES[0],
  solarTimeEnabled: false,
  dayBoundaryPolicy: "midnight",
};

export const DEFAULT_SESSION: SessionData = {
  serviceType: "basic",
  advisorStyle: "objective",
  birthInput: DEFAULT_BIRTH_INPUT,
};
