// Idiomas e endereços por idioma, sem "use client": servidor (proxy, metadata, sitemap) e
// navegador usam as mesmas regras.
export type Language = "pt" | "en" | "es";

// Inglês é o idioma base: fica nos endereços sem prefixo (/bingo) e é o padrão de quem não tem
// navegador em português ou espanhol. Português e espanhol ganham prefixo (/pt/bingo, /es/bingo)
// para os buscadores indexarem cada idioma separado.
export const DEFAULT_LANGUAGE: Language = "en";

export const LANGUAGES: { code: Language; name: string }[] = [
  { code: "en", name: "English" },
  { code: "pt", name: "Português" },
  { code: "es", name: "Español" },
];

export const htmlLang = (language: Language) => (language === "pt" ? "pt-BR" : language);

export const ogLocale: Record<Language, string> = { en: "en_US", pt: "pt_BR", es: "es_ES" };

export const isLanguage = (value: unknown): value is Language => LANGUAGES.some((language) => language.code === value);

// Cabeçalho que o proxy põe na requisição reescrita de /pt/... e /es/... (ver src/proxy.ts).
export const LANGUAGE_HEADER = "x-language";

// "/bingo" em português vira "/pt/bingo"; em inglês continua "/bingo". Aceita query (?date=...).
export const localizePath = (path: string, language: Language | undefined) => {
  if (!language || language === DEFAULT_LANGUAGE || !path.startsWith("/")) return path;
  return path === "/" ? `/${language}` : path.startsWith("/?") ? `/${language}${path.slice(1)}` : `/${language}${path}`;
};

// O contrário: "/pt/bingo" vira { language: "pt", path: "/bingo" }. Sem prefixo, sem idioma.
export const splitLanguage = (pathname: string): { language?: Language; path: string } => {
  const match = pathname.match(/^\/(pt|es|en)(?=\/|$)(.*)$/);
  return match ? { language: match[1] as Language, path: match[2] || "/" } : { path: pathname };
};

// Endereço de cada idioma de uma página, para o hreflang e o sitemap.
export const languageAlternates = (path: string) => ({
  en: path,
  "pt-BR": localizePath(path, "pt"),
  es: localizePath(path, "es"),
  "x-default": path,
});
