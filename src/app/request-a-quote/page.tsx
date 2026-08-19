import { InquiryForm } from "@/components/forms/inquiry-form";
import { Container } from "@/components/ui/container";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Start a Project",
  description: "Share your project goals, location, budget, and timeline with Northline's construction team.",
  path: "/request-a-quote",
});

export default function RequestQuotePage() {
  return (
    <main id="main-content" className="quote-page">
      <header className="quote-hero">
        <Container>
          <p className="eyebrow">Project Inquiry / Northline</p>
          <h1>Let&apos;s build<br /><span>what&apos;s next.</span></h1>
          <div><p>Good projects begin with a clear conversation. Share what you know today; our team will help define what comes next.</p><p>Fields marked with an asterisk are required.</p></div>
        </Container>
      </header>
      <section className="quote-form-section">
        <Container>
          <div className="quote-form-section__intro"><p className="eyebrow">Your Project</p><h2>Tell us about<br />the opportunity.</h2><p>We typically respond within two business days. Information is reviewed by our project development team.</p></div>
          <InquiryForm variant="quote" />
        </Container>
      </section>
    </main>
  );
}
