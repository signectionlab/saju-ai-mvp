import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { calculateChart, calculateInputSchema } from "@/packages/saju-engine";

interface Fixture {
  id: string;
  input: unknown;
  expect?: { hourNull?: boolean };
}

describe("golden-set fixtures", () => {
  const fixtures: Fixture[] = JSON.parse(
    readFileSync(join(__dirname, "../golden-set/fixtures.json"), "utf-8"),
  );

  for (const fixture of fixtures) {
    it(`processes fixture ${fixture.id}`, () => {
      const input = calculateInputSchema.parse(fixture.input);
      const chart = calculateChart(input);
      expect(chart.calculation_hash).toMatch(/^[a-f0-9]{64}$/);
      expect(chart.pillars.year.stem).toBeTruthy();
      expect(chart.pillars.month.stem).toBeTruthy();
      expect(chart.pillars.day.stem).toBeTruthy();
      if (fixture.expect?.hourNull) {
        expect(chart.pillars.hour).toBeNull();
      }
    });
  }
});
