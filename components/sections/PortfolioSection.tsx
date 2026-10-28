import { marqueeDurationSeconds, marqueeRepeat } from "@/lib/marquee";

export type PartnerCard = {
  _id: string;
  name: string | null;
  logoUrl: string | null;
};

export const PortfolioSection = ({ heading, partners }: { heading?: string | null; partners: PartnerCard[] }) => {
  // A short list is repeated so one half of the track still spans the screen.
  const half = Array.from({ length: marqueeRepeat(partners.length) }, () => partners).flat();

  return (
    <section id="portfolio">
      <h2>{heading}</h2>
      <div className="marquee-wrapper">
        <div
          className="marquee-track"
          style={
            {
              "--marquee-duration": `${marqueeDurationSeconds(half.length)}s`,
            } as React.CSSProperties
          }
        >
          {/* The half renders twice so the -50% keyframe loops seamlessly. */}
          {[...half, ...half].map((partner, index) => (
            <div key={`${partner._id}-${index}`} className="logo-box" aria-hidden={index >= partners.length}>
              {partner.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={partner.logoUrl} alt={partner.name ?? ""} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
