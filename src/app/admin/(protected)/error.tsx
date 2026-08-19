"use client";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="admin-page"><div className="admin-empty"><div><strong>We couldn’t load this workspace.</strong><p>The request was not completed. No changes were made.</p><button className="admin-button admin-button--primary" type="button" onClick={reset}>Try again</button></div></div></main>;
}
