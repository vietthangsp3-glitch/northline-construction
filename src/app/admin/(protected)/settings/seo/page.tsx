import { AdminPageHeader } from "@/components/admin/ui";
import { SeoSettingsEditor } from "@/components/admin/settings-editors";
import { getMediaAssets, getSiteSettings } from "@/lib/admin/data";
export const metadata={title:"SEO settings"};
export default async function SeoSettingsPage(){const[rows,assets]=await Promise.all([getSiteSettings(),getMediaAssets()]);const settings=Object.fromEntries(rows.map((item)=>[item.key,item.value]));return <main className="admin-page"><AdminPageHeader eyebrow="Settings / SEO" title="SEO & social previews" description="Set controlled defaults for search results, canonical URLs, and shared links."/><SeoSettingsEditor settings={settings} assets={assets}/></main>}
