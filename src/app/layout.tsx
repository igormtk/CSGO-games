import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
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
  title: { default: `${siteName} · Daily Counter-Strike games`, template: `%s · ${siteName}` },
  description: siteDescription,
  applicationName: siteName,
  keywords: ["Counter-Strike", "CS2", "CS:GO", "daily games", "CS quiz", "pro players", "HLTV", "Major", "esports", "jogos de CS"],
  category: "games",
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName, locale: "en_US", alternateLocale: ["pt_BR", "es_ES"], url: "/" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  // Verificação de propriedade dos buscadores. O Google está verificado por registro TXT no DNS
  // (Hostinger); o Bing Webmaster Tools usa esta meta tag. Os códigos são públicos por natureza.
  verification: { other: { "msvalidate.01": "B1CC63B45848CAE0795F86FA799A8070" } },
};

const games = [
  { name: "CS Bingo", path: "/bingo", description: "Daily 4x4 board of Counter-Strike pro players." },
  { name: "Mystery player", path: "/jogador-misterioso", description: "Find today's pro player in 6 guesses." },
  { name: "Guess the player", path: "/guess-name", description: "Name the pro players' real names." },
];

export const viewport: Viewport = {
  themeColor: "#0e1114",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Ler os cabeçalhos torna a página dinâmica: cada visita recebe um nonce novo (ver src/proxy.ts).
  await headers();
  return (
    <html lang="en">
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
        {/* Contagem de visitas da Vercel: sem cookies e sem identificar quem visita (ver /privacidade). */}
        <Analytics />
      </body>
    </html>
  );
}
