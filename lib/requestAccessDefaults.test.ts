import { describe, expect, it } from "vitest";
import { REQUEST_ACCESS_DEFAULTS, withRequestAccessDefaults } from "./requestAccessDefaults";

describe("withRequestAccessDefaults", () => {
  it("returns today's copy when the CMS document is missing", () => {
    expect(withRequestAccessDefaults(null)).toEqual(REQUEST_ACCESS_DEFAULTS);
  });

  it("uses CMS values per field and falls back for the rest", () => {
    const result = withRequestAccessDefaults({ title: "Apply", name: { label: "Full name" } });
    expect(result.title).toBe("Apply");
    expect(result.name.label).toBe("Full name");
    expect(result.name.placeholder).toBe(REQUEST_ACCESS_DEFAULTS.name.placeholder);
    expect(result.email).toEqual(REQUEST_ACCESS_DEFAULTS.email);
  });

  it("treats blank CMS strings as missing", () => {
    expect(withRequestAccessDefaults({ title: "  ", note: { label: null } }).title).toBe(REQUEST_ACCESS_DEFAULTS.title);
    expect(withRequestAccessDefaults({ note: { label: null } }).note.label).toBe(REQUEST_ACCESS_DEFAULTS.note.label);
  });
});
