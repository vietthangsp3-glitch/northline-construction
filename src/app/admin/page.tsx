import { redirect } from "next/navigation";
import { getOptionalAdmin } from "@/lib/admin/auth";

export default async function AdminIndex() {
  redirect((await getOptionalAdmin()) ? "/admin/dashboard" : "/admin/login");
}
