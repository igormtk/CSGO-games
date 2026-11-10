import type { JSX } from "react";
import type { GearCategory } from "@/data/gear";

// Ilustrações próprias dos tipos de equipamento, nas cores do site. Fotos de produto só podem vir
// pelas ferramentas da Amazon (API de produtos), liberadas depois das primeiras vendas.
// Contorno em dourado (currentColor) e detalhes em laranja.

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const accent = "text-cs-orange";

function Mouse() {
  return (
    <>
      <path {...stroke} d="M60 18c-17 0-28 14-28 34v26c0 16 12 26 28 26s28-10 28-26V52c0-20-11-34-28-34z" />
      <path {...stroke} d="M32 52h56M60 18v34" />
      <rect x="56" y="30" width="8" height="14" rx="4" className={accent} fill="currentColor" />
    </>
  );
}

function Mousepad() {
  return (
    <>
      <path {...stroke} d="M14 74 46 46h60L74 74z" />
      <path {...stroke} d="M14 74v6l32-28M74 74v6l32-28V46M14 80h60" opacity="0.6" />
      <path {...stroke} className={accent} d="M66 52c-6 0-10 4-10 9v4c0 4 4 7 10 7s10-3 10-7v-4c0-5-4-9-10-9z" />
      <path {...stroke} className={accent} d="M56 60h20M66 52v8" />
    </>
  );
}

function Headset() {
  return (
    <>
      <path {...stroke} d="M26 70V58c0-19 15-34 34-34s34 15 34 34v12" />
      <rect {...stroke} x="18" y="64" width="18" height="30" rx="8" />
      <rect {...stroke} x="84" y="64" width="18" height="30" rx="8" />
      <path {...stroke} className={accent} d="M27 94c0 10 10 16 24 16h4" />
      <circle cx="58" cy="110" r="4" className={accent} fill="currentColor" />
    </>
  );
}

function Keyboard() {
  const keys = [];
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      keys.push(<rect key={`${row}-${col}`} x={17 + col * 11} y={46 + row * 11} width="8" height="8" rx="1.5" fill="currentColor" opacity="0.55" />);
    }
  }
  return (
    <>
      <rect {...stroke} x="10" y="38" width="100" height="50" rx="5" />
      {keys}
      <rect x="39" y="79" width="42" height="5" rx="1.5" className={accent} fill="currentColor" />
      <rect x="28" y="57" width="8" height="8" rx="1.5" className={accent} fill="currentColor" />
    </>
  );
}

function Monitor() {
  return (
    <>
      <rect {...stroke} x="12" y="20" width="96" height="62" rx="4" />
      <path {...stroke} d="M60 82v14M40 100h40" />
      <g className={accent}>
        <path {...stroke} strokeWidth={2.5} d="M60 38v8M60 56v8M44 51h8M68 51h8" />
        <circle cx="60" cy="51" r="1.8" fill="currentColor" />
      </g>
    </>
  );
}

const drawings: Record<GearCategory, () => JSX.Element> = {
  mouse: Mouse,
  mousepad: Mousepad,
  headset: Headset,
  keyboard: Keyboard,
  monitor: Monitor,
};

export function GearIllustration({ category, className }: { category: GearCategory; className?: string }) {
  const Drawing = drawings[category];
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <Drawing />
    </svg>
  );
}
