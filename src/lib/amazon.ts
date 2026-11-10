// Links de afiliado da Amazon. Cada loja tem um cadastro próprio no programa de associados, e a
// comissão só vale para compras feitas na loja do código usado. Brasileiros vão para a
// amazon.com.br; o resto do mundo vai para a amazon.com, que entrega em vários países.

import type { GearProduct } from "@/data/gear";

export type AmazonStore = { key: "br" | "us"; host: string; tag: string };

const BRAZIL: AmazonStore = { key: "br", host: "www.amazon.com.br", tag: "csgogames-20" };
const UNITED_STATES: AmazonStore = { key: "us", host: "www.amazon.com", tag: "csgogames06-20" };

// country: código ISO de duas letras (cabeçalho x-vercel-ip-country). Sem país, usa a loja dos EUA.
export function amazonStoreFor(country: string | null | undefined): AmazonStore {
  return country?.toUpperCase() === "BR" ? BRAZIL : UNITED_STATES;
}

// Com o código do produto naquela loja, vai direto à página dele; sem, abre a busca pelo nome
// (qualquer compra feita a partir da busca também conta para a comissão).
export function amazonProductUrl(store: AmazonStore, product: GearProduct): string {
  const asin = product.asin?.[store.key];
  const url = asin ? new URL(`https://${store.host}/dp/${asin}`) : new URL(`https://${store.host}/s`);
  if (!asin) url.searchParams.set("k", product.query);
  url.searchParams.set("tag", store.tag);
  return url.toString();
}
