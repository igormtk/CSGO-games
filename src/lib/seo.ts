import type { Metadata } from "next";
import { headers } from "next/headers";
import type { PageSeo } from "@/data/pageSeo";
import { DEFAULT_LANGUAGE, LANGUAGE_HEADER, isLanguage, languageAlternates, localizePath, ogLocale } from "./i18n";
import type { Language } from "./i18n";
import { ogSize } from "./ogImage";
import type { OgGame } from "./ogImage";
import { siteName } from "./site";

// Idioma do endereço (/pt/..., /es/...) que o proxy pôs no cabeçalho; sem prefixo, undefined.
export const getRouteLanguage = async (): Promise<Language | undefined> => {
  const value = (await headers()).get(LANGUAGE_HEADER);
  return isLanguage(value) ? value : undefined;
};

export const getPageLanguage = async (): Promise<Language> => (await getRouteLanguage()) ?? DEFAULT_LANGUAGE;

// Metadata de uma página no idioma do endereço, com canônico próprio e hreflang para os outros dois.
// absoluteTitle: o título não leva o " · CS Games" do modelo (a home já começa com o nome).
// game: a prévia leva o nome do jogo; sem ele, a prévia geral do site. A imagem vai em toda página
// porque um openGraph próprio substitui o do layout inteiro (inclusive a imagem).
export const localizedMetadata = async (
  page: PageSeo,
  options: { absoluteTitle?: boolean; type?: "website" | "article"; game?: OgGame } = {}
): Promise<Metadata> => {
  const language = await getPageLanguage();
  const url = localizePath(page.path, language);
  const title = page.title[language];
  const description = page.description[language];
  const image = {
    url: `/og-image?${new URLSearchParams({ ...(options.game ? { game: options.game } : {}), lang: language })}`,
    ...ogSize,
    alt: title,
  };
  return {
    title: options.absoluteTitle ? { absolute: title } : title,
    description,
    ...(page.keywords ? { keywords: page.keywords } : {}),
    alternates: { canonical: url, languages: languageAlternates(page.path) },
    openGraph: {
      type: options.type ?? "website",
      siteName,
      url,
      title,
      description,
      locale: ogLocale[language],
      alternateLocale: (["en", "pt", "es"] as const).filter((other) => other !== language).map((other) => ogLocale[other]),
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
};
