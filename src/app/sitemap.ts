import type { MetadataRoute } from "next";
import { statPages } from "@/data/articles/stats";
import { strategyGuides } from "@/data/articles/strategyGuides";
import { csPlayers } from "@/data/csBingoDatabase";
import { LANGUAGES, languageAlternates, localizePath } from "@/lib/i18n";
import { teamsWithPages } from "@/lib/proPages";
import { siteUrl } from "@/lib/site";

// Os jogos diários mudam todo dia: a data do build serve de última modificação.
const lastModified = new Date();

type Entry = { path: string; changeFrequency: "daily" | "weekly" | "monthly" | "yearly"; priority: number; dated?: boolean };

const entries: Entry[] = [
  { path: "/", changeFrequency: "daily", priority: 1, dated: true },
  { path: "/bingo", changeFrequency: "daily", priority: 0.9, dated: true },
  { path: "/bingo/multiplayer", changeFrequency: "weekly", priority: 0.8, dated: true },
  { path: "/jogador-misterioso", changeFrequency: "daily", priority: 0.9, dated: true },
  { path: "/career-path", changeFrequency: "daily", priority: 0.9, dated: true },
  { path: "/guess-name", changeFrequency: "daily", priority: 0.9, dated: true },
  { path: "/lineup", changeFrequency: "daily", priority: 0.9, dated: true },
  { path: "/groups", changeFrequency: "daily", priority: 0.9, dated: true },
  { path: "/60-seconds", changeFrequency: "daily", priority: 0.9, dated: true },
  { path: "/higher-or-lower", changeFrequency: "monthly", priority: 0.8 },
  { path: "/archive", changeFrequency: "daily", priority: 0.7, dated: true },
  { path: "/guides", changeFrequency: "monthly", priority: 0.6 },
  ...strategyGuides.map((guide): Entry => ({ path: `/guides/${guide.slug}`, changeFrequency: "monthly", priority: 0.6 })),
  // As estatísticas acompanham o sync semanal dos times.
  ...statPages.map((page): Entry => ({ path: `/stats/${page.slug}`, changeFrequency: "weekly", priority: 0.6, dated: true })),
  // Páginas de jogadores e times: seguem o sync semanal do Liquipedia.
  { path: "/players", changeFrequency: "weekly", priority: 0.6, dated: true },
  { path: "/teams", changeFrequency: "weekly", priority: 0.6, dated: true },
  ...csPlayers.map((player): Entry => ({ path: `/players/${player.id}`, changeFrequency: "weekly", priority: 0.5, dated: true })),
  ...teamsWithPages.map((team): Entry => ({ path: `/teams/${team.id}`, changeFrequency: "weekly", priority: 0.5, dated: true })),
  { path: "/about", changeFrequency: "yearly", priority: 0.4 },
  { path: "/privacidade", changeFrequency: "yearly", priority: 0.2 },
  { path: "/termos", changeFrequency: "yearly", priority: 0.2 },
];

// Cada página aparece nos três idiomas (/bingo, /pt/bingo, /es/bingo), cada uma apontando para as outras.
export default function sitemap(): MetadataRoute.Sitemap {
  return entries.flatMap(({ path, changeFrequency, priority, dated }) => {
    const languages = Object.fromEntries(
      Object.entries(languageAlternates(path))
        .filter(([code]) => code !== "x-default")
        .map(([code, url]) => [code, `${siteUrl}${url}`])
    );
    return LANGUAGES.map(({ code }) => ({
      url: `${siteUrl}${localizePath(path, code)}`,
      ...(dated ? { lastModified } : {}),
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
}
