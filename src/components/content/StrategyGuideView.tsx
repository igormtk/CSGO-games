"use client";

import { getStrategyGuide } from "@/data/articles/strategyGuides";
import { ArticlePage } from "./ArticlePage";

export function StrategyGuideView({ slug }: { slug: string }) {
  const guide = getStrategyGuide(slug);
  if (!guide) return null;
  return (
    <ArticlePage title={guide.title} intro={guide.intro} content={guide.content} cta={{ href: guide.gameHref, label: guide.cta }} />
  );
}
