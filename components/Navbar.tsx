import { RequestAccessButton } from "@/components/request-access/RequestAccessButton";

export const Navbar = ({ ctaLabel }: { ctaLabel?: string | null }) => (
  <nav id="navbar">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/AMG_logo.png" className="nav-brand" alt="AMG" />
    {ctaLabel && <RequestAccessButton label={ctaLabel} className="btn btn-outline" />}
  </nav>
);
