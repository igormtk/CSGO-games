"use client";

import Link from "next/link";
import { BarChart3, BookOpen } from "lucide-react";
import { statPages } from "@/data/articles/stats";
import { strategyGuides } from "@/data/articles/strategyGuides";
import { useDocumentTitle, useLanguage } from "@/lib/language";
import type { Language } from "@/lib/language";

const hubCopy: Record<Language, { title: string; intro: string; guides: string; stats: string; about: string; aboutText: string }> = {
  pt: {
    title: "Guias e estatísticas",
    intro: "Dicas para cada jogo do CS Games e listas da cena profissional de Counter-Strike, montadas a partir da nossa base de dados.",
    guides: "Guias de estratégia",
    stats: "Estatísticas da cena",
    about: "Sobre o CS Games",
    aboutText: "Quem faz o site, de onde vêm os dados e como os desafios diários são montados.",
  },
  en: {
    title: "Guides and stats",
    intro: "Tips for every CS Games game and lists from the Counter-Strike pro scene, built from our database.",
    guides: "Strategy guides",
    stats: "Scene stats",
    about: "About CS Games",
    aboutText: "Who makes the site, where the data comes from and how the daily challenges are built.",
  },
  es: {
    title: "Guías y estadísticas",
    intro: "Consejos para cada juego de CS Games y listas de la escena profesional de Counter-Strike, armadas con nuestra base de datos.",
    guides: "Guías de estrategia",
    stats: "Estadísticas de la escena",
    about: "Acerca de CS Games",
    aboutText: "Quién hace el sitio, de dónde salen los datos y cómo se arman los desafíos diarios.",
  },
};

function HubCard({ href, title, text }: { href: string; title: string; text: string }) {
  return (
    <li>
      <Link href={href} className="cs-cut-sm block h-full bg-cs-panel px-4 py-3 transition hover:bg-cs-raised">
        <span className="block text-lg font-bold uppercase leading-tight tracking-wide text-cs-text">{title}</span>
        <span className="mt-1 block text-sm font-semibold leading-5 text-cs-text/60">{text}</span>
      </Link>
    </li>
  );
}

export function GuidesHub() {
  const language = useLanguage();
  const copy = hubCopy[language];
  useDocumentTitle(`${copy.title} · CS Games`);

  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 px-4 py-6 sm:py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold uppercase tracking-wide sm:text-4xl">{copy.title}</h1>
        <p className="text-lg font-semibold text-cs-text/65">{copy.intro}</p>
      </header>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-xl font-bold uppercase tracking-wider text-cs-orange">
          <BookOpen className="h-5 w-5" /> {copy.guides}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {strategyGuides.map((guide) => (
            <HubCard key={guide.slug} href={`/guides/${guide.slug}`} title={guide.title[language]} text={guide.intro[language]} />
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-xl font-bold uppercase tracking-wider text-cs-orange">
          <BarChart3 className="h-5 w-5" /> {copy.stats}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {statPages.map((page) => (
            <HubCard key={page.slug} href={`/stats/${page.slug}`} title={page.title[language]} text={page.intro[language]} />
          ))}
        </ul>
      </section>

      <ul>
        <HubCard href="/about" title={copy.about} text={copy.aboutText} />
      </ul>
    </main>
  );
}
