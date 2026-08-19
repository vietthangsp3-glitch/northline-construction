import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getOptionalAdmin } from "@/lib/admin/auth";

export const metadata = { title: "Sign in" };

export default async function AdminLoginPage() {
  if (await getOptionalAdmin()) redirect("/admin/dashboard");
  return <main className="admin-login">
    <section className="admin-login__intro"><div className="admin-login__brand"><span>N</span><strong>NORTHLINE</strong></div><div><p>Northline Content Studio</p><h1>Run the website.<br/>Not the codebase.</h1><p>Manage projects, services, media, and client inquiries from one focused workspace.</p></div><small>Construction &amp; Development / New York</small></section>
    <section className="admin-login__panel"><div className="admin-login__card"><p className="admin-kicker">Secure access</p><h2>Welcome back</h2><p>Sign in with your approved Northline administrator account.</p><LoginForm/><div className="admin-login__security"><span aria-hidden="true">◈</span><p><strong>Protected workspace</strong><br/>Sessions are managed securely through Supabase Auth.</p></div></div></section>
  </main>;
}
