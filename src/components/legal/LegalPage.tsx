"use client";

import type { ReactNode } from "react";
import { useLanguage } from "@/lib/language";
import type { Language } from "@/lib/language";

const legalCopy: Record<Language, { updated: string; contact: string; contactPending: string; locale: string }> = {
  pt: { updated: "Atualizado em", contact: "Contato", contactPending: "o canal oficial será publicado aqui.", locale: "pt-BR" },
  en: { updated: "Updated on", contact: "Contact", contactPending: "the official channel will be published here.", locale: "en-US" },
  es: { updated: "Actualizado el", contact: "Contacto", contactPending: "el canal oficial se publicará aquí.", locale: "es-ES" },
};

type LegalPageProps = {
  title: Record<Language, string>;
  // Data ISO (AAAA-MM-DD), formatada no idioma de quem lê
  updatedAt: string;
  content: Record<Language, ReactNode>;
};

// Moldura comum das páginas de texto (privacidade e termos). Diferente dos jogos, estas
// páginas podem rolar: o texto não cabe numa tela de celular.
export function LegalPage({ title, updatedAt, content }: LegalPageProps) {
  const language = useLanguage();
  const copy = legalCopy[language];
  const date = new Intl.DateTimeFormat(copy.locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(updatedAt));

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
      <div className="cs-cut bg-cs-line p-[2px]">
        <article className="cs-cut space-y-4 bg-cs-surface px-5 py-6 text-base font-semibold leading-7 text-cs-text/75 sm:px-8 [&_h2]:pt-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-wider [&_h2]:text-cs-text [&_li]:ml-5 [&_li]:list-disc">
          <header className="border-b-2 border-cs-orange pb-3">
            <h1 className="text-3xl font-bold uppercase tracking-wide text-cs-text">{title[language]}</h1>
            <p className="text-sm text-cs-text/45">
              {copy.updated} {date}
            </p>
          </header>
          {content[language]}
          <ContactLine language={language} />
        </article>
      </div>
    </main>
  );
}

export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

function ContactLine({ language }: { language: Language }) {
  const copy = legalCopy[language];
  return contactEmail ? (
    <p>
      {copy.contact}: <a className="text-cs-orange underline" href={`mailto:${contactEmail}`}>{contactEmail}</a>
    </p>
  ) : (
    <p>
      {copy.contact}: {copy.contactPending}
    </p>
  );
}
