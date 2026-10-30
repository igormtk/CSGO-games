import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StrategyGuideView } from "@/components/content/StrategyGuideView";
import { getStrategyGuide, strategyGuides } from "@/data/articles/strategyGuides";
import { localizedMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => strategyGuides.map((guide) => ({ slug: guide.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getStrategyGuide((await params).slug);
  if (!guide) return {};
  return localizedMetadata({ path: `/guides/${guide.slug}`, title: guide.title, description: guide.intro }, { type: "article" });
}

export default async function StrategyGuidePage({ params }: Props) {
  const { slug } = await params;
  if (!getStrategyGuide(slug)) notFound();
  return <StrategyGuideView slug={slug} />;
}
