import type { Metadata } from "next";
import { GameGuide } from "@/components/seo/GameGuide";
import { JsonLd, gameJsonLd } from "@/components/seo/JsonLd";

const description =
  "Daily Counter-Strike challenge: see the teams a pro player has played for, in order, and guess who it is in 6 tries.";

export const metadata: Metadata = {
  title: "Career path",
  description,
  keywords: ["CS career path", "guess the CS pro player", "Counter-Strike teams quiz", "CS2 daily game", "caminho de carreira"],
  alternates: { canonical: "/career-path" },
  openGraph: { url: "/career-path", title: "Career path", description },
};

export default function CareerPathLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={gameJsonLd("careerPath", "/career-path", "Career path", description)} />
      {children}
      <GameGuide game="careerPath" />
    </>
  );
}
