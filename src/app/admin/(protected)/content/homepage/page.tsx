import { AdminPageHeader } from "@/components/admin/ui";
import { HomepageEditor } from "@/components/admin/homepage-editor";
import { getHomepageAdminData } from "@/lib/admin/data";
import { parseHomepageContent } from "@/lib/content/homepage";

export const metadata = { title: "Homepage CMS" };

export default async function HomepageContentPage() {
  const data = await getHomepageAdminData();
  return <main className="admin-page admin-page--editor"><AdminPageHeader eyebrow="Content / Homepage" title="Homepage" description="Edit content and imagery within Northline’s approved visual system."/><HomepageEditor initial={parseHomepageContent(data.content)} assets={data.media} projects={data.projects} services={data.services} updatedAt={data.updatedAt}/></main>;
}
