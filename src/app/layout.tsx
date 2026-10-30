import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { Rajdhani as FontSans } from "next/font/google";
import Header from "@/components/headers/Header";
import "./globals.css";

import { cn } from "@/lib/utils";
import { siteName, siteUrl } from "@/lib/site";
import { JsonLd, siteJsonLd } from "@/components/seo/JsonLd";
import { SideRails } from "@/components/partners/SideRails";
import { pageSeo } from "@/data/pageSeo";
import { adsenseClient, adsenseScriptSrc } from "@/lib/adsense";
import { htmlLang } from "@/lib/i18n";
import { RouteLanguageProvider } from "@/lib/language";
import { getPageLanguage, getRouteLanguage, localizedMetadata } from "@/lib/seo";

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-sans",
});

// Base de todas as páginas e metadata da home, no idioma do endereço (/, /pt ou /es). Cada página
// troca título, descrição, canônico e hreflang pelos seus (ver src/data/pageSeo.ts).
export const generateMetadata = async (): Promise<Metadata> => {
  const home = await localizedMetadata(pageSeo.home);
  return {
    ...home,
    metadataBase: new URL(siteUrl),
    title: { default: pageSeo.home.title[await getPageLanguage()], template: `%s · ${siteName}` },
    applicationName: siteName,
    category: "games",
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    // Verificação de propriedade dos buscadores. O Google está verificado por registro TXT no DNS
    // (Hostinger); o Bing Webmaster Tools usa esta meta tag. Os códigos são públicos por natureza.
    verification: { other: { "msvalidate.01": "B1CC63B45848CAE0795F86FA799A8070" } },
    // Confirma ao AdSense que o site é desta conta (junto com o /ads.txt).
    ...(adsenseClient ? { other: { "google-adsense-account": adsenseClient } } : {}),
  };
};

const games = [
  { name: "CS Bingo", path: "/bingo", description: "Daily 4x4 board of Counter-Strike pro players." },
  { name: "Mystery player", path: "/jogador-misterioso", description: "Find today's pro player in 6 guesses." },
  { name: "Guess the player", path: "/guess-name", description: "Name the pro players' real names." },
  { name: "Lineup", path: "/lineup", description: "Name 5 pro players who played for today's team." },
  { name: "Sort the 16", path: "/groups", description: "Sort 16 pro players into 4 hidden groups." },
  { name: "60 seconds", path: "/60-seconds", description: "Name as many pro players matching today's theme in 60 seconds." },
  { name: "Higher or lower", path: "/higher-or-lower", description: "Endless streak game comparing pro players' stats." },
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
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const routeLanguage = await getRouteLanguage();
  const language = routeLanguage ?? "en";
  return (
    <html lang={htmlLang(language)}>
      {/* A página ocupa exatamente a altura da tela; cada jogo se ajusta ao espaço abaixo do menu. */}
      <body
        className={cn(
          "flex h-[100dvh] flex-col overflow-hidden bg-cs-bg font-sans text-cs-text antialiased",
          fontSans.variable
        )}
      >
        <JsonLd data={siteJsonLd(games, pageSeo.home.description[language], language)} />
        <RouteLanguageProvider language={routeLanguage}>
          <Header />
          <div className="cs-grid-bg min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_rgba(242,163,58,0.12),_transparent_32rem)]">
            {children}
          </div>
          <SideRails />
        </RouteLanguageProvider>
        {/* Script do AdSense, que também mostra a mensagem de consentimento de cookies do Google a quem
            visita da Europa e do Reino Unido (configurada no painel do AdSense). O React o move para o <head>. */}
        {adsenseScriptSrc ? <script async src={adsenseScriptSrc} crossOrigin="anonymous" nonce={nonce} /> : null}
        {/* Contagem de visitas da Vercel: sem cookies e sem identificar quem visita (ver /privacidade). */}
        <Analytics />
      </body>
    </html>
  );
}
