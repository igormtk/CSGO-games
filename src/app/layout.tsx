import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Rajdhani as FontSans } from "next/font/google";
import Header from "@/components/headers/Header";
import "./globals.css";

import { cn } from "@/lib/utils";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import { JsonLd, siteJsonLd } from "@/components/seo/JsonLd";

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${siteName} · Jogos diários de Counter-Strike`, template: `%s · ${siteName}` },
  description: siteDescription,
  applicationName: siteName,
  keywords: ["Counter-Strike", "CS2", "CS:GO", "jogos diários", "pro players", "quiz de CS", "HLTV", "Major", "esports"],
  category: "games",
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName, locale: "pt_BR", alternateLocale: ["en_US", "es_ES"], url: "/" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  // Código do Google Search Console (Configurações → Propriedade → Verificação por tag HTML).
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

const games = [
  { name: "CS Bingo", path: "/bingo", description: "Cartela diária 4x4 de pro players de Counter-Strike." },
  { name: "Jogador misterioso", path: "/jogador-misterioso", description: "Descubra o pro player do dia em 6 palpites." },
  { name: "Adivinhe o jogador", path: "/guess-name", description: "Acerte o nome real dos pro players." },
];

export const viewport: Viewport = {
  themeColor: "#0e1114",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Ler os cabeçalhos torna a página dinâmica: cada visita recebe um nonce novo (ver middleware).
  await headers();
  return (
    <html lang="pt-BR">
      {/* A página ocupa exatamente a altura da tela; cada jogo se ajusta ao espaço abaixo do menu. */}
      <body
        className={cn(
          "flex h-[100dvh] flex-col overflow-hidden bg-cs-bg font-sans text-cs-text antialiased",
          fontSans.variable
        )}
      >
        <JsonLd data={siteJsonLd(games, siteDescription)} />
        <Header />
        <div className="cs-grid-bg min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_rgba(242,163,58,0.12),_transparent_32rem)]">
          {children}
        </div>
      </body>
    </html>
  );
}
