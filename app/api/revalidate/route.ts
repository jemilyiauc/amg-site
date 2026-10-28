import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook → on-demand revalidation.
 *
 * Configure a GROQ-powered webhook in sanity.io/manage pointing at this route:
 *   - Filter:     _type in ["homePage", "siteSettings", "requestAccessForm", "partner", "teamMember"]
 *   - Projection: { "type": _type }
 *   - Secret:     SANITY_REVALIDATE_SECRET (same value as the env var)
 *
 * Publishing a document then revalidates the page(s) that render that type,
 * so production (static pages) reflects the change within seconds — no redeploy.
 */
type WebhookPayload = { type?: string };

// Which routes render each document type. Everything lives on the one page.
function pathsForType(type: string): string[] {
  switch (type) {
    case "homePage":
    case "siteSettings":
    case "requestAccessForm":
    case "partner":
    case "teamMember":
      return ["/"];
    default:
      return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      // Wait for Content Lake eventual consistency so the revalidated fetch is fresh.
      true,
    );

    if (!isValidSignature) {
      return new Response("Invalid signature", { status: 401 });
    }
    if (!body?.type) {
      return new Response("Bad Request: missing 'type' in payload", { status: 400 });
    }

    const paths = pathsForType(body.type);
    paths.forEach((path) => revalidatePath(path));

    return NextResponse.json({ revalidated: true, type: body.type, paths });
  } catch (err) {
    return new Response((err as Error).message, { status: 500 });
  }
}
