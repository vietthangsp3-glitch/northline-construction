import Link from "next/link";

export function AdminPageHeader({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: React.ReactNode }) {
  return <header className="admin-page-header"><div className="admin-page-header__copy"><p className="admin-kicker">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>{children && <div className="admin-header-actions">{children}</div>}</header>;
}

export function StatusBadge({ status }: { status: string }) { return <span className={`admin-badge admin-badge--${status}`}>{status.replaceAll("_", " ")}</span>; }
export function formatDate(value: string) { return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
export function EmptyState({ title, copy, href, action }: { title: string; copy: string; href?: string; action?: string }) {
  return <div className="admin-empty"><div><strong>{title}</strong><p>{copy}</p>{href && action && <Link className="admin-button admin-button--primary" href={href}>{action}</Link>}</div></div>;
}
