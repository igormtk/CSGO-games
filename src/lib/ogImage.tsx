import { ImageResponse } from "next/og";
import { pageSeo } from "@/data/pageSeo";
import type { Language } from "./i18n";
import { siteUrl } from "./site";

export const ogSize = { width: 1200, height: 630 };

// Jogos com imagem de prévia própria: a chave vai na URL (/og?game=...&lang=...), nunca texto livre.
export const ogGames = ["bingo", "multiplayer", "mystery", "careerPath", "guessName", "lineup", "groups", "sixtySeconds", "higherLower"] as const;
export type OgGame = (typeof ogGames)[number];
export const isOgGame = (value: string | null): value is OgGame => ogGames.includes(value as OgGame);

const eyebrow: Record<Language, string> = {
  en: "COUNTER-STRIKE · DAILY",
  pt: "COUNTER-STRIKE · DIÁRIO",
  es: "COUNTER-STRIKE · DIARIO",
};

const tagline: Record<Language, string> = {
  en: "Pro player bingo, mystery player and more. A new challenge every day.",
  pt: "Bingo de pro players, jogador misterioso e mais. Um desafio novo todo dia.",
  es: "Bingo de pro players, jugador misterioso y más. Un desafío nuevo cada día.",
};

const playCta: Record<Language, string> = { en: "Play free at", pt: "Jogue grátis em", es: "Juega gratis en" };

// Cartela decorativa à direita (as casas "marcadas" imitam um bingo em andamento).
const Board = () => (
  <div style={{ display: "flex", flexWrap: "wrap", width: 360, gap: 8 }}>
    {Array.from({ length: 16 }, (_, cell) => {
      const marked = [0, 5, 6, 9, 15].includes(cell);
      return (
        <div
          key={cell}
          style={{
            width: 84,
            height: 84,
            background: marked ? "#203047" : "#232a30",
            borderBottom: marked ? "6px solid #7fc35b" : "6px solid #2c343c",
          }}
        />
      );
    })}
  </div>
);

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "72px",
      background: "#0e1114",
      color: "#e8e4d8",
      borderBottom: "12px solid #f2a33a",
    }}
  >
    {children}
    <Board />
  </div>
);

// Prévia da home e das páginas sem imagem própria.
export const renderSiteImage = (language: Language) =>
  new ImageResponse(
    (
      <Frame>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 620 }}>
          <div style={{ fontSize: 28, letterSpacing: 8, color: "#f2a33a", fontWeight: 700 }}>{eyebrow[language]}</div>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 800, marginTop: 16, lineHeight: 1 }}>
            CS<span style={{ color: "#f2a33a", marginLeft: 20 }}>GAMES</span>
          </div>
          <div style={{ fontSize: 36, marginTop: 28, color: "rgba(232,228,216,0.7)" }}>{tagline[language]}</div>
        </div>
      </Frame>
    ),
    ogSize
  );

// Prévia de um jogo: nome do jogo em destaque, no idioma do link compartilhado.
export const renderGameImage = (game: OgGame, language: Language) =>
  new ImageResponse(
    (
      <Frame>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 800, letterSpacing: 4 }}>
            CS<span style={{ color: "#f2a33a", marginLeft: 10 }}>GAMES</span>
          </div>
          <div style={{ fontSize: 88, fontWeight: 800, marginTop: 24, lineHeight: 1.05 }}>{pageSeo[game].title[language]}</div>
          <div style={{ display: "flex", fontSize: 32, marginTop: 32, color: "rgba(232,228,216,0.7)" }}>
            {playCta[language]}
            <span style={{ color: "#f2a33a", marginLeft: 12 }}>{new URL(siteUrl).host}</span>
          </div>
        </div>
      </Frame>
    ),
    ogSize
  );
