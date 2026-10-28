import { Lines } from "@/components/ui/Lines";
import { RequestAccessButton } from "@/components/request-access/RequestAccessButton";

export type HeroContent = {
  headingLines?: string[] | null;
  subheading?: string | null;
  ctaLabel?: string | null;
} | null;

export const HeroSection = ({ hero }: { hero: HeroContent }) => (
  <section id="hero">
    <h1>
      <Lines lines={hero?.headingLines} />
    </h1>
    <p className="hero-sub">{hero?.subheading}</p>
    {hero?.ctaLabel && <RequestAccessButton label={hero.ctaLabel} className="btn btn-primary" />}
  </section>
);
