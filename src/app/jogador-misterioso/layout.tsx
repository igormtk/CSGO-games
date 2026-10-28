import type { Metadata } from "next";
import { GameGuide } from "@/components/seo/GameGuide";
import { JsonLd, gameJsonLd } from "@/components/seo/JsonLd";

const description =
  "Descubra o pro player de Counter-Strike do dia em 6 palpites. Cada chute revela pistas de time, país, função, Majors e Top 20 da HLTV.";

export const metadata: Metadata = {
  title: "Jogador misterioso",
  description,
  keywords: ["jogador misterioso", "adivinhe o pro player", "CS2", "Counter-Strike", "jogo diário", "HLTV Top 20"],
  alternates: { canonical: "/jogador-misterioso" },
  openGraph: { url: "/jogador-misterioso", title: "Jogador misterioso", description },
};

export default function MysteryPlayerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={gameJsonLd("mystery", "/jogador-misterioso", "Jogador misterioso", description)} />
      {children}
      <GameGuide game="mystery" />
    </>
  );
}
