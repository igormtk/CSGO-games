import { ImageResponse } from "next/og";

export const alt = "CS Games · Daily Counter-Strike games";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagem de prévia usada quando o link é compartilhado (WhatsApp, X, Discord).
export default function OpengraphImage() {
  const cells = Array.from({ length: 16 }, (_, index) => index);

  return new ImageResponse(
    (
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
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 620 }}>
          <div style={{ fontSize: 28, letterSpacing: 8, color: "#f2a33a", fontWeight: 700 }}>COUNTER-STRIKE · DAILY</div>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 800, marginTop: 16, lineHeight: 1 }}>
            CS<span style={{ color: "#f2a33a", marginLeft: 20 }}>GAMES</span>
          </div>
          <div style={{ fontSize: 36, marginTop: 28, color: "rgba(232,228,216,0.7)" }}>
            Pro player bingo, mystery player and more. A new challenge every day.
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", width: 360, gap: 8 }}>
          {cells.map((cell) => (
            <div
              key={cell}
              style={{
                width: 84,
                height: 84,
                background: [0, 5, 6, 9, 15].includes(cell) ? "#203047" : "#232a30",
                borderBottom: [0, 5, 6, 9, 15].includes(cell) ? "6px solid #7fc35b" : "6px solid #2c343c",
              }}
            />
          ))}
        </div>
      </div>
    ),
    size
  );
}
