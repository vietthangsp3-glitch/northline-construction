import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { AppChrome } from "@/components/layout/app-chrome";
import { siteConfig } from "@/lib/site";
import { getPublicSettings } from "@/lib/content/public";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Northline Construction & Development | Building What's Next",
    template: "%s | Northline",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: siteConfig.name,
    title: "Northline Construction & Development",
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Northline Construction & Development",
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f4f2ed",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  slogan: "We Build What's Next.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "110 West 40th Street",
    addressLocality: "New York",
    addressRegion: "NY",
    postalCode: "10018",
    addressCountry: "US",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "project inquiries",
    email: siteConfig.email,
    telephone: siteConfig.phone,
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getPublicSettings();
  const business = settings.business as {email?:string;phone?:string}|undefined;
  const social = settings.social as {linkedin?:string;instagram?:string}|undefined;
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\u003c") }} />
        <noscript><style>{".scroll-image-reveal{opacity:1!important;transform:none!important}"}</style></noscript>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <AppChrome business={business} social={social}>{children}</AppChrome>
      </body>
    </html>
  );
}
