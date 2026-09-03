/** 천간·지지 한자 → 오행 */
const STEM_ELEMENT: Record<string, string> = {
  "甲": "wood", "乙": "wood",
  "丙": "fire", "丁": "fire",
  "戊": "earth", "己": "earth",
  "庚": "metal", "辛": "metal",
  "壬": "water", "癸": "water",
};

const BRANCH_ELEMENT: Record<string, string> = {
  "子": "water", "丑": "earth", "寅": "wood", "卯": "wood",
  "辰": "earth", "巳": "fire", "午": "fire", "未": "earth",
  "申": "metal", "酉": "metal", "戌": "earth", "亥": "water",
};

export function getStemElement(hanja: string): string {
  return STEM_ELEMENT[hanja] ?? "earth";
}

export function getBranchElement(hanja: string): string {
  return BRANCH_ELEMENT[hanja] ?? "earth";
}

export const ELEMENT_TEXT_CLASS: Record<string, string> = {
  wood: "text-element-wood",
  fire: "text-element-fire",
  earth: "text-element-earth",
  metal: "text-element-metal",
  water: "text-element-water",
};

export const ELEMENT_GLOW_CLASS: Record<string, string> = {
  wood: "drop-shadow-[0_0_8px_rgba(107,191,138,0.5)]",
  fire: "drop-shadow-[0_0_8px_rgba(232,93,76,0.5)]",
  earth: "drop-shadow-[0_0_8px_rgba(201,162,39,0.5)]",
  metal: "drop-shadow-[0_0_8px_rgba(148,163,184,0.5)]",
  water: "drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]",
};
