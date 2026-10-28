import type { Metadata } from "next";
import { GameGuide } from "@/components/seo/GameGuide";
import { JsonLd, gameJsonLd } from "@/components/seo/JsonLd";

const description =
  "Encaixe 16 pro players de Counter-Strike na cartela do dia: times, nacionalidades, funções e Majors. Uma tentativa por dia, a mesma cartela para todo mundo.";

export const metadata: Metadata = {
  title: "CS Bingo diário",
  description,
  keywords: ["CS Bingo", "bingo Counter-Strike", "CS2", "jogo diário", "pro players", "HLTV", "Major"],
  alternates: { canonical: "/bingo" },
  openGraph: { url: "/bingo", title: "CS Bingo diário", description },
};

export default function BingoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={gameJsonLd("bingo", "/bingo", "CS Bingo", description)} />
      {children}
      <GameGuide game="bingo" />
    </>
  );
}
