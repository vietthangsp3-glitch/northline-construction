import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/lib/site";
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\u003c") }} />
        <noscript><style>{".scroll-image-reveal{opacity:1!important;transform:none!important}"}</style></noscript>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
