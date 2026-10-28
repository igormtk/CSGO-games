import type { Metadata, Viewport } from "next";
import { Rajdhani as FontSans } from "next/font/google";
import Header from "@/components/headers/Header";
import "./globals.css";

import { cn } from "@/lib/utils";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

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
  openGraph: { type: "website", siteName, locale: "pt_BR", url: "/" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0e1114",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      {/* A página ocupa exatamente a altura da tela; cada jogo se ajusta ao espaço abaixo do menu. */}
      <body
        className={cn(
          "flex h-[100dvh] flex-col overflow-hidden bg-cs-bg font-sans text-cs-text antialiased",
          fontSans.variable
        )}
      >
        <Header />
        <div className="cs-grid-bg min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_rgba(242,163,58,0.12),_transparent_32rem)]">
          {children}
        </div>
      </body>
    </html>
  );
}
