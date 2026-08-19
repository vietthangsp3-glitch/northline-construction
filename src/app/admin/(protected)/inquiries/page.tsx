import Link from "next/link";
import { AdminPageHeader, EmptyState, StatusBadge, formatDate } from "@/components/admin/ui";
import { getInquiries } from "@/lib/admin/data";

export const metadata = { title: "Inquiries" };

export default async function InquiriesPage({ searchParams }: { searchParams: Promise<Record<string,string|undefined>> }) {
  const params = await searchParams; const result = await getInquiries(params);
  const pageHref = (page: number) => `/admin/inquiries?${new URLSearchParams({ ...(params.query ? {query:params.query}:{}), ...(params.status ? {status:params.status}:{}), ...(params.sort ? {sort:params.sort}:{}), page:String(page) })}`;
  return <main className="admin-page"><AdminPageHeader eyebrow="Business / Inbox" title="Inquiries" description="Review, organize, and follow up on every client request."/>
    <form className="admin-toolbar"><div className="admin-field"><label htmlFor="query">Search</label><input id="query" name="query" defaultValue={params.query} placeholder="Name, email, or company"/></div><div className="admin-field"><label htmlFor="status">Status</label><select id="status" name="status" defaultValue={params.status || ""}><option value="">All statuses</option><option value="received">Received</option><option value="delivered">Delivered</option><option value="delivery_failed">Delivery failed</option><option value="archived">Archived</option></select></div><div className="admin-field"><label htmlFor="sort">Sort</label><select id="sort" name="sort" defaultValue={params.sort || "newest"}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></div><button className="admin-button" type="submit">Apply filters</button></form>
    <section className="admin-panel">{result.rows.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Contact</th><th>Company</th><th>Request</th><th>Status</th><th>Received</th><th/></tr></thead><tbody>{result.rows.map((item) => <tr key={item.id}><td><strong><Link href={`/admin/inquiries/${item.id}`}>{item.name}</Link></strong><small>{item.email}</small></td><td>{item.company || "—"}</td><td>{item.form_type === "quote" ? "Project quote" : "Contact"}</td><td><StatusBadge status={item.status}/></td><td>{formatDate(item.created_at)}</td><td><Link href={`/admin/inquiries/${item.id}`} aria-label={`Open inquiry from ${item.name}`}>↗</Link></td></tr>)}</tbody></table></div> : <EmptyState title="No inquiries found" copy="Try a different search or filter."/>}
      <footer className="admin-pagination"><span>{result.total} inquiries · Page {result.page} of {result.pages}</span><div>{result.page > 1 && <Link className="admin-button" href={pageHref(result.page-1)}>Previous</Link>}{result.page < result.pages && <Link className="admin-button" href={pageHref(result.page+1)}>Next</Link>}</div></footer></section>
  </main>;
}
