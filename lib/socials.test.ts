import { describe, expect, it } from "vitest";
import { visibleSocials } from "./socials";

describe("visibleSocials", () => {
  it("returns nothing when socials are missing", () => {
    expect(visibleSocials(null)).toEqual([]);
  });

  it("keeps only the networks that have a URL", () => {
    expect(visibleSocials({ linkedin: "https://linkedin.com/company/amg", x: "", instagram: null })).toEqual([
      { key: "linkedin", url: "https://linkedin.com/company/amg" },
    ]);
  });

  it("keeps the fixed LinkedIn, X, Instagram order", () => {
    expect(visibleSocials({ instagram: "c", x: "b", linkedin: "a" }).map((s) => s.key)).toEqual([
      "linkedin",
      "x",
      "instagram",
    ]);
  });

  it("treats whitespace-only URLs as empty", () => {
    expect(visibleSocials({ x: "   " })).toEqual([]);
  });
});
