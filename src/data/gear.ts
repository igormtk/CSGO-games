import type { Language } from "@/lib/language";

// Produtos citados nos guias de equipamento e nas colunas laterais. O link do site é
// /go/amazon/<id>, que leva ao produto na loja Amazon do país do visitante
// (src/app/go/amazon/[product]/route.ts). Sem preço: ele muda e o programa da Amazon não permite
// mostrar valores copiados da loja.
//
// asin: código do produto em cada loja (o "B0..." depois de /dp/ no endereço da Amazon). Com ele o
// link vai direto à página do produto; sem ele, para a busca pelo nome na loja.

export type GearProduct = {
  id: string;
  name: string;
  query: string;
  asin?: { br?: string; us?: string };
  // Foto do produto em public/gear/ (ex.: "/gear/zowie-g-sr.jpg"). Opcional: sem ela, a caixa mostra
  // só o texto. Provisório até a API de produtos da Amazon: tirar a foto se o produto sair de linha.
  image?: string;
  pitch: Record<Language, string>;
};

export const gearProducts: GearProduct[] = [
  {
    id: "logitech-g-pro-x-superlight-2",
    name: "Logitech G Pro X Superlight 2",
    query: "Logitech G Pro X Superlight 2",
    pitch: {
      pt: "Mouse sem fio leve e simétrico, para quase toda pegada.",
      en: "Light, symmetrical wireless mouse for almost any grip.",
      es: "Mouse inalámbrico liviano y simétrico, para casi cualquier agarre.",
    },
  },
  {
    id: "zowie-g-sr",
    name: "Zowie G-SR",
    query: "Zowie G-SR mousepad",
    pitch: {
      pt: "Mousepad grande de controle, para parar a mira no lugar.",
      en: "Large control mousepad that helps stop your crosshair on target.",
      es: "Mousepad grande de control, para detener la mira en el lugar.",
    },
  },
  {
    id: "hyperx-cloud-ii",
    name: "HyperX Cloud II",
    query: "HyperX Cloud II headset",
    pitch: {
      pt: "Headset confortável para ouvir os passos por horas.",
      en: "Comfortable headset for hearing footsteps for hours.",
      es: "Auriculares cómodos para oír los pasos durante horas.",
    },
  },
  {
    id: "logitech-g-pro-keyboard",
    name: "Logitech G PRO",
    query: "Logitech G PRO mechanical keyboard",
    asin: { br: "B07QQB9VCV" },
    pitch: {
      pt: "Teclado mecânico compacto, sem teclado numérico, com cabo destacável.",
      en: "Compact tenkeyless mechanical keyboard with a detachable cable.",
      es: "Teclado mecánico compacto, sin teclado numérico, con cable desmontable.",
    },
  },
  {
    id: "zowie-xl2546k",
    name: "BenQ Zowie XL2546K",
    query: "BenQ Zowie XL2546K",
    pitch: {
      pt: "Monitor de 24\" e 240 Hz feito para o competitivo.",
      en: "24\" 240 Hz monitor built for competitive play.",
      es: "Monitor de 24\" y 240 Hz hecho para el competitivo.",
    },
  },
  {
    id: "razer-deathadder-v3",
    name: "Razer DeathAdder V3",
    query: "Razer DeathAdder V3",
    pitch: {
      pt: "Mouse ergonômico e leve para quem apoia a mão inteira.",
      en: "Light ergonomic mouse for palm grip.",
      es: "Mouse ergonómico y liviano para agarre de palma.",
    },
  },
  {
    id: "steelseries-qck-heavy",
    name: "SteelSeries QcK Heavy",
    query: "SteelSeries QcK Heavy",
    pitch: {
      pt: "Mousepad grosso de tecido, firme na mesa.",
      en: "Thick cloth mousepad that stays put on the desk.",
      es: "Mousepad grueso de tela, firme en el escritorio.",
    },
  },
  {
    id: "steelseries-apex-pro-tkl",
    name: "SteelSeries Apex Pro TKL",
    query: "SteelSeries Apex Pro TKL",
    pitch: {
      pt: "Teclado compacto com acionamento ajustável.",
      en: "Compact keyboard with adjustable actuation.",
      es: "Teclado compacto con activación ajustable.",
    },
  },
  {
    id: "zowie-ec2-c",
    name: "Zowie EC2-C",
    query: "Zowie EC2-C mouse",
    pitch: {
      pt: "Formato ergonômico clássico do competitivo, sem software.",
      en: "Classic competitive ergonomic shape, no software needed.",
      es: "Forma ergonómica clásica del competitivo, sin software.",
    },
  },
];

export const getGearProduct = (id: string) => gearProducts.find((product) => product.id === id);

// Produtos das colunas laterais no dia: quatro seguidos na lista, que alterna tipos de equipamento.
export function gearForDay(seed: number, count = 4): GearProduct[] {
  const start = seed % gearProducts.length;
  return Array.from({ length: Math.min(count, gearProducts.length) }, (_, index) => gearProducts[(start + index) % gearProducts.length]);
}
