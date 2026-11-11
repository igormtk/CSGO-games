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
  // Foto do produto em public/gear/, por loja (o modelo vendido no Brasil e nos EUA pode diferir).
  // Sem a da loja, usa a da outra; sem nenhuma, a caixa mostra só o texto. Provisório até a API de
  // produtos da Amazon: tirar a foto se o produto sair de linha.
  image?: { br?: string; us?: string };
  // Aparece nas colunas laterais. Sem nenhum marcado, as colunas usam a lista toda.
  rail?: boolean;
  pitch: Record<Language, string>;
};

export const gearProducts: GearProduct[] = [
  {
    // Brasil: Superlight 2c SE; EUA: Superlight 2. O nome cobre a linha.
    id: "logitech-g-pro-x-superlight-2",
    name: "Logitech G Pro X Superlight",
    query: "Logitech G Pro X Superlight 2",
    asin: { br: "B0HLTG9S6N", us: "B09NBWL8J5" },
    image: { br: "/gear/logitech-g-pro-x-superlight-2.jpg", us: "/gear/logitech-g-pro-x-superlight-2-us.jpg" },
    rail: true,
    pitch: {
      pt: "Mouse sem fio ultraleve, feito para o competitivo.",
      en: "Ultralight wireless mouse built for competitive play.",
      es: "Mouse inalámbrico ultraliviano, hecho para el competitivo.",
    },
  },
  {
    id: "zowie-h-tr",
    name: "Zowie H-TR",
    query: "Zowie H-TR mousepad",
    asin: { br: "B0DRN98ZTX" },
    image: { br: "/gear/zowie-h-tr.jpg" },
    rail: true,
    pitch: {
      pt: "Mousepad grande de 50 x 50 cm, feito para esports.",
      en: "Large 50 x 50 cm mousepad built for esports.",
      es: "Mousepad grande de 50 x 50 cm, hecho para esports.",
    },
  },
  {
    id: "hyperx-cloud-usb",
    name: "HyperX Cloud III",
    query: "HyperX Cloud III headset",
    asin: { br: "B0C3BV19Q3", us: "B0C3BSZ56D" },
    image: { us: "/gear/hyperx-cloud-iii.jpg" },
    rail: true,
    pitch: {
      pt: "Headset com drivers de 53 mm para ouvir cada passo.",
      en: "Headset with 53 mm drivers to hear every footstep.",
      es: "Auriculares con drivers de 53 mm para oír cada paso.",
    },
  },
  {
    // Brasil: 24GS60F-B (24", 180 Hz); EUA: 27G440A-B (27", 240 Hz). Cada loja mostra a sua foto.
    id: "lg-ultragear",
    name: "LG UltraGear",
    query: "LG UltraGear 27G440A-B",
    asin: { br: "B0D8DPT7ZY", us: "B0FS36DWHY" },
    image: { br: "/gear/lg-ultragear.jpg", us: "/gear/lg-ultragear-us.jpg" },
    rail: true,
    pitch: {
      pt: "Monitor gamer IPS Full HD com 1 ms e FreeSync.",
      en: "Full HD IPS gaming monitor with 1 ms and FreeSync.",
      es: "Monitor gamer IPS Full HD con 1 ms y FreeSync.",
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

// Foto do produto para a loja do visitante, ou a da outra loja.
export const gearImage = (product: GearProduct, store: "br" | "us") =>
  product.image?.[store] ?? product.image?.br ?? product.image?.us;

// Vitrine dos espaços de anúncio (colunas laterais e fim de jogo): os produtos marcados com rail (ou
// a lista toda). Com foto e sem foto vão intercalados, para cada coluna (dois produtos seguidos) ter
// pelo menos uma foto quando houver.
const showcaseCandidates = gearProducts.some((product) => product.rail) ? gearProducts.filter((product) => product.rail) : gearProducts;
const showcaseWithImage = showcaseCandidates.filter((product) => product.image);
const showcaseWithoutImage = showcaseCandidates.filter((product) => !product.image);
export const gearShowcase: GearProduct[] = Array.from(
  { length: Math.max(showcaseWithImage.length, showcaseWithoutImage.length) },
  (_, index) => [showcaseWithImage[index], showcaseWithoutImage[index]]
)
  .flat()
  .filter((product): product is GearProduct => Boolean(product));

// count produtos seguidos da vitrine a partir de start (dá a volta no fim da lista).
export function gearFrom(start: number, count: number): GearProduct[] {
  const size = gearShowcase.length;
  return Array.from({ length: Math.min(count, size) }, (_, index) => gearShowcase[(((start + index) % size) + size) % size]);
}

// Ponto de partida sorteado a cada visita. Sempre par, para as colunas laterais manterem os pares
// com foto e sem foto da vitrine.
export const randomShowcaseStart = () => 2 * Math.floor(Math.random() * Math.ceil(gearShowcase.length / 2));

// Primeiro produto com foto a partir de start (no fim de jogo, a foto chama mais atenção).
export function gearFeatured(start: number): GearProduct {
  const ordered = gearFrom(start, gearShowcase.length);
  return ordered.find((product) => product.image) ?? ordered[0];
}
