import type { Metadata } from "next";
import { GameGuide } from "@/components/seo/GameGuide";
import { JsonLd, gameJsonLd } from "@/components/seo/JsonLd";

const description =
  "Daily Counter-Strike puzzle: sort 16 pro players into 4 groups of 4 that share a team, country, role or achievement. Four mistakes allowed.";

export const metadata: Metadata = {
  title: "Sort the 16",
  description,
  keywords: ["Counter-Strike puzzle", "CS2 groups game", "pro players quiz", "daily CS game"],
  alternates: { canonical: "/groups" },
  openGraph: { url: "/groups", title: "Sort the 16", description },
};

export default function GroupsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={gameJsonLd("groups", "/groups", "Sort the 16", description)} />
      {children}
      <GameGuide game="groups" />
    </>
  );
}
