import { describe, expect, it } from "vitest";
import { formatChatReply } from "@/lib/ai/format-chat";

describe("formatChatReply", () => {
  it("extracts readable text from JSON response", () => {
    const raw = JSON.stringify({
      headline: "대인관계 갈등 경향",
      summary: "미(未)와 축(丑)의 충돌이 있습니다.",
      recommendations: ["중재자 역할을 우선하세요", "감정 관리를 하세요"],
    });
    const result = formatChatReply(raw);
    expect(result).toContain("대인관계 갈등 경향");
    expect(result).toContain("未(미)와 丑(축)");
    expect(result).toContain("중재자");
    expect(result).not.toContain('"headline"');
  });

  it("strips HTML tags", () => {
    expect(formatChatReply("<p>안녕하세요</p>")).toBe("안녕하세요");
  });

  it("returns plain text as-is", () => {
    expect(formatChatReply("자연어 답변입니다.")).toBe("자연어 답변입니다.");
  });
});
