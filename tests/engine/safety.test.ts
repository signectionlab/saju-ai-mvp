import { describe, expect, it } from "vitest";
import { detectSafetyIssue } from "@/lib/ai/safety";

describe("safety routing", () => {
  it("detects crisis language", () => {
    expect(detectSafetyIssue("죽고 싶어요").unsafe).toBe(true);
  });

  it("detects violent language", () => {
    expect(detectSafetyIssue("스토킹 당하고 있어요").unsafe).toBe(true);
  });

  it("allows normal questions", () => {
    expect(detectSafetyIssue("연애 패턴이 궁금해요").unsafe).toBe(false);
  });
});
