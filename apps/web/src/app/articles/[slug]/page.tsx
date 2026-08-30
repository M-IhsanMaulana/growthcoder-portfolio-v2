import { redirect, RedirectType } from "next/navigation";

interface ArticlesSlugRedirectProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticlesSlugRedirectPage({
  params,
}: ArticlesSlugRedirectProps) {
  const { slug } = await params;
  redirect(`/blog/${encodeURIComponent(slug)}`, RedirectType.replace);
}
