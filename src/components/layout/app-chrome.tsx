"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function AppChrome({ children, business, social, footer }: { children: React.ReactNode; business?: {name?:string;email?:string;phone?:string;address?:string;hours?:string}; social?: {linkedin?:string;instagram?:string}; footer?:{description?:string;copyright?:string;contactCta?:string} }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return children;
  return <><SiteHeader />{children}<SiteFooter business={business} social={social} footer={footer} /></>;
}
