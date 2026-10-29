import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Os jogos diários mudam todo dia: a data do build serve de última modificação.
const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/bingo`, lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/bingo/multiplayer`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/jogador-misterioso`, lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/career-path`, lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/guess-name`, lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/privacidade`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/termos`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
