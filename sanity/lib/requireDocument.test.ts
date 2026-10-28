import { describe, expect, it } from "vitest";
import { requireDocument } from "./requireDocument";

describe("requireDocument", () => {
  it("returns the document when present", () => {
    expect(requireDocument("homePage", { hero: null })).toEqual({ hero: null });
  });

  it("throws when the singleton is missing so a build or ISR regeneration fails instead of caching a blank page", () => {
    expect(() => requireDocument("homePage", null)).toThrow('Sanity document "homePage" is missing');
  });
});
