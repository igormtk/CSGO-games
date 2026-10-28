import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jogador misterioso",
  description:
    "Descubra o pro player de Counter-Strike do dia em 6 palpites. Cada chute revela pistas de time, país, função, Majors e Top 20 da HLTV.",
  alternates: { canonical: "/jogador-misterioso" },
  openGraph: { url: "/jogador-misterioso" },
};

export default function MysteryPlayerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
