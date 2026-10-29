"use client";

import { useEffect, useSyncExternalStore } from "react";

// Idioma escolhido vale para o site todo. A chave antiga do bingo continua para não perder a escolha.
export type Language = "pt" | "en" | "es";

// Inglês é o idioma base: é o que vai no HTML (buscadores e IAs) e o padrão de quem não tem
// navegador em português ou espanhol.
export const DEFAULT_LANGUAGE: Language = "en";

export const LANGUAGES: { code: Language; name: string }[] = [
  { code: "en", name: "English" },
  { code: "pt", name: "Português" },
  { code: "es", name: "Español" },
];

const htmlLang = (language: Language) => (language === "pt" ? "pt-BR" : language);

const LANGUAGE_KEY = "cs-bingo-language";
const LANGUAGE_EVENT = "cs-language-change";

const isLanguage = (value: unknown): value is Language => LANGUAGES.some((language) => language.code === value);

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

// No servidor e na hidratação vale o idioma base (o do HTML); no navegador, o salvo ou o do
// navegador. O useSyncExternalStore faz essa troca sem divergir na hidratação.
export const useLanguage = () => {
  const language = useSyncExternalStore(subscribeToLanguage, getStoredLanguage, () => DEFAULT_LANGUAGE);

  useEffect(() => {
    document.documentElement.lang = htmlLang(language);
  }, [language]);

  return language;
};
