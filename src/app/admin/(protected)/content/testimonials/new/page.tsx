import { AdminPageHeader } from "@/components/admin/ui";
import { TestimonialEditor } from "@/components/admin/testimonial-editor";
import { getAdminProjects, getMediaAssets } from "@/lib/admin/data";
export const metadata={title:"New testimonial"};
export default async function NewTestimonialPage(){const[projects,assets]=await Promise.all([getAdminProjects(),getMediaAssets()]);return <main className="admin-page"><AdminPageHeader eyebrow="Testimonials / New" title="Add testimonial" description="Publish a client quote only after attribution has been approved."/><TestimonialEditor projects={projects} assets={assets}/></main>}
