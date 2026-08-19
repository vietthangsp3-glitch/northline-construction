"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function AppChrome({ children, business, social }: { children: React.ReactNode; business?: {email?:string;phone?:string}; social?: {linkedin?:string;instagram?:string} }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return children;
  return <><SiteHeader />{children}<SiteFooter business={business} social={social} /></>;
}
