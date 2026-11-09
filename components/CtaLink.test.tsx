import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CtaLink } from "./CtaLink";
import { RequestAccessProvider } from "./request-access/RequestAccessProvider";

const render = (href: string | null, enabled: boolean) =>
  renderToStaticMarkup(
    <RequestAccessProvider enabled={enabled}>
      <CtaLink label="Join Our Community" href={href} className="btn" />
    </RequestAccessProvider>,
  );

const AEF = "https://artesteducationfoundation.org/join-our-community";

describe("CtaLink", () => {
  it("goes to its link, whether or not the form is on", () => {
    const html = `<a href="${AEF}" class="btn">Join Our Community</a>`;
    expect(render(AEF, true)).toBe(html);
    expect(render(AEF, false)).toBe(html);
  });

  it("opens the form when it has no link, as before links existed", () => {
    expect(render(null, true)).toBe('<a href="#" class="btn">Join Our Community</a>');
    expect(render("#request-access", true)).toBe('<a href="#" class="btn">Join Our Community</a>');
  });

  it("is hidden when it would open the form but the form is off", () => {
    expect(render(null, false)).toBe("");
    expect(render("#request-access", false)).toBe("");
  });
});
