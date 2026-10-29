import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StatView } from "@/components/content/StatView";
import { getStatPage, statPages } from "@/data/articles/stats";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => statPages.map((page) => ({ slug: page.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getStatPage((await params).slug);
  if (!page) return {};
  return {
    title: page.title.en,
    description: page.intro.en,
    alternates: { canonical: `/stats/${page.slug}` },
    openGraph: { type: "article", url: `/stats/${page.slug}` },
  };
}

export default async function StatPage({ params }: Props) {
  const { slug } = await params;
  if (!getStatPage(slug)) notFound();
  return <StatView slug={slug} />;
}
