import { Container } from "@/components/ui/container";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Terms of Use",
  description: "Website terms for Northline Construction & Development.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <main id="main-content" className="legal-page">
      <Container>
        <p className="eyebrow">Legal / Terms</p>
        <h1>Terms of Use</h1>
        <p className="legal-page__updated">Last updated August 18, 2026</p>
        <div className="legal-page__content">
          <section><h2>Website use</h2><p>This website provides general information about Northline Construction &amp; Development and its capabilities. You may use the site for lawful informational and business purposes only.</p></section>
          <section><h2>Project information</h2><p>Project descriptions, schedules, values, and other details are provided for general context and do not constitute a proposal, guarantee, or contractual commitment. Project-specific terms must be agreed in writing.</p></section>
          <section><h2>Intellectual property</h2><p>Website design, text, graphics, and brand elements are protected by applicable intellectual property laws. They may not be reproduced or used commercially without written permission.</p></section>
          <section><h2>External links</h2><p>Links to third-party websites are provided for convenience. Northline does not control and is not responsible for their content, availability, or privacy practices.</p></section>
        </div>
      </Container>
    </main>
  );
}
