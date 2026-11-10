// Links de afiliado da Amazon. Cada loja tem um cadastro próprio no programa de associados, e a
// comissão só vale para compras feitas na loja do código usado. Brasileiros vão para a
// amazon.com.br; o resto do mundo vai para a amazon.com, que entrega em vários países.

export type AmazonStore = { host: string; tag: string };

const BRAZIL: AmazonStore = { host: "www.amazon.com.br", tag: "csgogames-20" };
const UNITED_STATES: AmazonStore = { host: "www.amazon.com", tag: "csgogames06-20" };

// country: código ISO de duas letras (cabeçalho x-vercel-ip-country). Sem país, usa a loja dos EUA.
export function amazonStoreFor(country: string | null | undefined): AmazonStore {
  return country?.toUpperCase() === "BR" ? BRAZIL : UNITED_STATES;
}

// Link de busca com o código de associado: não depende do código do produto em cada loja (que muda
// de um país para outro) e qualquer compra feita a partir dele conta para a comissão.
export function amazonSearchUrl(store: AmazonStore, query: string): string {
  const url = new URL(`https://${store.host}/s`);
  url.searchParams.set("k", query);
  url.searchParams.set("tag", store.tag);
  return url.toString();
}
