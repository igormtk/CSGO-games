import type { Metadata } from "next";
import { ArchiveView } from "@/components/daily/ArchiveView";

const description =
  "Play past daily challenges of CS Bingo, Mystery player, Career path, Guess the player, Lineup and Sort the 16. Every day since January 2026.";

export const metadata: Metadata = {
  title: "Challenge archive",
  description,
  alternates: { canonical: "/archive" },
  openGraph: { url: "/archive", title: "Challenge archive", description },
};

export default function ArchivePage() {
  return <ArchiveView />;
}
