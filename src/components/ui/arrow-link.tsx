import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface ArrowLinkProps extends ComponentProps<typeof Link> {
  label: string;
  tone?: "light" | "dark";
}

export function ArrowLink({ label, className, tone = "dark", ...props }: ArrowLinkProps) {
  return (
    <Link className={cn("arrow-link", `arrow-link--${tone}`, className)} {...props}>
      <span>{label}</span>
      <span aria-hidden="true" className="arrow-link__icon">↗</span>
    </Link>
  );
}
