import { Lines } from "@/components/ui/Lines";
import { CtaLink } from "@/components/CtaLink";

export type HeroContent = {
  headingLines?: string[] | null;
  subheading?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
} | null;

export const HeroSection = ({ hero }: { hero: HeroContent }) => (
  <section id="hero">
    <h1>
      <Lines lines={hero?.headingLines} />
    </h1>
    <p className="hero-sub">{hero?.subheading}</p>
    {hero?.ctaLabel && <CtaLink label={hero.ctaLabel} href={hero.ctaHref} className="btn btn-primary" />}
  </section>
);
