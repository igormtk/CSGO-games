import { gameGuides } from "@/data/gameGuides";
import type { GameId } from "@/data/gameGuides";
import { htmlLang, localizePath } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";
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

// Endereço da página no idioma dela (/pt/bingo); os @id ficam sem prefixo, iguais nos três idiomas.
const pageUrl = (path: string, language: Language) => `${siteUrl}${localizePath(path, language)}`;

export const gameJsonLd = (game: GameId, path: string, name: string, description: string, language: Language) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["VideoGame", "WebApplication"],
      "@id": `${siteUrl}${path}#game`,
      name,
      description,
      url: pageUrl(path, language),
      applicationCategory: "GameApplication",
      genre: ["Trivia", "Puzzle", "Esports"],
      gamePlatform: "Web browser",
      operatingSystem: "Any",
      inLanguage: htmlLang(language),
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: 0, priceCurrency: "BRL" },
      about: { "@type": "VideoGame", name: "Counter-Strike 2" },
      publisher: { "@id": `${siteUrl}/#organization` },
      isPartOf: { "@id": `${siteUrl}/#website` },
    },
    {
      "@type": "FAQPage",
      "@id": `${pageUrl(path, language)}#faq`,
      inLanguage: htmlLang(language),
      mainEntity: gameGuides[game][language].faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
});

export const siteJsonLd = (
  games: { name: string; path: string; description: string }[],
  description: string,
  language: Language
) => ({
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
        url: pageUrl(game.path, language),
        name: game.name,
        description: game.description,
      })),
    },
  ],
});
