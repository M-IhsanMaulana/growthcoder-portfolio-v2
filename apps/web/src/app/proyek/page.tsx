import { redirect, RedirectType } from "next/navigation";

export default function ProyekRedirectPage() {
  redirect("/projects", RedirectType.replace);
}
