export type RequestAccessInput = {
  name: string;
  company: string;
  email: string;
  note: string;
  optin: boolean;
};

type ValidationResult = { ok: true; value: RequestAccessInput } | { ok: false; error: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

export function validateRequestAccess(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid request body." };
  const fields = body as Record<string, unknown>;

  const value: RequestAccessInput = {
    name: text(fields.name),
    company: text(fields.company),
    email: text(fields.email),
    note: text(fields.note),
    optin: fields.optin === true,
  };

  if (!value.name) return { ok: false, error: "Name is required." };
  if (value.name.length > 100) return { ok: false, error: "Name must be 100 characters or fewer." };
  if (!value.email) return { ok: false, error: "Email is required." };
  if (!EMAIL_REGEX.test(value.email)) return { ok: false, error: "Enter a valid email address." };
  if (value.company.length > 200) return { ok: false, error: "Company must be 200 characters or fewer." };
  if (value.note.length > 5000) return { ok: false, error: "Note must be 5000 characters or fewer." };

  return { ok: true, value };
}

// The Apps Script reads e.parameter.*, so it needs a form-encoded body with these exact keys.
export function toAppsScriptBody(input: RequestAccessInput): URLSearchParams {
  return new URLSearchParams({
    name: input.name,
    company: input.company,
    email: input.email,
    note: input.note,
    optin: input.optin ? "Yes" : "No",
  });
}

// Apps Script answers 200 even when doPost throws (with an HTML error page),
// so only the script's own {"result":"success"} counts as saved.
export function isAppsScriptSuccess(status: number, bodyText: string): boolean {
  if (status < 200 || status >= 300) return false;
  try {
    return JSON.parse(bodyText)?.result === "success";
  } catch {
    return false;
  }
}

export function createRateLimiter(max: number, windowMs: number): (key: string, now: number) => boolean {
  const entries = new Map<string, { count: number; resetAt: number }>();

  return (key, now) => {
    const entry = entries.get(key);
    if (!entry || now > entry.resetAt) {
      entries.set(key, { count: 1, resetAt: now + windowMs });
      return false;
    }
    if (entry.count >= max) return true;
    entry.count++;
    return false;
  };
}
