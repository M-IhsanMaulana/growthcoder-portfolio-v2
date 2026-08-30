import { redirect, RedirectType } from "next/navigation";

interface ProyekSlugRedirectProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProyekSlugRedirectPage({
  params,
}: ProyekSlugRedirectProps) {
  const { slug } = await params;
  redirect(`/projects/${encodeURIComponent(slug)}`, RedirectType.replace);
}
