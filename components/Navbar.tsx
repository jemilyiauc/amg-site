import { CtaLink } from "@/components/CtaLink";

export const Navbar = ({ ctaLabel, ctaHref }: { ctaLabel?: string | null; ctaHref?: string | null }) => (
  <nav id="navbar">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/AMG_logo.png" className="nav-brand" alt="AMG" />
    {ctaLabel && <CtaLink label={ctaLabel} href={ctaHref} className="btn btn-outline" />}
  </nav>
);
