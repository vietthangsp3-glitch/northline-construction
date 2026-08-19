import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Eyebrow({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("eyebrow", className)} {...props} />;
}
