import type { Metadata } from "next";

const fallbackUrl = "https://northlinebuild.com";

export const siteConfig = {
  name: "Northline Construction & Development",
  shortName: "NORTHLINE",
  description:
    "Building exceptional spaces through precision, craftsmanship, and uncompromising standards.",
  url: process.env.NEXT_PUBLIC_SITE_URL || fallbackUrl,
  email: "hello@northlinebuild.com",
  phone: "+1 212 555 0147",
  location: "New York, NY",
} as const;

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: `/${string}` | "/";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
