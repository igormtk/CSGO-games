import type { Metadata } from "next";
import { GameGuide } from "@/components/seo/GameGuide";
import { JsonLd, gameJsonLd } from "@/components/seo/JsonLd";

const description = "Você sabe o nome real dos pro players de Counter-Strike? Escolha entre 4 opções e bata seu recorde.";

export const metadata: Metadata = {
  title: "Adivinhe o jogador",
  description,
  keywords: ["nome real pro players", "quiz Counter-Strike", "CS2", "adivinhe o jogador"],
  alternates: { canonical: "/guess-name" },
  openGraph: { url: "/guess-name", title: "Adivinhe o jogador", description },
};

export default function GuessNameLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={gameJsonLd("guessName", "/guess-name", "Adivinhe o jogador", description)} />
      {children}
      <GameGuide game="guessName" />
    </>
  );
}
