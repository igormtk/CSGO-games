import type { Metadata } from "next";
import { headers } from "next/headers";
import type { PageSeo } from "@/data/pageSeo";
import { DEFAULT_LANGUAGE, LANGUAGE_HEADER, isLanguage, languageAlternates, localizePath, ogLocale } from "./i18n";
import type { Language } from "./i18n";
import { siteName } from "./site";

// Idioma do endereço (/pt/..., /es/...) que o proxy pôs no cabeçalho; sem prefixo, undefined.
export const getRouteLanguage = async (): Promise<Language | undefined> => {
  const value = (await headers()).get(LANGUAGE_HEADER);
  return isLanguage(value) ? value : undefined;
};

export const getPageLanguage = async (): Promise<Language> => (await getRouteLanguage()) ?? DEFAULT_LANGUAGE;

// Metadata de uma página no idioma do endereço, com canônico próprio e hreflang para os outros dois.
// absoluteTitle: o título não leva o " · CS Games" do modelo (a home já começa com o nome).
export const localizedMetadata = async (
  page: PageSeo,
  options: { absoluteTitle?: boolean; type?: "website" | "article" } = {}
): Promise<Metadata> => {
  const language = await getPageLanguage();
  const url = localizePath(page.path, language);
  const title = page.title[language];
  const description = page.description[language];
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
    },
  };
};
