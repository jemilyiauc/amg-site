import type { Metadata } from "next";
import localFont from "next/font/local";
import { LightBeamBackground } from "@/components/LightBeamBackground";
import { RequestAccessModal } from "@/components/request-access/RequestAccessModal";
import { RequestAccessProvider } from "@/components/request-access/RequestAccessProvider";
import { withRequestAccessDefaults } from "@/lib/requestAccessDefaults";
import { urlFor } from "@/sanity/lib/image";
import { SanityLive, sanityFetch } from "@/sanity/lib/live";
import { REQUEST_ACCESS_FORM_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import "./globals.css";

const zalando = localFont({
  src: [
    { path: "../public/fonts/ZalandoSans-VariableFont_wdth,wght.ttf", style: "normal" },
    { path: "../public/fonts/ZalandoSans-Italic-VariableFont_wdth,wght.ttf", style: "italic" },
  ],
  variable: "--font-zalando",
  weight: "100 900",
  display: "swap",
});

const SITE_URL = "https://www.artestmanagementgroup.com/";

// Today's copy; each one is used when the matching Site Settings field is empty.
const SEO_DEFAULTS = {
  title: "AMG | Artest Management Group — Exclusive Executive Network",
  description:
    "AMG connects executives, leaders, and investors through an invite-only network of strategic partnerships, capital access, and high-growth opportunities.",
  ogTitle: "Get access to exclusive networks and opportunities",
  ogImageUrl: "/AMGSocialBanner.jpg",
};

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  const seo = data?.seo ?? null;

  const title = seo?.title || SEO_DEFAULTS.title;
  const description = seo?.description || SEO_DEFAULTS.description;
  const ogTitle = seo?.ogTitle || SEO_DEFAULTS.ogTitle;
  const ogDescription = seo?.ogDescription || description;
  const ogImageUrl = seo?.ogImage?.asset
    ? urlFor(seo.ogImage).width(1200).height(630).fit("crop").url()
    : SEO_DEFAULTS.ogImageUrl;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: SITE_URL },
    icons: { icon: "/AMG_logo.png" },
    openGraph: {
      type: "website",
      siteName: "AMG",
      title: ogTitle,
      description: ogDescription,
      url: SITE_URL,
      locale: "en_US",
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImageUrl],
    },
  };
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AMG",
  alternateName: "Artest Management Group",
  url: SITE_URL,
  logo: "https://www.artestmanagementgroup.com/AMG_logo.png",
  description:
    "AMG is a strategic management and growth platform creating pathways to success through invite-only networks of executives, leaders, and investors.",
  founder: {
    "@type": "Person",
    name: "Metta World Peace",
    jobTitle: "Chairman / CEO & Founder",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // A failed fetch throws (see sanity/lib/requireDocument.ts); missing fields fall back to today's copy.
  const { data: requestAccessForm } = await sanityFetch({ query: REQUEST_ACCESS_FORM_QUERY });

  return (
    <html lang="en" className={zalando.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <LightBeamBackground />
        <div id="glass-layer" />
        <RequestAccessProvider>
          <div id="app">{children}</div>
          <RequestAccessModal content={withRequestAccessDefaults(requestAccessForm)} />
        </RequestAccessProvider>
        <SanityLive />
      </body>
    </html>
  );
}
