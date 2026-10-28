import { describe, expect, it } from "vitest";
import { marqueeDurationSeconds, marqueeRepeat } from "./marquee";

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

describe("marqueeRepeat", () => {
  it("leaves today's 12 logos as a single copy per half", () => {
    expect(marqueeRepeat(12)).toBe(1);
    expect(marqueeRepeat(20)).toBe(1);
  });

  it("repeats a short list until each half is at least 2560px wide", () => {
    // 3 logos × 4 = 12 boxes × 220px = 2640px
    expect(marqueeRepeat(3)).toBe(4);
    expect(marqueeRepeat(1)).toBe(12);
  });

  it("returns 1 for an empty list", () => {
    expect(marqueeRepeat(0)).toBe(1);
  });
});
