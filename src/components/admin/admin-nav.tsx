"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAdmin } from "@/app/admin/actions";

const groups = [
  { label: "Overview", items: [{ href: "/admin/dashboard", label: "Dashboard", icon: "grid" }] },
  { label: "Content", items: [
    { href: "/admin/projects", label: "Projects", icon: "building" },
    { href: "/admin/services", label: "Services", icon: "layers" },
    { href: "/admin/content", label: "Website Content", icon: "edit" },
    { href: "/admin/media", label: "Media", icon: "image" },
  ] },
  { label: "Business", items: [{ href: "/admin/inquiries", label: "Inquiries", icon: "mail" }] },
  { label: "System", items: [{ href: "/admin/settings", label: "Settings", icon: "settings" }] },
] as const;

function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    building: <><path d="M4 21V5l8-3 8 3v16"/><path d="M9 9h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1M2 21h20"/></>,
    layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></>,
    edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export function AdminNav({ name, email, role }: { name: string; email: string; role: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <>
    <button className="admin-mobile-toggle" type="button" aria-expanded={open} aria-controls="admin-sidebar" onClick={() => setOpen(!open)}><span>Menu</span><span aria-hidden="true">{open ? "×" : "☰"}</span></button>
    <aside className={`admin-sidebar${open ? " admin-sidebar--open" : ""}`} id="admin-sidebar">
      <div className="admin-sidebar__brand"><span className="admin-sidebar__mark">N</span><div><strong>NORTHLINE</strong><span>Content Studio</span></div></div>
      <nav aria-label="Admin navigation">
        {groups.map((group) => <div className="admin-nav-group" key={group.label}><p>{group.label}</p>{group.items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return <Link href={item.href} aria-current={active ? "page" : undefined} key={item.href} onClick={() => setOpen(false)}><Icon name={item.icon}/><span>{item.label}</span></Link>;
        })}</div>)}
      </nav>
      <div className="admin-sidebar__bottom">
        <Link href="/" target="_blank">View website <span aria-hidden="true">↗</span></Link>
        <div className="admin-profile"><span>{name.slice(0, 1).toUpperCase()}</span><div><strong>{name}</strong><small>{role} · {email}</small></div></div>
        <form action={logoutAdmin}><button type="submit">Log out</button></form>
      </div>
    </aside>
    {open && <button className="admin-sidebar-backdrop" aria-label="Close navigation" onClick={() => setOpen(false)} />}
  </>;
}
