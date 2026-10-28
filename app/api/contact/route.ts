import { type NextRequest, NextResponse } from "next/server";
import { createRateLimiter, isAppsScriptSuccess, toAppsScriptBody, validateRequestAccess } from "@/lib/contact";

// In-memory, per server instance: best-effort on serverless, same as AEF.
const isRateLimited = createRateLimiter(5, 60_000);

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip, Date.now())) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = validateRequestAccess(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!scriptUrl) {
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  try {
    const res = await fetch(scriptUrl, {
      method: "POST",
      body: toAppsScriptBody(result.value),
      signal: AbortSignal.timeout(10_000),
    });
    const text = await res.text();
    if (!isAppsScriptSuccess(res.status, text)) {
      throw new Error(`Apps Script responded ${res.status}: ${text.slice(0, 200)}`);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact route]", err);
    return NextResponse.json({ error: "Failed to save submission." }, { status: 502 });
  }
}
