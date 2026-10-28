import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CS Bingo diário",
  description:
    "Encaixe 16 pro players de Counter-Strike na cartela do dia: times, nacionalidades, funções e Majors. Uma tentativa por dia.",
  alternates: { canonical: "/bingo" },
  openGraph: { url: "/bingo" },
};

export default function BingoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
