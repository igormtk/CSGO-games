import type { Metadata } from "next";
import { GameGuide } from "@/components/seo/GameGuide";
import { JsonLd, gameJsonLd } from "@/components/seo/JsonLd";

const description =
  "Daily Counter-Strike challenge: one team a day, name 5 pro players who have played for it. Three misses allowed.";

export const metadata: Metadata = {
  title: "Lineup",
  description,
  keywords: ["Counter-Strike lineup quiz", "CS2 teams quiz", "name the players", "daily CS game"],
  alternates: { canonical: "/lineup" },
  openGraph: { url: "/lineup", title: "Lineup", description },
};

export default function LineupLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={gameJsonLd("lineup", "/lineup", "Lineup", description)} />
      {children}
      <GameGuide game="lineup" />
    </>
  );
}
