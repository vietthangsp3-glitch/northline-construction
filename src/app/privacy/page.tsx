import { Container } from "@/components/ui/container";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "Privacy practices for Northline Construction & Development.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <main id="main-content" className="legal-page">
      <Container>
        <p className="eyebrow">Legal / Privacy</p>
        <h1>Privacy Policy</h1>
        <p className="legal-page__updated">Last updated August 18, 2026</p>
        <div className="legal-page__content">
          <section><h2>Information we receive</h2><p>When you contact Northline or request information, we may receive details such as your name, email address, phone number, company, project information, and the content of your message. We collect only the information needed to respond to your inquiry.</p></section>
          <section><h2>How information is used</h2><p>Information is used to respond to requests, evaluate potential projects, maintain business correspondence, and improve our website. We do not sell personal information.</p></section>
          <section><h2>Retention and security</h2><p>We retain correspondence only as long as reasonably necessary for business, legal, and security purposes. We use appropriate administrative and technical safeguards, though no internet transmission can be guaranteed completely secure.</p></section>
          <section><h2>Your choices</h2><p>You may request access to, correction of, or deletion of personal information you have submitted by emailing hello@northlinebuild.com. Applicable legal obligations may require us to retain limited records.</p></section>
        </div>
      </Container>
    </main>
  );
}
