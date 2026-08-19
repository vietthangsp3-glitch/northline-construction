import { AdminPageHeader } from "@/components/admin/ui"; import { ProjectEditor } from "@/components/admin/project-editor";import { getMediaAssets } from "@/lib/admin/data";
export const metadata = { title: "New project" };
export default async function NewProjectPage(){const assets=await getMediaAssets();return <main className="admin-page"><AdminPageHeader eyebrow="Projects / New" title="Create project" description="Build a portfolio entry and publish it when every detail is ready."/><ProjectEditor assets={assets}/></main>}
