import { describe, expect, it } from "vitest";
import { formatBranchLabel, formatHanjaText, formatStemLabel } from "@/lib/hanja-labels";

describe("formatHanjaText", () => {
  it("annotates bare heavenly stems and earthly branches", () => {
    expect(formatHanjaText("일간은 壬이고 월지는 寅입니다.")).toBe(
      "일간은 壬(임)이고 월지는 寅(인)입니다.",
    );
  });

  it("fixes reversed korean-first notation", () => {
    expect(formatHanjaText("미(未)와 축(丑)의 충돌")).toBe("未(미)와 丑(축)의 충돌");
  });

  it("annotates saju terms", () => {
    expect(formatHanjaText("日干 기준으로 해석")).toBe("日干(일간) 기준으로 해석");
  });

  it("does not double-annotate", () => {
    expect(formatHanjaText("甲(갑)과 子(자)")).toBe("甲(갑)과 子(자)");
  });
});

describe("formatStemLabel", () => {
  it("returns hanja with korean reading", () => {
    expect(formatStemLabel("甲")).toBe("甲(갑)");
    expect(formatBranchLabel("未")).toBe("未(미)");
  });
});
