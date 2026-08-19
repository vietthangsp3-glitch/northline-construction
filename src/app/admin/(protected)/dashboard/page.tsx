import Link from "next/link";
import { AdminPageHeader, EmptyState, StatusBadge, formatDate } from "@/components/admin/ui";
import { getDashboardData } from "@/lib/admin/data";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const data = await getDashboardData();
  const metrics = [
    ["Total inquiries", data.counts.inquiries, `${data.counts.monthInquiries} this month`], ["New inquiries", data.counts.newInquiries, "Awaiting review"],
    ["Total projects", data.counts.projects, `${data.counts.published} published`], ["Draft projects", data.counts.drafts, "Not visible publicly"],
  ] as const;
  return <main className="admin-page"><AdminPageHeader eyebrow="Overview / Live data" title="Good work starts with clarity." description="A focused view of website content and client activity."><Link className="admin-button admin-button--primary" href="/admin/projects/new">New project <span aria-hidden="true">＋</span></Link></AdminPageHeader>
    {!data.configured && <div className="admin-alert" role="status">Admin database tables are not available yet. Run migration <strong>202608190002_create_admin_cms.sql</strong>, then create an approved admin profile.</div>}
    <section className="admin-metrics" aria-label="Business metrics">{metrics.map(([label,value,detail]) => <article className="admin-metric" key={label}><p>{label}</p><strong>{value}</strong><span>{detail}</span></article>)}</section>
    <div className="admin-grid"><section className="admin-panel"><header className="admin-panel__header"><h2>Recent inquiries</h2><Link href="/admin/inquiries">View all →</Link></header>{data.recentInquiries.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Contact</th><th>Type</th><th>Status</th><th>Received</th></tr></thead><tbody>{data.recentInquiries.map((item) => <tr key={item.id}><td><strong><Link href={`/admin/inquiries/${item.id}`}>{item.name}</Link></strong><small>{item.email}</small></td><td>{item.form_type}</td><td><StatusBadge status={item.status}/></td><td>{formatDate(item.created_at)}</td></tr>)}</tbody></table></div> : <EmptyState title="No inquiries yet" copy="New contact and project inquiries will appear here."/>}</section>
      <div className="admin-panel"><header className="admin-panel__header"><h2>Content status</h2><Link href="/admin/projects">Manage →</Link></header><div className="admin-panel__body admin-status-list"><div className="admin-status-row"><div><i data-tone="success"/>Published projects</div><strong>{data.counts.published}</strong></div><div className="admin-status-row"><div><i data-tone="warning"/>Draft projects</div><strong>{data.counts.drafts}</strong></div><div className="admin-status-row"><div><i data-tone="success"/>Database</div><strong>{data.configured ? "Connected" : "Setup required"}</strong></div><div className="admin-status-row"><div><i/>Email delivery</div><strong>Database-only</strong></div></div></div>
    </div>
    <section className="admin-panel" style={{marginTop:"1rem"}}><header className="admin-panel__header"><h2>Recently edited projects</h2><Link href="/admin/projects">View all →</Link></header>{data.recentProjects.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Project</th><th>Status</th><th>Last edited</th></tr></thead><tbody>{data.recentProjects.map((item) => <tr key={item.id}><td><strong><Link href={`/admin/projects/${item.id}`}>{item.title}</Link></strong><small>/{item.slug}</small></td><td><StatusBadge status={item.status}/></td><td>{formatDate(item.updated_at)}</td></tr>)}</tbody></table></div> : <EmptyState title="No managed projects" copy="Import the current portfolio or create the first CMS-managed project." href="/admin/projects" action="Open projects"/>}</section>
  </main>;
}
