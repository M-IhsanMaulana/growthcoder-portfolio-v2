import { redirect, RedirectType } from "next/navigation";

export default function ArticlesRedirectPage() {
  redirect("/blog", RedirectType.replace);
}
