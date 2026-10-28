import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/bingo`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/jogador-misterioso`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/guess-name`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/privacidade`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/termos`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
