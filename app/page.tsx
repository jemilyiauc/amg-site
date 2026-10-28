import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PageEffects } from "@/components/PageEffects";
import { ApproachSection } from "@/components/sections/ApproachSection";
import { CuratedSection, type TeamCard } from "@/components/sections/CuratedSection";
import { ExploreSection } from "@/components/sections/ExploreSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { PortfolioSection, type PartnerCard } from "@/components/sections/PortfolioSection";
import { UnlockSection } from "@/components/sections/UnlockSection";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { HOME_PAGE_QUERY, PARTNERS_QUERY, SITE_SETTINGS_QUERY, TEAM_QUERY } from "@/sanity/lib/queries";
import type { PARTNERS_QUERY_RESULT, TEAM_QUERY_RESULT } from "@/sanity.types";

const toPartnerCard = (partner: PARTNERS_QUERY_RESULT[number]): PartnerCard => ({
  _id: partner._id,
  name: partner.name,
  logoUrl: partner.logo?.asset ? urlFor(partner.logo).height(240).url() : null,
});

// 660×885 matches the card's fixed aspect ratio; the crop respects the editor's hotspot.
const toTeamCard = (member: TEAM_QUERY_RESULT[number]): TeamCard => ({
  _id: member._id,
  name: member.name,
  role: member.role,
  bio: member.bio,
  photoUrl: member.photo?.asset ? urlFor(member.photo).width(660).height(885).fit("crop").url() : null,
});

export default async function Home() {
  const [homePage, siteSettings, partners, team] = await Promise.all([
    sanityFetch({ query: HOME_PAGE_QUERY })
      .then(({ data }) => data ?? null)
      .catch((err) => {
        console.error("HOME_PAGE_QUERY failed", err);
        return null;
      }),
    sanityFetch({ query: SITE_SETTINGS_QUERY })
      .then(({ data }) => data ?? null)
      .catch((err) => {
        console.error("SITE_SETTINGS_QUERY failed", err);
        return null;
      }),
    sanityFetch({ query: PARTNERS_QUERY })
      .then(({ data }) => (data ?? []).map(toPartnerCard))
      .catch((err) => {
        console.error("PARTNERS_QUERY failed", err);
        return [] as PartnerCard[];
      }),
    sanityFetch({ query: TEAM_QUERY })
      .then(({ data }) => (data ?? []).map(toTeamCard))
      .catch((err) => {
        console.error("TEAM_QUERY failed", err);
        return [] as TeamCard[];
      }),
  ]);

  return (
    <>
      <Navbar ctaLabel={siteSettings?.navCtaLabel} />
      <main>
        <HeroSection hero={homePage?.hero ?? null} />
        <PortfolioSection heading={homePage?.portfolio?.heading} partners={partners} />
        <CuratedSection heading={homePage?.curated?.heading} team={team} />
        <ApproachSection approach={homePage?.approach ?? null} />
        <UnlockSection unlock={homePage?.unlock ?? null} />
        <div className="glass-bottom">
          <ExploreSection explore={homePage?.explore ?? null} />
          <Footer footer={siteSettings?.footer ?? null} />
        </div>
      </main>
      <PageEffects />
    </>
  );
}
