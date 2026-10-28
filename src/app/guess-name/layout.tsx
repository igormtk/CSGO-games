import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adivinhe o jogador",
  description: "Você sabe o nome real dos pro players de Counter-Strike? Escolha entre 4 opções e bata seu recorde.",
  alternates: { canonical: "/guess-name" },
  openGraph: { url: "/guess-name" },
};

export default function GuessNameLayout({ children }: { children: React.ReactNode }) {
  return children;
}
