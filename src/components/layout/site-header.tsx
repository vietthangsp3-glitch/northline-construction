"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 32);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }

      if (event.key !== "Tab") return;
      const menu = document.getElementById("mobile-navigation");
      const focusable = menu?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      if (previousFocus && document.contains(previousFocus)) previousFocus.focus();
    };
  }, [menuOpen]);

  const isOverlay = pathname === "/" && !scrolled && !menuOpen;

  return (
    <header
      className={cn(
        "site-header",
        isOverlay ? "site-header--overlay" : "site-header--solid",
        menuOpen && "site-header--menu-open",
      )}
    >
      <div className="site-header__inner">
        <Link className="wordmark site-header__brand" href="/" aria-label="Northline home">
          NORTHLINE
        </Link>

        <nav className="desktop-navigation" aria-label="Primary navigation">
          {navigation.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`) || (item.href === "/about" && pathname === "/team");
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link className="site-header__cta" href="/request-a-quote">
          <span>Start a Project</span><span aria-hidden="true">↗</span>
        </Link>

        <button
          ref={menuButtonRef}
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="menu-toggle__label">{menuOpen ? "Close" : "Menu"}</span>
          <span className="menu-toggle__mark" aria-hidden="true">
            <span /><span />
          </span>
        </button>
      </div>

      <div id="mobile-navigation" className="mobile-navigation" aria-hidden={!menuOpen}>
        <nav aria-label="Mobile navigation">
          <ol>
            {navigation.map((item, index) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`) || (item.href === "/about" && pathname === "/team");
              return (
                <li key={item.href} style={{ "--menu-index": index } as React.CSSProperties}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    tabIndex={menuOpen ? 0 : -1}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li style={{ "--menu-index": navigation.length } as React.CSSProperties}>
              <span>05</span>
              <Link href="/contact" tabIndex={menuOpen ? 0 : -1} aria-current={pathname === "/contact" ? "page" : undefined} onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
            </li>
          </ol>
        </nav>
        <div className="mobile-navigation__footer">
          <Link href="/request-a-quote" tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)}>
            Start a Project <span aria-hidden="true">↗</span>
          </Link>
          <p>New York · Building Nationwide</p>
        </div>
      </div>
    </header>
  );
}
