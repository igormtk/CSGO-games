"use client";

import { createContext, createElement, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { DEFAULT_LANGUAGE, LANGUAGES, htmlLang, isLanguage, localizePath, splitLanguage } from "./i18n";
import type { Language } from "./i18n";

export { DEFAULT_LANGUAGE, LANGUAGES };
export type { Language };

// Idioma escolhido vale para o site todo. A chave antiga do bingo continua para não perder a escolha.
const LANGUAGE_KEY = "cs-bingo-language";
const LANGUAGE_EVENT = "cs-language-change";

// Idioma do endereço (/pt/... ou /es/...), lido pelo layout no servidor. Nele o idioma é fixo, inclusive
// no HTML do servidor; sem prefixo vale a escolha salva (e o inglês no HTML).
const RouteLanguageContext = createContext<Language | undefined>(undefined);

export function RouteLanguageProvider({ language, children }: { language?: Language; children: ReactNode }) {
  return createElement(RouteLanguageContext.Provider, { value: language }, children);
}

export const useRouteLanguage = () => useContext(RouteLanguageContext);

// Link interno no idioma do endereço atual: em /pt/..., "/bingo" vira "/pt/bingo".
export const useLocalizePath = () => {
  const routeLanguage = useRouteLanguage();
  return useCallback((path: string) => localizePath(path, routeLanguage), [routeLanguage]);
};

// Link do resultado compartilhado, no idioma de quem compartilha: quem recebe abre o jogo no mesmo
// idioma, e cada link espalhado aponta para a página daquele idioma.
export const getShareUrl = (path: string) => {
  const language = splitLanguage(window.location.pathname).language ?? getStoredLanguage();
  return `${window.location.origin}${localizePath(path, language)}`;
};

// Leva para o mesmo endereço em outro idioma (recarrega: o idioma do endereço vem do servidor).
export const goToLanguage = (language: Language) => {
  const { path } = splitLanguage(window.location.pathname);
  // Recarregar de propósito: o layout (que guarda o idioma do endereço) não é refeito na navegação do Next.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign(`${localizePath(path, language)}${window.location.search}`);
};

export const getStoredLanguage = (): Language => {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_KEY);
    if (isLanguage(storedLanguage)) return storedLanguage;
  } catch {
    // Sem armazenamento: cai no idioma do navegador.
  }

  const browserLanguage = window.navigator.language.toLowerCase();
  if (browserLanguage.startsWith("pt")) return "pt";
  if (browserLanguage.startsWith("es")) return "es";
  return DEFAULT_LANGUAGE;
};

export const setStoredLanguage = (language: Language) => {
  try {
    window.localStorage.setItem(LANGUAGE_KEY, language);
  } catch {
    // Sem armazenamento: a troca vale só até recarregar.
  }
  document.documentElement.lang = htmlLang(language);
  window.dispatchEvent(new CustomEvent<Language>(LANGUAGE_EVENT, { detail: language }));
};

// O título do HTML vem da metadata em inglês; no navegador ele acompanha o idioma escolhido.
// O Next aplica a metadata por streaming depois da hidratação (nas páginas dinâmicas, dentro do
// body), então o título é vigiado no documento todo e reaplicado sempre que voltar a ser outro.
export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const apply = () => {
      if (document.title !== title) document.title = title;
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }, [title]);
};

// Troca no seletor (mesma aba) e em outras abas (evento storage) avisam quem usa o idioma.
const subscribeToLanguage = (onChange: () => void) => {
  window.addEventListener(LANGUAGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(LANGUAGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};

// Em /pt/... e /es/... vale o idioma do endereço, já no servidor. Sem prefixo, no servidor e na
// hidratação vale o idioma base (o do HTML); no navegador, o salvo ou o do navegador. O
// useSyncExternalStore faz essa troca sem divergir na hidratação.
export const useLanguage = () => {
  const routeLanguage = useRouteLanguage();
  const storedLanguage = useSyncExternalStore(subscribeToLanguage, getStoredLanguage, () => DEFAULT_LANGUAGE);
  const language = routeLanguage ?? storedLanguage;

  useEffect(() => {
    document.documentElement.lang = htmlLang(language);
  }, [language]);

  return language;
};
