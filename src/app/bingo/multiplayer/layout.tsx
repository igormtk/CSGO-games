import type { Metadata } from "next";

const description =
  "Play CS Bingo against your friends: create a room, share the code and race on the same Counter-Strike pro player board in real time.";

export const metadata: Metadata = {
  title: "CS Bingo multiplayer",
  description,
  keywords: ["CS Bingo multiplayer", "Counter-Strike game with friends", "CS2 quiz", "bingo multiplayer"],
  alternates: { canonical: "/bingo/multiplayer" },
  openGraph: { url: "/bingo/multiplayer", title: "CS Bingo multiplayer", description },
};

export default function BingoMultiplayerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
