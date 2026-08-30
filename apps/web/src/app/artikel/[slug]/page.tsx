import { redirect, RedirectType } from "next/navigation";

interface ArtikelSlugRedirectProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArtikelSlugRedirectPage({
  params,
}: ArtikelSlugRedirectProps) {
  const { slug } = await params;
  redirect(`/blog/${encodeURIComponent(slug)}`, RedirectType.replace);
}
