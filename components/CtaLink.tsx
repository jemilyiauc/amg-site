"use client";

import { useRequestAccess } from "./request-access/RequestAccessProvider";

// Link value that opens the Request Access form instead of navigating. Keep in
// sync with REQUEST_ACCESS_HREF in studio/schemaTypes/shared/siteLinks.ts.
const REQUEST_ACCESS_HREF = "#request-access";

// A button or link from Sanity. With no link of its own it opens the Request
// Access form, so it's hidden while the form is turned off.
export const CtaLink = ({ label, href, className }: { label: string; href?: string | null; className?: string }) => {
  const { enabled, open } = useRequestAccess();

  if (href && href !== REQUEST_ACCESS_HREF) {
    // Another website opens in a new tab so the AMG site stays open behind it.
    const external = /^https?:\/\//.test(href);
    return (
      <a href={href} className={className} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
        {label}
      </a>
    );
  }

  if (!enabled) return null;

  return (
    <a
      href="#"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        open();
      }}
    >
      {label}
    </a>
  );
};
