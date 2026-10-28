"use client";

import { useEffect, useState } from "react";

// Idioma escolhido vale para o site todo. A chave antiga do bingo continua para não perder a escolha.
export type Language = "pt" | "en" | "es";

export const LANGUAGES: { code: Language; name: string }[] = [
  { code: "pt", name: "Português" },
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
];

const LANGUAGE_KEY = "cs-bingo-language";
const LANGUAGE_EVENT = "cs-language-change";

const isLanguage = (value: unknown): value is Language => LANGUAGES.some((language) => language.code === value);

export const getStoredLanguage = (): Language => {
  if (typeof window === "undefined") return "pt";

  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_KEY);
    if (isLanguage(storedLanguage)) return storedLanguage;
  } catch {
    // Sem armazenamento: cai no idioma do navegador.
  }

  const browserLanguage = window.navigator.language.toLowerCase();
  if (browserLanguage.startsWith("en")) return "en";
  if (browserLanguage.startsWith("es")) return "es";
  return "pt";
};

export const setStoredLanguage = (language: Language) => {
  try {
    window.localStorage.setItem(LANGUAGE_KEY, language);
  } catch {
    // Sem armazenamento: a troca vale só até recarregar.
  }
  document.documentElement.lang = language === "pt" ? "pt-BR" : language;
  window.dispatchEvent(new CustomEvent<Language>(LANGUAGE_EVENT, { detail: language }));
};

// Começa em português (o HTML do build) e troca depois da montagem para não divergir na hidratação.
export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>("pt");

  useEffect(() => {
    const storedLanguage = getStoredLanguage();
    setLanguage(storedLanguage);
    document.documentElement.lang = storedLanguage === "pt" ? "pt-BR" : storedLanguage;

    const handleChange = (event: Event) => setLanguage((event as CustomEvent<Language>).detail);
    window.addEventListener(LANGUAGE_EVENT, handleChange);
    return () => window.removeEventListener(LANGUAGE_EVENT, handleChange);
  }, []);

  return language;
};
