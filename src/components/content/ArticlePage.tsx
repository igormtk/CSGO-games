"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { useDocumentTitle, useLanguage } from "@/lib/language";
import type { Language } from "@/lib/language";

type Localized<T> = Record<Language, T>;

type ArticlePageProps = {
  title: Localized<string>;
  intro: Localized<string>;
  content: Localized<ReactNode>;
  // Chamada para o jogo relacionado ao fim do texto.
  cta?: { href: string; label: Localized<string> };
};

const articleCopy: Localized<{ guides: string; about: string; home: string }> = {
  pt: { guides: "Guias e estatísticas", about: "Sobre", home: "Início" },
  en: { guides: "Guides and stats", about: "About", home: "Home" },
  es: { guides: "Guías y estadísticas", about: "Acerca de", home: "Inicio" },
};

// Moldura das páginas de texto (guias, estatísticas, sobre). Como as páginas legais, podem rolar.
export function ArticlePage({ title, intro, content, cta }: ArticlePageProps) {
  const language = useLanguage();
  const copy = articleCopy[language];
  useDocumentTitle(`${title[language]} · CS Games`);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
      <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap gap-x-2 text-sm font-bold uppercase tracking-wider text-cs-text/45">
        <Link href="/" className="transition hover:text-cs-orange">{copy.home}</Link>
        <span aria-hidden>/</span>
        <Link href="/guides" className="transition hover:text-cs-orange">{copy.guides}</Link>
      </nav>
      <div className="cs-cut bg-cs-line p-[2px]">
        <article className="cs-cut space-y-4 bg-cs-surface px-5 py-6 text-base font-semibold leading-7 text-cs-text/75 sm:px-8 [&_a]:text-cs-orange [&_a]:underline [&_h2]:pt-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-wider [&_h2]:text-cs-text [&_ol>li]:ml-5 [&_ol>li]:list-decimal [&_strong]:text-cs-text [&_ul>li]:ml-5 [&_ul>li]:list-disc">
          <header className="space-y-2 border-b-2 border-cs-orange pb-3">
            <h1 className="text-3xl font-bold uppercase tracking-wide text-cs-text">{title[language]}</h1>
            <p className="text-lg text-cs-text/60">{intro[language]}</p>
          </header>
          {content[language]}
          {cta ? (
            <p className="pt-2">
              <Link
                href={cta.href}
                className="cs-cut-sm inline-flex items-center gap-2 bg-cs-orange px-4 py-2 font-bold uppercase tracking-wider !text-cs-bg !no-underline transition hover:bg-[#ffb85a]"
              >
                {cta.label[language]} <ArrowRight className="h-4 w-4" />
              </Link>
            </p>
          ) : null}
        </article>
      </div>
    </main>
  );
}
