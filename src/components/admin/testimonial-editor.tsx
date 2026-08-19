import Link from "next/link";
import { deleteTestimonial, saveTestimonial } from "@/app/admin/(protected)/actions";
import { ConfirmDeleteButton } from "@/components/admin/media-actions";
import { MediaPicker, type MediaOption } from "@/components/admin/media-picker";

interface TestimonialRecord {
  id: string;
  client_name: string;
  company: string | null;
  job_title: string | null;
  quote: string;
  avatar_path: string | null;
  avatar_url: string | null;
  avatar_alt: string | null;
  project_id: string | null;
  featured: boolean;
  sort_order: number;
  published: boolean;
}

interface ProjectOption {
  id: string;
  title: string;
  status: string;
}

export function TestimonialEditor({ testimonial, projects, assets }: { testimonial?: TestimonialRecord | null; projects: ProjectOption[]; assets: MediaOption[] }) {
  const avatar = testimonial?.avatar_url
    ? { url: testimonial.avatar_url, path: testimonial.avatar_path || "", alt: testimonial.avatar_alt || "", width: null, height: null }
    : null;

  return (
    <>
      <form action={saveTestimonial} className="admin-form-sections">
        {testimonial && <input type="hidden" name="id" value={testimonial.id} />}
        <section className="admin-form-section">
          <header className="admin-form-section__heading"><h2>Client perspective</h2><p>Keep attribution accurate and the quote concise enough for the homepage.</p></header>
          <div className="admin-form-section__body admin-form-grid">
            <div className="admin-field"><label htmlFor="testimonial-name">Client name</label><input id="testimonial-name" name="clientName" defaultValue={testimonial?.client_name} minLength={2} maxLength={120} required /></div>
            <div className="admin-field"><label htmlFor="testimonial-company">Company</label><input id="testimonial-company" name="company" defaultValue={testimonial?.company || ""} maxLength={160} /></div>
            <div className="admin-field"><label htmlFor="testimonial-role">Job title</label><input id="testimonial-role" name="jobTitle" defaultValue={testimonial?.job_title || ""} maxLength={160} /></div>
            <div className="admin-field"><label htmlFor="testimonial-project">Related project</label><select id="testimonial-project" name="projectId" defaultValue={testimonial?.project_id || ""}><option value="">No project reference</option>{projects.map((project) => <option value={project.id} key={project.id}>{project.title}{project.status !== "published" ? ` (${project.status})` : ""}</option>)}</select></div>
            <div className="admin-field admin-field--wide"><label className="admin-field__label" htmlFor="testimonial-quote">Quote <span>20–800 characters</span></label><textarea id="testimonial-quote" name="quote" defaultValue={testimonial?.quote} minLength={20} maxLength={800} required rows={7} /></div>
          </div>
        </section>
        <section className="admin-form-section">
          <header className="admin-form-section__heading"><h2>Avatar</h2><p>Optional; a square portrait works best.</p></header>
          <div className="admin-form-section__body"><MediaPicker name="avatar" label="Client avatar" value={avatar} assets={assets} /></div>
        </section>
        <section className="admin-form-section">
          <header className="admin-form-section__heading"><h2>Publishing</h2><p>Only published testimonials can appear on the public homepage.</p></header>
          <div className="admin-form-section__body admin-form-grid">
            <div className="admin-field"><label htmlFor="testimonial-order">Sort order</label><input id="testimonial-order" name="sortOrder" type="number" min={-1000} max={1000} defaultValue={testimonial?.sort_order || 0} /></div>
            <label className="admin-field"><span><input name="featured" type="checkbox" defaultChecked={testimonial?.featured} /> Featured on homepage</span></label>
            <label className="admin-field"><span><input name="published" type="checkbox" defaultChecked={testimonial?.published} /> Published</span></label>
          </div>
        </section>
        <footer className="admin-form-footer"><Link className="admin-button" href="/admin/content/testimonials">Cancel</Link><button className="admin-button admin-button--primary" type="submit">{testimonial ? "Save testimonial" : "Create testimonial"}</button></footer>
      </form>

      {testimonial && (
        <section className="admin-form-section admin-danger-zone">
          <header className="admin-form-section__heading"><h2>Delete testimonial</h2><p>This permanently removes the testimonial record.</p></header>
          <div className="admin-form-section__body">
            <form action={deleteTestimonial}>
              <input type="hidden" name="id" value={testimonial.id} />
              <ConfirmDeleteButton message="Permanently delete this testimonial?" />
            </form>
          </div>
        </section>
      )}
    </>
  );
}
