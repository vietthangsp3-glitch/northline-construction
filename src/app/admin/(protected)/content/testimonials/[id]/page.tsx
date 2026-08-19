import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/ui";
import { TestimonialEditor } from "@/components/admin/testimonial-editor";
import { getAdminProjects, getAdminTestimonial, getMediaAssets } from "@/lib/admin/data";
export default async function EditTestimonialPage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{saved?:string}>}){const{id}=await params;const[testimonial,projects,assets]=await Promise.all([getAdminTestimonial(id),getAdminProjects(),getMediaAssets()]);if(!testimonial)notFound();return <main className="admin-page"><AdminPageHeader eyebrow="Testimonials / Editor" title={testimonial.client_name} description="Edit attribution, imagery, placement, and publishing status."/>{(await searchParams).saved&&<div className="admin-alert" role="status">Testimonial saved successfully.</div>}<TestimonialEditor testimonial={testimonial} projects={projects} assets={assets}/></main>}
