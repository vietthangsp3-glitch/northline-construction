import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/ui";
import { BusinessSettingsEditor } from "@/components/admin/settings-editors";
import { getSiteSettings } from "@/lib/admin/data";

export const metadata={title:"Settings"};
export default async function SettingsPage(){const rows=await getSiteSettings();const settings=Object.fromEntries(rows.map((item)=>[item.key,item.value]));const configured=Boolean(process.env.SUPABASE_URL&&process.env.SUPABASE_SECRET_KEY);return <main className="admin-page"><AdminPageHeader eyebrow="System / Configuration" title="Settings" description="Business information, contact details, social profiles, and safe integration status."><Link className="admin-button" href="/admin/settings/seo">SEO settings</Link></AdminPageHeader>
  <div className="admin-two-column"><section className="admin-panel"><header className="admin-panel__header"><h2>Integrations</h2></header><div className="admin-panel__body admin-code-status"><div><span>Supabase</span><span>{configured?"Connected":"Not configured"}</span></div><div><span>Email delivery</span><span>Database-only</span></div><div><span>Admin media</span><span>Supabase Storage</span></div><div><span>Cloudflare runtime</span><span>OpenNext ready</span></div></div></section><section className="admin-panel"><header className="admin-panel__header"><h2>Security</h2></header><div className="admin-panel__body"><p style={{margin:0,color:"var(--admin-muted)",fontSize:".72rem",lineHeight:1.7}}>Secret values are never shown here. Admin access requires a valid Supabase Auth session and an active approved profile. Database and Storage writes are protected by RLS.</p></div></section></div>
  <div style={{marginTop:"1rem"}}><BusinessSettingsEditor settings={settings}/></div>
  </main>}
