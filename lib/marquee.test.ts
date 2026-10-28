import { describe, expect, it } from "vitest";
import { marqueeDurationSeconds } from "./marquee";

describe("marqueeDurationSeconds", () => {
  it("keeps today's 60s loop for 12 logos (5s per logo)", () => {
    expect(marqueeDurationSeconds(12)).toBe(60);
  });

  it("scales with logo count so speed stays constant", () => {
    expect(marqueeDurationSeconds(3)).toBe(15);
  });

  it("never returns 0s for an empty list", () => {
    expect(marqueeDurationSeconds(0)).toBe(60);
  });
});
