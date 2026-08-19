import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps<T extends ElementType = "section"> {
  as?: T;
  children: ReactNode;
  className?: string;
  tone?: "light" | "dark" | "concrete";
}

export function Section<T extends ElementType = "section">({ as, children, className, tone = "light", ...props }: SectionProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof SectionProps<T>>) {
  const Component = as || "section";
  return <Component className={cn("section", `section--${tone}`, className)} {...props}>{children}</Component>;
}
