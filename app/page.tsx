import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PageEffects } from "@/components/PageEffects";
import { ApproachSection } from "@/components/sections/ApproachSection";
import { CuratedSection } from "@/components/sections/CuratedSection";
import { ExploreSection } from "@/components/sections/ExploreSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { UnlockSection } from "@/components/sections/UnlockSection";

// Temporary: today's copy, hardcoded until the page reads from Sanity.
const PARTNERS = [
  ["BuildOps", "BuildOpsLogo"],
  ["LA Times", "LATimesLogo"],
  ["Boost", "BoostLogo"],
  ["Human Interest", "HumanInterestLogo"],
  ["Icarus", "IcarusLogo"],
  ["AEF", "AEFLogo"],
  ["PlayOn", "PlayOnLogo"],
  ["Alibaba", "AlibabaLogo"],
  ["T-Mobile", "TMobileLogo"],
  ["ADD", "ADDLogo"],
  ["Akko", "AkkoLogo"],
  ["Lakers", "LakersLogo"],
].map(([name, file]) => ({ _id: file, name, logoUrl: `/portfoliopartners/${file}.png` }));

const content = {
  navCtaLabel: "Request Access",
  hero: {
    headingLines: ["Get access to", "exclusive networks", "and opportunities"],
    subheading:
      "A strategic platform for executives, leaders, and investors creating transformative partnerships across industries.",
    ctaLabel: "Request Access",
  },
  portfolioHeading: "Portfolio & partners",
  curatedHeading: "Curated by",
  team: [
    {
      _id: "metta",
      name: "Metta World Peace",
      role: "Chairman / CEO & Founder",
      bio: "NBA Champion and seasoned executive leveraging 10+ years of business development and VC leadership to drive global impact.",
      photoUrl: "/team/Metta.webp",
    },
    {
      _id: "stephen-stokols",
      name: "Stephen Stokols",
      role: "Board Member / Co-Chair",
      bio: "Former CEO of Boost Mobile with a track record of scaling multi-billion dollar enterprises and orchestrating the $400M exit of FreedomPop.",
      photoUrl: "/team/StephenS.webp",
    },
    {
      _id: "nektar-baziotis",
      name: "Nektar Baziotis",
      role: "Chief Technology Officer",
      bio: "Architect behind ICARUS AI and serial entrepreneur with 20+ years of experience architecting scalable global IT solutions and pioneering gen-AI integrations.",
      photoUrl: "/team/NektarB.webp",
    },
  ],
  approach: {
    label: "Our approach",
    body: "AMG operates as a strategic management and growth platform, creating pathways to success through meaningful networks of executives, leaders, and investors.",
  },
  unlock: {
    headingLines: ["Unlock", "opportunities", "through"],
    items: [
      "invite-only events",
      "private Slack",
      "global collaborators",
      "strategic partnerships",
      "high-growth portfolios",
      "capital access",
    ],
  },
  explore: {
    headingLines: ["Explore", "alignment"],
    body: "If you are seeking partnership, investment alignment, or strategic collaboration, we invite you to apply for access.",
    ctaLabel: "Request Access",
  },
  footer: {
    learnHeading: "Learn",
    learnLinks: [
      { label: "Home", href: "/" },
      { label: "About", href: "#" },
      { label: "Request Access", href: "#request-access" },
    ],
    connectHeading: "Connect",
    socials: { linkedin: "#", x: "#", instagram: "#" },
    copyright: "© 2026 Artest Management Group, Inc.",
  },
};

export default function Home() {
  return (
    <>
      <Navbar ctaLabel={content.navCtaLabel} />
      <main>
        <HeroSection hero={content.hero} />
        <PortfolioSection heading={content.portfolioHeading} partners={PARTNERS} />
        <CuratedSection heading={content.curatedHeading} team={content.team} />
        <ApproachSection approach={content.approach} />
        <UnlockSection unlock={content.unlock} />
        <div className="glass-bottom">
          <ExploreSection explore={content.explore} />
          <Footer footer={content.footer} />
        </div>
      </main>
      <PageEffects />
    </>
  );
}
