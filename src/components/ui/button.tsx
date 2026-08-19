import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "inverse";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: ButtonVariant;
}

export function Button({ className, variant = "primary", type = "button", ...props }: ButtonProps) {
  return <button className={cn("button", `button--${variant}`, className)} type={type} {...props} />;
}

export function ButtonLink({ className, variant = "primary", ...props }: ButtonLinkProps) {
  return <Link className={cn("button", `button--${variant}`, className)} {...props} />;
}
