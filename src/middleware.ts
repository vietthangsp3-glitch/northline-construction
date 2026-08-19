import type { NextRequest } from "next/server";
import { refreshSupabaseSession } from "@/lib/supabase/proxy";

// OpenNext currently requires Edge Middleware. Next.js 16's `proxy.ts`
// convention always uses the unsupported Node.js middleware runtime.
export async function middleware(request: NextRequest) {
  return refreshSupabaseSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
