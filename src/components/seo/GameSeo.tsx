import type { ReactNode } from "react";
import type { GameId } from "@/data/gameGuides";
import type { PageSeo } from "@/data/pageSeo";
import { getPageLanguage } from "@/lib/seo";
import { GameGuide } from "./GameGuide";
import { JsonLd, gameJsonLd } from "./JsonLd";

// Em volta de cada jogo: dados estruturados no idioma do endereço e o "Como jogar" abaixo.
export async function GameSeo({ game, seo, children }: { game: GameId; seo: PageSeo; children: ReactNode }) {
  const language = await getPageLanguage();
  return (
    <>
      <JsonLd data={gameJsonLd(game, seo.path, seo.title[language], seo.description[language], language)} />
      {children}
      <GameGuide game={game} />
    </>
  );
}
