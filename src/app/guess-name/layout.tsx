import type { Metadata } from "next";
import { GameGuide } from "@/components/seo/GameGuide";
import { JsonLd, gameJsonLd } from "@/components/seo/JsonLd";

const description = "Do you know the real names of Counter-Strike pro players? Pick from 4 options and beat your record.";

export const metadata: Metadata = {
  title: "Guess the player",
  description,
  keywords: ["pro players real names", "Counter-Strike quiz", "CS2", "guess the player"],
  alternates: { canonical: "/guess-name" },
  openGraph: { url: "/guess-name", title: "Guess the player", description },
};

export default function GuessNameLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={gameJsonLd("guessName", "/guess-name", "Guess the player", description)} />
      {children}
      <GameGuide game="guessName" />
    </>
  );
}
