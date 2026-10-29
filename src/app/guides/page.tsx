import type { Metadata } from "next";
import { GuidesHub } from "@/components/content/GuidesHub";

export const metadata: Metadata = {
  title: "Guides and stats",
  description: "Strategy guides for every CS Games daily game and stats lists from the Counter-Strike pro scene.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return <GuidesHub />;
}
