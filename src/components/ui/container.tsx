import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps<T extends ElementType = "div"> {
  as?: T;
  children: ReactNode;
  className?: string;
}

export function Container<T extends ElementType = "div">({
  as,
  children,
  className,
  ...props
}: ContainerProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof ContainerProps<T>>) {
  const Component = as || "div";
  return (
    <Component className={cn("container", className)} {...props}>
      {children}
    </Component>
  );
}
