import Link from "next/link";
import { Container } from "@/components/ui/container";
import { navigation } from "@/data/navigation";
import { siteConfig } from "@/lib/site";

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "Instagram", href: "https://www.instagram.com" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="site-footer__top">
          <div className="site-footer__identity">
            <Link className="wordmark" href="/" aria-label="Northline home">NORTHLINE</Link>
            <p>Construction<br />&amp; Development</p>
          </div>
          <div className="site-footer__columns">
            <div>
              <h2>Navigate</h2>
              <ul>{navigation.map((item) => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}</ul>
            </div>
            <div>
              <h2>Connect</h2>
              <ul>
                {socialLinks.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} target="_blank" rel="noreferrer">{item.label}<span className="sr-only"> (opens in a new tab)</span></a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="site-footer__contact">
              <h2>Contact</h2>
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              <a href="tel:+12125550147">{siteConfig.phone}</a>
            </div>
          </div>
        </div>
        <div className="site-footer__bottom">
          <p>© 2026 Northline Construction &amp; Development</p>
          <div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
          <a href="#main-content">Back to Top <span aria-hidden="true">↑</span></a>
        </div>
      </Container>
    </footer>
  );
}
