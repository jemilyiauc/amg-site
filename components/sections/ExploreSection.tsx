import { Lines } from "@/components/ui/Lines";
import { CtaLink } from "@/components/CtaLink";

export type ExploreContent = {
  headingLines?: string[] | null;
  body?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
} | null;

export const ExploreSection = ({ explore }: { explore: ExploreContent }) => (
  <section id="explore">
    <h2>
      <Lines lines={explore?.headingLines} />
    </h2>
    <p>{explore?.body}</p>
    {explore?.ctaLabel && <CtaLink label={explore.ctaLabel} href={explore.ctaHref} className="btn btn-primary" />}
  </section>
);
