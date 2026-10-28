import type { Metadata } from "next";
import { GameGuide } from "@/components/seo/GameGuide";
import { JsonLd, gameJsonLd } from "@/components/seo/JsonLd";

const description =
  "Find today's Counter-Strike pro player in 6 guesses. Each guess reveals clues about team, country, role, Majors and HLTV Top 20.";

export const metadata: Metadata = {
  title: "Mystery player",
  description,
  keywords: ["mystery player", "guess the CS pro player", "CS2", "Counter-Strike", "daily game", "HLTV Top 20", "jogador misterioso"],
  alternates: { canonical: "/jogador-misterioso" },
  openGraph: { url: "/jogador-misterioso", title: "Mystery player", description },
};

export default function MysteryPlayerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={gameJsonLd("mystery", "/jogador-misterioso", "Mystery player", description)} />
      {children}
      <GameGuide game="mystery" />
    </>
  );
}
