"use client";

import { useRequestAccess } from "./request-access/RequestAccessProvider";

// Link value that opens the Request Access form instead of navigating. Keep in
// sync with REQUEST_ACCESS_HREF in studio/schemaTypes/shared/siteLinks.ts.
const REQUEST_ACCESS_HREF = "#request-access";

// A button or link from Sanity. With no link of its own it opens the Request
// Access form, so it's hidden while the form is turned off.
export const CtaLink = ({ label, href, className }: { label: string; href?: string | null; className?: string }) => {
  const { enabled, open } = useRequestAccess();

  // Same tab, like the site's other links: going there is the button's whole job.
  if (href && href !== REQUEST_ACCESS_HREF) {
    return (
      <a href={href} className={className}>
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
