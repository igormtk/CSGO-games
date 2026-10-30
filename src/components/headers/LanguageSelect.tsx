"use client";

import { Globe2 } from "lucide-react";
import { LANGUAGES, goToLanguage, setStoredLanguage, useLanguage, useRouteLanguage } from "@/lib/language";
import type { Language } from "@/lib/language";

const selectLabel: Record<Language, string> = { pt: "Idioma", en: "Language", es: "Idioma" };

// Sem prefixo, a troca é na hora (fica salva). Num endereço com idioma (/pt/...), vai para o mesmo
// endereço no idioma escolhido, que é o que o buscador e o link compartilhado mostram.
const changeLanguage = (language: Language, routeLanguage: Language | undefined) => {
  setStoredLanguage(language);
  if (routeLanguage) goToLanguage(language);
};

export function LanguageSelect() {
  const language = useLanguage();
  const routeLanguage = useRouteLanguage();

  return (
    <label className="cs-cut-sm inline-flex items-center gap-1 bg-cs-raised px-2 py-1.5 text-cs-text/80">
      <Globe2 className="h-4 w-4" />
      <select
        value={language}
        onChange={(event) => changeLanguage(event.target.value as Language, routeLanguage)}
        className="bg-transparent text-xs font-bold uppercase outline-none"
        aria-label={selectLabel[language]}
      >
        {LANGUAGES.map(({ code, name }) => (
          <option key={code} value={code} className="bg-cs-panel text-cs-text" title={name}>
            {code.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
