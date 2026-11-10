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
  // Aparece nas colunas laterais. Sem nenhum marcado, as colunas usam a lista toda.
  rail?: boolean;
  pitch: Record<Language, string>;
};

export const gearProducts: GearProduct[] = [
  {
    id: "logitech-g-pro-x-superlight-2",
    name: "Logitech G Pro X Superlight 2c SE",
    query: "Logitech G Pro X Superlight 2c SE",
    asin: { br: "B0HLTG9S6N" },
    image: "/gear/logitech-g-pro-x-superlight-2.jpg",
    rail: true,
    pitch: {
      pt: "Mouse sem fio compacto e ultraleve, com só 51 g.",
      en: "Compact, ultralight wireless mouse at just 51 g.",
      es: "Mouse inalámbrico compacto y ultraliviano, de solo 51 g.",
    },
  },
  {
    id: "zowie-h-tr",
    name: "Zowie H-TR",
    query: "Zowie H-TR mousepad",
    asin: { br: "B0DRN98ZTX" },
    image: "/gear/zowie-h-tr.jpg",
    rail: true,
    pitch: {
      pt: "Mousepad grande de 50 x 50 cm, feito para esports.",
      en: "Large 50 x 50 cm mousepad built for esports.",
      es: "Mousepad grande de 50 x 50 cm, hecho para esports.",
    },
  },
  {
    id: "hyperx-cloud-usb",
    name: "HyperX Cloud (USB)",
    query: "HyperX Cloud USB headset",
    asin: { br: "B0C3BV19Q3" },
    rail: true,
    pitch: {
      pt: "Headset gamer com conexão USB para ouvir os passos.",
      en: "USB gaming headset for hearing footsteps.",
      es: "Auriculares gamer USB para oír los pasos.",
    },
  },
  {
    id: "lg-ultragear",
    name: "LG UltraGear",
    query: "LG UltraGear gaming monitor",
    asin: { br: "B0D8DPT7ZY" },
    rail: true,
    pitch: {
      pt: "Monitor gamer com DisplayPort e FreeSync.",
      en: "Gaming monitor with DisplayPort and FreeSync.",
      es: "Monitor gamer con DisplayPort y FreeSync.",
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

// Produtos das colunas laterais no dia: quatro seguidos entre os marcados com rail (ou a lista
// toda), começando num ponto diferente a cada dia.
export function gearForDay(seed: number, count = 4): GearProduct[] {
  const pool = gearProducts.some((product) => product.rail) ? gearProducts.filter((product) => product.rail) : gearProducts;
  const start = seed % pool.length;
  return Array.from({ length: Math.min(count, pool.length) }, (_, index) => pool[(start + index) % pool.length]);
}
