import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/admin/auth";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return <div className="admin-app"><AdminNav name={admin.profile.displayName} email={admin.user.email} role={admin.profile.role}/><div className="admin-workspace">{children}</div></div>;
}
