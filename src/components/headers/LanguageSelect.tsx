"use client";

import { Globe2 } from "lucide-react";
import { LANGUAGES, setStoredLanguage, useLanguage } from "@/lib/language";
import type { Language } from "@/lib/language";

const selectLabel: Record<Language, string> = { pt: "Idioma", en: "Language", es: "Idioma" };

export function LanguageSelect() {
  const language = useLanguage();

  return (
    <label className="cs-cut-sm inline-flex items-center gap-1 bg-cs-raised px-2 py-1.5 text-cs-text/80">
      <Globe2 className="h-4 w-4" />
      <select
        value={language}
        onChange={(event) => setStoredLanguage(event.target.value as Language)}
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
