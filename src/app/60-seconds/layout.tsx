import type { Metadata } from "next";
import { GameGuide } from "@/components/seo/GameGuide";
import { JsonLd, gameJsonLd } from "@/components/seo/JsonLd";

const description =
  "Daily Counter-Strike speed quiz: one theme a day and 60 seconds to type as many matching pro players as you can remember.";

export const metadata: Metadata = {
  title: "60 seconds",
  description,
  keywords: ["Counter-Strike quiz", "CS2 speed quiz", "name the pro players", "daily CS game"],
  alternates: { canonical: "/60-seconds" },
  openGraph: { url: "/60-seconds", title: "60 seconds", description },
};

export default function SixtySecondsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={gameJsonLd("sixtySeconds", "/60-seconds", "60 seconds", description)} />
      {children}
      <GameGuide game="sixtySeconds" />
    </>
  );
}
