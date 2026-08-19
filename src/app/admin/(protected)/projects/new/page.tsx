import { AdminPageHeader } from "@/components/admin/ui"; import { ProjectEditor } from "@/components/admin/project-editor";
export const metadata = { title: "New project" };
export default function NewProjectPage(){return <main className="admin-page"><AdminPageHeader eyebrow="Projects / New" title="Create project" description="Build a portfolio entry and publish it when every detail is ready."/><ProjectEditor/></main>}
