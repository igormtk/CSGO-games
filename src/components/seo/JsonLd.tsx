import { gameGuides } from "@/data/gameGuides";
import type { GameId } from "@/data/gameGuides";
import { siteName, siteUrl } from "@/lib/site";

// Dados estruturados (schema.org) que o Google e as IAs usam para entender a página.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // O JSON vem do próprio código; escapar "<" impede fechar a tag por engano.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const gameJsonLd = (game: GameId, path: string, name: string, description: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["VideoGame", "WebApplication"],
      "@id": `${siteUrl}${path}#game`,
      name,
      description,
      url: `${siteUrl}${path}`,
      applicationCategory: "GameApplication",
      genre: ["Trivia", "Puzzle", "Esports"],
      gamePlatform: "Web browser",
      operatingSystem: "Any",
      inLanguage: ["en", "pt-BR", "es"],
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: 0, priceCurrency: "BRL" },
      about: { "@type": "VideoGame", name: "Counter-Strike 2" },
      publisher: { "@id": `${siteUrl}/#organization` },
      isPartOf: { "@id": `${siteUrl}/#website` },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}${path}#faq`,
      mainEntity: gameGuides[game].en.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
});

export const siteJsonLd = (games: { name: string; path: string; description: string }[], description: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteName,
      url: `${siteUrl}/`,
      description,
      inLanguage: ["en", "pt-BR", "es"],
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: `${siteUrl}/`,
      logo: `${siteUrl}/icon.svg`,
    },
    {
      "@type": "ItemList",
      name: "Counter-Strike games",
      itemListElement: games.map((game, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}${game.path}`,
        name: game.name,
        description: game.description,
      })),
    },
  ],
});
