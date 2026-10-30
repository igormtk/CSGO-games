import type { Metadata } from "next";
import { GameGuide } from "@/components/seo/GameGuide";
import { JsonLd, gameJsonLd } from "@/components/seo/JsonLd";

const description =
  "Endless Counter-Strike game: two pro players, guess who has more Major titles or more years in the HLTV Top 20. Keep the streak going.";

export const metadata: Metadata = {
  title: "Higher or lower",
  description,
  keywords: ["higher or lower", "Counter-Strike quiz", "CS2", "pro players stats game"],
  alternates: { canonical: "/higher-or-lower" },
  openGraph: { url: "/higher-or-lower", title: "Higher or lower", description },
};

export default function HigherOrLowerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={gameJsonLd("higherLower", "/higher-or-lower", "Higher or lower", description)} />
      {children}
      <GameGuide game="higherLower" />
    </>
  );
}
