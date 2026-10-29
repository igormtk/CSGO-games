// Google AdSense. O código do editor (ca-pub-...) e os números dos blocos vêm do painel do AdSense e são
// públicos (aparecem no HTML de qualquer site com anúncio). Sem o código, nada do Google é carregado e
// os espaços mostram só as campanhas diretas de src/data/partners.ts ou o "Anuncie aqui".
// Campanhas diretas têm prioridade: o AdSense só ocupa o espaço que ficaria com o "Anuncie aqui".

const rawClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();

// Validado porque o valor entra na política de conteúdo, no ads.txt e no HTML.
export const adsenseClient = rawClient && /^ca-pub-\d{10,20}$/.test(rawClient) ? rawClient : undefined;

// "pub-..." é o formato do ads.txt e da meta tag de verificação.
export const adsensePublisherId = adsenseClient?.replace(/^ca-/, "");

const slot = (value: string | undefined) => (value && /^\d{6,20}$/.test(value.trim()) ? value.trim() : undefined);

// Um bloco por formato de espaço (card: fim de jogo; banner: home; rail: colunas laterais 160x600).
export const adsenseSlots = {
  card: slot(process.env.NEXT_PUBLIC_ADSENSE_SLOT_CARD),
  banner: slot(process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER),
  rail: slot(process.env.NEXT_PUBLIC_ADSENSE_SLOT_RAIL),
};

export const adsenseScriptSrc = adsenseClient
  ? `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`
  : undefined;

// Domínios que os anúncios do Google e a mensagem de consentimento (CMP do próprio Google) usam.
// Scripts não entram aqui: o 'strict-dynamic' já libera o que o script do AdSense carregar.
export const adsenseCsp = {
  frame: [
    "https://*.googlesyndication.com",
    "https://*.doubleclick.net",
    "https://www.google.com",
    "https://*.adtrafficquality.google",
    "https://fundingchoicesmessages.google.com",
  ],
  connect: [
    "https://*.googlesyndication.com",
    "https://*.doubleclick.net",
    "https://*.google.com",
    "https://*.googleadservices.com",
    "https://*.adtrafficquality.google",
  ],
};
