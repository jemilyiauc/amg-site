import { Lines } from "@/components/ui/Lines";
import { RequestAccessButton } from "@/components/request-access/RequestAccessButton";

export type ExploreContent = {
  headingLines?: string[] | null;
  body?: string | null;
  ctaLabel?: string | null;
} | null;

export const ExploreSection = ({ explore }: { explore: ExploreContent }) => (
  <section id="explore">
    <h2>
      <Lines lines={explore?.headingLines} />
    </h2>
    <p>{explore?.body}</p>
    {explore?.ctaLabel && <RequestAccessButton label={explore.ctaLabel} className="btn btn-primary" />}
  </section>
);
