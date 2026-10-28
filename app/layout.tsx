import type { Metadata } from "next";
import localFont from "next/font/local";
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
const DESCRIPTION =
  "AMG connects executives, leaders, and investors through an invite-only network of strategic partnerships, capital access, and high-growth opportunities.";
const SHARE_TITLE = "Get access to exclusive networks and opportunities";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "AMG | Artest Management Group — Exclusive Executive Network",
  description: DESCRIPTION,
  alternates: { canonical: SITE_URL },
  icons: { icon: "/AMG_logo.png" },
  openGraph: {
    type: "website",
    siteName: "AMG",
    title: SHARE_TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    images: [{ url: "/AMGSocialBanner.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: SHARE_TITLE,
    description: DESCRIPTION,
    images: ["/AMGSocialBanner.jpg"],
  },
};

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={zalando.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <div
          id="vanta-bg"
          style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none" }}
        />
        <div id="glass-layer" />
        <div id="app">{children}</div>
      </body>
    </html>
  );
}
