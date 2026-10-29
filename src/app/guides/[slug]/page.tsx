import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StrategyGuideView } from "@/components/content/StrategyGuideView";
import { getStrategyGuide, strategyGuides } from "@/data/articles/strategyGuides";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => strategyGuides.map((guide) => ({ slug: guide.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getStrategyGuide((await params).slug);
  if (!guide) return {};
  return {
    title: guide.title.en,
    description: guide.intro.en,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: { type: "article", url: `/guides/${guide.slug}` },
  };
}

export default async function StrategyGuidePage({ params }: Props) {
  const { slug } = await params;
  if (!getStrategyGuide(slug)) notFound();
  return <StrategyGuideView slug={slug} />;
}
