import Image from "next/image";
import { ImageReveal } from "@/components/motion/image-reveal";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { Container } from "@/components/ui/container";
import { createPageMetadata, siteConfig } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Contact",
  description: "Contact Northline Construction & Development to discuss your project, partnership, or general inquiry.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main id="main-content" className="contact-page">
      <header className="contact-hero">
        <Container>
          <p className="eyebrow">Contact / New York</p>
          <h1>Start a<br /><span>conversation.</span></h1>
          <div><p>Have a project in mind, or want to learn more about Northline? Tell us what you are working on.</p><dl><div><dt>Email</dt><dd><a href={"mailto:" + siteConfig.email}>{siteConfig.email}</a></dd></div><div><dt>Phone</dt><dd><a href="tel:+12125550147">{siteConfig.phone}</a></dd></div></dl></div>
        </Container>
      </header>

      <section className="contact-main">
        <Container>
          <aside><div className="contact-main__image"><ImageReveal direction="left"><Image src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85" alt="Northline office meeting space" fill sizes="(max-width: 767px) 100vw, 35vw" /></ImageReveal></div><address><span>Northline New York</span>110 West 40th Street<br />New York, NY 10018<br />United States</address><p>Monday&ndash;Friday<br />8:00 AM&ndash;6:00 PM ET</p></aside>
          <div className="contact-main__form"><p className="eyebrow">General Inquiry</p><h2>How can we help?</h2><InquiryForm variant="contact" /></div>
        </Container>
      </section>
    </main>
  );
}
