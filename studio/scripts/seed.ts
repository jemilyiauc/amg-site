/**
 * One-off: load the original hardcoded AMG site content into the dataset.
 *
 *   cd studio && npx sanity exec scripts/seed.ts --with-user-token
 *
 * Safe to re-run: every document has a fixed _id and is written with
 * createOrReplace, and Sanity dedupes re-uploaded images by content hash.
 * Re-running overwrites any edits made in the Studio, so only run it to
 * bootstrap a fresh dataset.
 */
import { createReadStream } from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";
import { LexoRank } from "lexorank";
import { REQUEST_ACCESS_DEFAULTS } from "../../lib/requestAccessDefaults";

const client = getCliClient({ apiVersion: "2026-02-01" });
const PUBLIC_DIR = path.resolve(process.cwd(), "../public");

const PARTNERS: [name: string, file: string][] = [
  ["BuildOps", "BuildOpsLogo.png"],
  ["LA Times", "LATimesLogo.png"],
  ["Boost", "BoostLogo.png"],
  ["Human Interest", "HumanInterestLogo.png"],
  ["Icarus", "IcarusLogo.png"],
  ["AEF", "AEFLogo.png"],
  ["PlayOn", "PlayOnLogo.png"],
  ["Alibaba", "AlibabaLogo.png"],
  ["T-Mobile", "TMobileLogo.png"],
  ["ADD", "ADDLogo.png"],
  ["Akko", "AkkoLogo.png"],
  ["Lakers", "LakersLogo.png"],
];

const TEAM = [
  {
    id: "metta",
    name: "Metta World Peace",
    role: "Chairman / CEO & Founder",
    bio: "NBA Champion and seasoned executive leveraging 10+ years of business development and VC leadership to drive global impact.",
    file: "Metta.webp",
  },
  {
    id: "stephen-stokols",
    name: "Stephen Stokols",
    role: "Board Member / Co-Chair",
    bio: "Former CEO of Boost Mobile with a track record of scaling multi-billion dollar enterprises and orchestrating the $400M exit of FreedomPop.",
    file: "StephenS.webp",
  },
  {
    id: "nektar-baziotis",
    name: "Nektar Baziotis",
    role: "Chief Technology Officer",
    bio: "Architect behind ICARUS AI and serial entrepreneur with 20+ years of experience architecting scalable global IT solutions and pioneering gen-AI integrations.",
    file: "NektarB.webp",
  },
];

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function uploadImage(relativePath: string) {
  const asset = await client.assets.upload("image", createReadStream(path.join(PUBLIC_DIR, relativePath)), {
    filename: path.basename(relativePath),
  });
  return { _type: "image" as const, asset: { _type: "reference" as const, _ref: asset._id } };
}

// orderRank values in display order, the same format @sanity/orderable-document-list writes.
function ranks(count: number): string[] {
  const out: string[] = [];
  let rank = LexoRank.min();
  for (let i = 0; i < count; i++) {
    rank = rank.genNext();
    out.push(rank.toString());
  }
  return out;
}

async function main() {
  const partnerRanks = ranks(PARTNERS.length);
  const teamRanks = ranks(TEAM.length);

  const partners = await Promise.all(
    PARTNERS.map(async ([name, file], i) => ({
      _id: `partner-${slug(name)}`,
      _type: "partner",
      name,
      logo: await uploadImage(`portfoliopartners/${file}`),
      orderRank: partnerRanks[i],
    })),
  );

  const team = await Promise.all(
    TEAM.map(async (member, i) => ({
      _id: `teamMember-${member.id}`,
      _type: "teamMember",
      name: member.name,
      role: member.role,
      bio: member.bio,
      photo: await uploadImage(`team/${member.file}`),
      orderRank: teamRanks[i],
    })),
  );

  const homePage = {
    _id: "homePage",
    _type: "homePage",
    hero: {
      headingLines: ["Get access to", "exclusive networks", "and opportunities"],
      subheading:
        "A strategic platform for executives, leaders, and investors creating transformative partnerships across industries.",
      ctaLabel: "Request Access",
    },
    portfolio: { heading: "Portfolio & partners" },
    curated: { heading: "Curated by" },
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
  };

  const shareDescription =
    "AMG connects executives, leaders, and investors through an invite-only network of strategic partnerships, capital access, and high-growth opportunities.";

  const siteSettings = {
    _id: "siteSettings",
    _type: "siteSettings",
    navCtaLabel: "Request Access",
    seo: {
      title: "AMG | Artest Management Group — Exclusive Executive Network",
      description: shareDescription,
      ogTitle: "Get access to exclusive networks and opportunities",
      ogDescription: shareDescription,
      ogImage: await uploadImage("AMGSocialBanner.jpg"),
    },
    footer: {
      learnHeading: "Learn",
      learnLinks: [
        { _key: "home", _type: "footerLink", label: "Home", href: "/" },
        { _key: "about", _type: "footerLink", label: "About", href: "#" },
        { _key: "request-access", _type: "footerLink", label: "Request Access", href: "#request-access" },
      ],
      connectHeading: "Connect",
      copyright: "© 2026 Artest Management Group, Inc.",
    },
  };

  const requestAccessForm = { _id: "requestAccessForm", _type: "requestAccessForm", ...REQUEST_ACCESS_DEFAULTS };

  const tx = client.transaction();
  [homePage, siteSettings, requestAccessForm, ...partners, ...team].forEach((doc) => tx.createOrReplace(doc));
  const result = await tx.commit();
  console.log(`Seeded ${result.results.length} documents.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
