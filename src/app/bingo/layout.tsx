import type { Metadata } from "next";
import { GameGuide } from "@/components/seo/GameGuide";
import { JsonLd, gameJsonLd } from "@/components/seo/JsonLd";

const description =
  "Fit 16 Counter-Strike pro players into today's board: teams, nationalities, roles and Majors. One attempt per day, the same board for everyone.";

export const metadata: Metadata = {
  title: "Daily CS Bingo",
  description,
  keywords: ["CS Bingo", "Counter-Strike bingo", "CS2", "daily game", "pro players", "HLTV", "Major"],
  alternates: { canonical: "/bingo" },
  openGraph: { url: "/bingo", title: "Daily CS Bingo", description },
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
