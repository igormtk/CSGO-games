"use client";

import type { ReactNode } from "react";
import Link from "@/components/LocalLink";
import { getStatPage } from "@/data/articles/stats";
import type { StatPage } from "@/data/articles/stats";
import { useLanguage } from "@/lib/language";
import type { Language } from "@/lib/language";
import { ArticlePage } from "./ArticlePage";

const tableCopy: Record<Language, { player: string; country: string; source: string; cta: string }> = {
  pt: {
    player: "Jogador",
    country: "País",
    source: "Dados do Liquipedia (CC BY-SA), sobre os pro players da base do CS Games; atualizados toda semana.",
    cta: "Teste o que você sabe no CS Bingo",
  },
  en: {
    player: "Player",
    country: "Country",
    source: "Data from Liquipedia (CC BY-SA), covering the pro players in the CS Games database; updated weekly.",
    cta: "Test what you know in CS Bingo",
  },
  es: {
    player: "Jugador",
    country: "País",
    source: "Datos de Liquipedia (CC BY-SA), sobre los pro players de la base de CS Games; actualizados cada semana.",
    cta: "Pon a prueba lo que sabes en CS Bingo",
  },
};

function StatTable({ page }: { page: StatPage }) {
  const language = useLanguage();
  const copy = tableCopy[language];
  const rows = page.rows();

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="border-b-2 border-cs-line text-xs uppercase tracking-wider text-cs-text/50">
            <tr>
              <th className="py-2 pr-2">#</th>
              <th className="py-2 pr-2">{copy.player}</th>
              <th className="py-2 pr-2">{copy.country}</th>
              <th className="py-2 pr-2 text-right">{page.valueLabel[language]}</th>
              <th className="hidden py-2 sm:table-cell">{page.detailLabel[language]}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.player.id} className="border-b border-cs-line/50">
                <td className="py-2 pr-2 text-cs-text/45">{index + 1}</td>
                <td className="py-2 pr-2">
                  <Link href={`/players/${row.player.id}`} className="font-bold">
                    {row.player.nickname}
                  </Link>
                  <span className="block text-xs text-cs-text/50">{row.player.fullName}</span>
                </td>
                <td className="py-2 pr-2">{row.player.nationality}</td>
                <td className="py-2 pr-2 text-right text-lg font-bold text-cs-orange">{row.value}</td>
                <td className="hidden py-2 sm:table-cell">{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-cs-text/50">{copy.source}</p>
    </>
  );
}

export function StatView({ slug }: { slug: string }) {
  const page = getStatPage(slug);
  if (!page) return null;
  const content = Object.fromEntries(
    (Object.keys(page.content) as Language[]).map((language) => [
      language,
      <>
        {page.content[language]}
        <StatTable page={page} />
      </>,
    ])
  ) as Record<Language, ReactNode>;
  const cta = { href: "/bingo", label: { pt: tableCopy.pt.cta, en: tableCopy.en.cta, es: tableCopy.es.cta } };

  return <ArticlePage title={page.title} intro={page.intro} content={content} cta={cta} />;
}
