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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  const seo = (settings.seo || {}) as {title?:string;description?:string;siteName?:string;ogImage?:{url?:string;alt?:string;width?:number;height?:number}};
  const title=seo.title||"Northline Construction & Development | Building What's Next";const description=seo.description||siteConfig.description;const siteName=seo.siteName||siteConfig.name;const og=seo.ogImage?.url?[{url:seo.ogImage.url,width:seo.ogImage.width||1200,height:seo.ogImage.height||630,alt:seo.ogImage.alt||siteName}]:undefined;
  return {metadataBase:new URL(siteConfig.url),title:{default:title,template:"%s | Northline"},description,applicationName:siteName,authors:[{name:siteName,url:siteConfig.url}],creator:siteName,publisher:siteName,openGraph:{type:"website",locale:"en_US",url:"/",siteName,title,description,images:og},twitter:{card:"summary_large_image",title,description,images:og?.map((item)=>item.url)}};
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f4f2ed",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getPublicSettings();
  const business = settings.business as {name?:string;email?:string;phone?:string;address?:string;hours?:string}|undefined;
  const social = settings.social as {linkedin?:string;instagram?:string}|undefined;
  const footer = settings.footer as {description?:string;copyright?:string;contactCta?:string}|undefined;
  const organizationSchema={"@context":"https://schema.org","@type":"Organization",name:business?.name||siteConfig.name,url:siteConfig.url,email:business?.email||siteConfig.email,telephone:business?.phone||siteConfig.phone,slogan:"We Build What's Next.",address:business?.address,contactPoint:{"@type":"ContactPoint",contactType:"project inquiries",email:business?.email||siteConfig.email,telephone:business?.phone||siteConfig.phone}};
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\u003c") }} />
        <noscript><style>{".scroll-image-reveal{opacity:1!important;transform:none!important}"}</style></noscript>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <AppChrome business={business} social={social} footer={footer}>{children}</AppChrome>
      </body>
    </html>
  );
}
