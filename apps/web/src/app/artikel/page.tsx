import { redirect, RedirectType } from "next/navigation";

export default function ArtikelRedirectPage() {
  redirect("/blog", RedirectType.replace);
}
