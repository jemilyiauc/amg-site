import { marqueeDurationSeconds } from "@/lib/marquee";

export type PartnerCard = { _id: string; name: string | null; logoUrl: string | null };

export const PortfolioSection = ({ heading, partners }: { heading?: string | null; partners: PartnerCard[] }) => (
  <section id="portfolio">
    <h2>{heading}</h2>
    <div className="marquee-wrapper">
      <div
        className="marquee-track"
        style={{ "--marquee-duration": `${marqueeDurationSeconds(partners.length)}s` } as React.CSSProperties}
      >
        {/* The list renders twice so the -50% keyframe loops seamlessly. */}
        {[...partners, ...partners].map((partner, index) => (
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
