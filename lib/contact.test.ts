import { describe, expect, it } from "vitest";
import { createRateLimiter, isAppsScriptSuccess, toAppsScriptBody, validateRequestAccess } from "./contact";

describe("validateRequestAccess", () => {
  it("trims fields and fills optional ones", () => {
    expect(validateRequestAccess({ name: " Ada ", email: "a@b.co" })).toEqual({
      ok: true,
      value: { name: "Ada", company: "", email: "a@b.co", note: "", optin: false },
    });
  });

  it("only treats optin === true as opted in", () => {
    const result = validateRequestAccess({ name: "Ada", email: "a@b.co", optin: "true" });
    expect(result.ok && result.value.optin).toBe(false);
  });

  it.each([
    [{ email: "a@b.co" }, "Name is required."],
    [{ name: "x".repeat(101), email: "a@b.co" }, "Name must be 100 characters or fewer."],
    [{ name: "Ada" }, "Email is required."],
    [{ name: "Ada", email: "nope" }, "Enter a valid email address."],
    [{ name: "Ada", email: "a@b.co", company: "x".repeat(201) }, "Company must be 200 characters or fewer."],
    [{ name: "Ada", email: "a@b.co", note: "x".repeat(5001) }, "Note must be 5000 characters or fewer."],
    [null, "Invalid request body."],
  ])("rejects %j", (body, error) => {
    expect(validateRequestAccess(body)).toEqual({ ok: false, error });
  });
});

describe("toAppsScriptBody", () => {
  it("matches the Apps Script's urlencoded contract", () => {
    const body = toAppsScriptBody({ name: "Ada", company: "", email: "a@b.co", note: "hi", optin: true });
    expect(body.toString()).toBe("name=Ada&company=&email=a%40b.co&note=hi&optin=Yes");
  });

  it("sends optin=No when not opted in", () => {
    const body = toAppsScriptBody({ name: "Ada", company: "", email: "a@b.co", note: "", optin: false });
    expect(body.get("optin")).toBe("No");
  });
});

describe("isAppsScriptSuccess", () => {
  it("accepts the script's success JSON", () => {
    expect(isAppsScriptSuccess(200, '{"result":"success"}')).toBe(true);
  });

  it.each([
    [200, "<!DOCTYPE html><html><body>Error: TypeError</body></html>"],
    [200, '{"result":"error"}'],
    [500, '{"result":"success"}'],
    [200, ""],
  ])("rejects status %i with body %j", (status, body) => {
    expect(isAppsScriptSuccess(status, body)).toBe(false);
  });
});

describe("createRateLimiter", () => {
  it("allows 5 requests per window, then limits, then resets", () => {
    const isLimited = createRateLimiter(5, 60_000);
    for (let i = 0; i < 5; i++) expect(isLimited("1.2.3.4", 0)).toBe(false);
    expect(isLimited("1.2.3.4", 0)).toBe(true);
    expect(isLimited("5.6.7.8", 0)).toBe(false);
    expect(isLimited("1.2.3.4", 60_001)).toBe(false);
  });
});
