import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found-page">
      <Container>
        <p className="eyebrow">Error / 404</p>
        <div className="not-found-page__code">404</div>
        <h1>This site<br />is still<br /><span>under construction.</span></h1>
        <div className="not-found-page__footer">
          <p>The page you are looking for does not exist or may have moved.</p>
          <div><Link href="/">Back to Home <span aria-hidden="true">↗</span></Link><Link href="/projects">Explore Projects</Link></div>
        </div>
      </Container>
    </main>
  );
}
