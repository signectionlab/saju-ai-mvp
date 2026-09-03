export const HIDDEN_STEMS: Record<string, Array<{ stem: string; role: "main" | "middle" | "residual" }>> = {
  "子": [{ stem: "癸", role: "main" }],
  "丑": [{ stem: "己", role: "main" }, { stem: "癸", role: "middle" }, { stem: "辛", role: "residual" }],
  "寅": [{ stem: "甲", role: "main" }, { stem: "丙", role: "middle" }, { stem: "戊", role: "residual" }],
  "卯": [{ stem: "乙", role: "main" }],
  "辰": [{ stem: "戊", role: "main" }, { stem: "乙", role: "middle" }, { stem: "癸", role: "residual" }],
  "巳": [{ stem: "丙", role: "main" }, { stem: "戊", role: "middle" }, { stem: "庚", role: "residual" }],
  "午": [{ stem: "丁", role: "main" }, { stem: "己", role: "middle" }],
  "未": [{ stem: "己", role: "main" }, { stem: "丁", role: "middle" }, { stem: "乙", role: "residual" }],
  "申": [{ stem: "庚", role: "main" }, { stem: "壬", role: "middle" }, { stem: "戊", role: "residual" }],
  "酉": [{ stem: "辛", role: "main" }],
  "戌": [{ stem: "戊", role: "main" }, { stem: "辛", role: "middle" }, { stem: "丁", role: "residual" }],
  "亥": [{ stem: "壬", role: "main" }, { stem: "甲", role: "middle" }],
};

export const STEM_HANJA: Record<string, string> = {
  "갑": "甲", "을": "乙", "병": "丙", "정": "丁", "무": "戊",
  "기": "己", "경": "庚", "신": "辛", "임": "壬", "계": "癸",
};

export const BRANCH_HANJA: Record<string, string> = {
  "자": "子", "축": "丑", "인": "寅", "묘": "卯", "진": "辰", "사": "巳",
  "오": "午", "미": "未", "신": "申", "유": "酉", "술": "戌", "해": "亥",
};

export const ELEMENT_MAP: Record<string, string> = {
  "목": "wood", "화": "fire", "토": "earth", "금": "metal", "수": "water",
  wood: "wood", fire: "fire", earth: "earth", metal: "metal", water: "water",
};

export const SIX_COMBINATIONS: Array<[string, string]> = [
  ["子", "丑"], ["寅", "亥"], ["卯", "戌"], ["辰", "酉"], ["巳", "申"], ["午", "未"],
];

export const CLASHES: Array<[string, string]> = [
  ["子", "午"], ["丑", "未"], ["寅", "申"], ["卯", "酉"], ["辰", "戌"], ["巳", "亥"],
];

export const HARMS: Array<[string, string]> = [
  ["子", "未"], ["丑", "午"], ["寅", "巳"], ["卯", "辰"], ["申", "亥"], ["酉", "戌"],
];

export const THREE_HARMONIES: Array<{ members: string[]; element: string }> = [
  { members: ["申", "子", "辰"], element: "water" },
  { members: ["亥", "卯", "未"], element: "wood" },
  { members: ["寅", "午", "戌"], element: "fire" },
  { members: ["巳", "酉", "丑"], element: "metal" },
];
