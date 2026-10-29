import type { ReactNode } from "react";
import { csPlayers, getTeamName } from "@/data/csBingoDatabase";
import type { CsPlayer } from "@/data/csBingoDatabase";
import type { Language } from "@/lib/language";

// Páginas de estatísticas (/stats/<slug>) geradas da base do Liquipedia: atualizam sozinhas quando
// scripts/import-players.mjs ou o sync semanal mudam os dados.

type Localized<T> = Record<Language, T>;

export type StatRow = { player: CsPlayer; value: number; detail: string };

export type StatPage = {
  slug: string;
  title: Localized<string>;
  intro: Localized<string>;
  valueLabel: Localized<string>;
  detailLabel: Localized<string>;
  content: Localized<ReactNode>;
  rows: () => StatRow[];
};

const yearsRange = (years: number[]) => (years.length ? `${Math.min(...years)}–${Math.max(...years)}` : "");

const lastTeam = (player: CsPlayer) => getTeamName(player.currentTeam ?? player.teams[player.teams.length - 1] ?? "");

export const statPages: StatPage[] = [
  {
    slug: "most-major-titles",
    title: {
      pt: "Jogadores com mais títulos de Major no CS",
      en: "Players with the most Counter-Strike Major titles",
      es: "Jugadores con más títulos de Major en CS",
    },
    intro: {
      pt: "Quem venceu dois ou mais Majors de Counter-Strike, o torneio mais importante do calendário.",
      en: "Who has won two or more Counter-Strike Majors, the most important tournament on the calendar.",
      es: "Quién ganó dos o más Majors de Counter-Strike, el torneo más importante del calendario.",
    },
    valueLabel: { pt: "Majors", en: "Majors", es: "Majors" },
    detailLabel: { pt: "Time atual ou último", en: "Current or last team", es: "Equipo actual o último" },
    rows: () =>
      csPlayers
        .filter((player) => player.majorsWon >= 2)
        .sort((a, b) => b.majorsWon - a.majorsWon || b.hltvTop20Years.length - a.hltvTop20Years.length)
        .map((player) => ({ player, value: player.majorsWon, detail: lastTeam(player) })),
    content: {
      pt: (
        <p>
          Os Majors são os campeonatos patrocinados pela Valve e valem mais do que qualquer outro título no CS. A geração
          dinamarquesa da Astralis domina a lista: o grupo venceu quatro Majors entre 2017 e 2019, e o dupreeh ainda somou um
          quinto com a Vitality em 2023. Desempate pela quantidade de anos no Top 20 da HLTV.
        </p>
      ),
      en: (
        <p>
          Majors are the Valve-sponsored championships and outweigh any other title in CS. The Danish Astralis generation
          dominates the list: the group won four Majors between 2017 and 2019, and dupreeh added a fifth with Vitality in 2023.
          Ties are broken by number of years in HLTV&apos;s Top 20.
        </p>
      ),
      es: (
        <p>
          Los Majors son los campeonatos patrocinados por Valve y valen más que cualquier otro título en CS. La generación danesa
          de Astralis domina la lista: el grupo ganó cuatro Majors entre 2017 y 2019, y dupreeh sumó un quinto con Vitality en
          2023. Los empates se deciden por los años en el Top 20 de HLTV.
        </p>
      ),
    },
  },
  {
    slug: "hltv-top-20-appearances",
    title: {
      pt: "Jogadores com mais aparições no Top 20 da HLTV",
      en: "Players with the most HLTV Top 20 appearances",
      es: "Jugadores con más apariciones en el Top 20 de HLTV",
    },
    intro: {
      pt: "O ranking anual da HLTV elege os 20 melhores jogadores do ano. Estes são os que mais vezes entraram na lista.",
      en: "HLTV's yearly ranking names the 20 best players of the year. These are the ones who made the list most often.",
      es: "El ranking anual de HLTV elige a los 20 mejores jugadores del año. Estos son los que más veces entraron en la lista.",
    },
    valueLabel: { pt: "Anos no Top 20", en: "Top 20 years", es: "Años en el Top 20" },
    detailLabel: { pt: "Período", en: "Span", es: "Período" },
    rows: () =>
      csPlayers
        .filter((player) => player.hltvTop20Years.length >= 5)
        .sort((a, b) => b.hltvTop20Years.length - a.hltvTop20Years.length || b.majorsWon - a.majorsWon)
        .map((player) => ({ player, value: player.hltvTop20Years.length, detail: yearsRange(player.hltvTop20Years) })),
    content: {
      pt: (
        <p>
          Entrar no Top 20 uma vez já é marca de elite; repetir por vários anos exige constância rara. A lista mostra quem
          apareceu em cinco temporadas ou mais. O NiKo lidera com dez anos seguidos, de 2016 a 2025, mesmo tendo um único título
          de Major: prova de que o ranking mede regularidade, não só troféus.
        </p>
      ),
      en: (
        <p>
          Making the Top 20 once is already an elite mark; repeating it for years takes rare consistency. The list shows who
          appeared in five seasons or more. NiKo leads with ten straight years, from 2016 to 2025, despite a single Major title:
          proof that the ranking rewards consistency, not just trophies.
        </p>
      ),
      es: (
        <p>
          Entrar en el Top 20 una vez ya es una marca de élite; repetirlo durante años exige una constancia poco común. La lista
          muestra a quienes aparecieron en cinco temporadas o más. NiKo lidera con diez años seguidos, de 2016 a 2025, pese a un
          único título de Major: prueba de que el ranking premia la regularidad, no solo los trofeos.
        </p>
      ),
    },
  },
  {
    slug: "major-mvps",
    title: {
      pt: "Todos os MVPs de Major do CS na nossa base",
      en: "Every Counter-Strike Major MVP in our database",
      es: "Todos los MVP de Major de CS en nuestra base",
    },
    intro: {
      pt: "Os jogadores eleitos melhor jogador de pelo menos um Major, com quantos Majors cada um venceu.",
      en: "The players named best player of at least one Major, with how many Majors each has won.",
      es: "Los jugadores elegidos mejor jugador de al menos un Major, con cuántos Majors ganó cada uno.",
    },
    valueLabel: { pt: "Majors vencidos", en: "Majors won", es: "Majors ganados" },
    detailLabel: { pt: "Time atual ou último", en: "Current or last team", es: "Equipo actual o último" },
    rows: () =>
      csPlayers
        .filter((player) => player.majorMvp)
        .sort((a, b) => b.majorsWon - a.majorsWon || a.nickname.localeCompare(b.nickname))
        .map((player) => ({ player, value: player.majorsWon, detail: lastTeam(player) })),
    content: {
      pt: (
        <p>
          O prêmio de MVP do Major vai para o jogador de maior destaque do campeonato, quase sempre alguém do time campeão:
          todos os MVPs da nossa base também levantaram ao menos um troféu de Major. A seleção mistura lendas do CS:GO, como kennyS, olofmeister e coldzera, com
          nomes da era CS2, como donk e m0NESY.
        </p>
      ),
      en: (
        <p>
          The Major MVP award goes to the standout player of the championship, almost always someone from the winning team:
          every MVP in our database has also lifted at least one Major trophy. The selection mixes CS:GO legends like kennyS, olofmeister and
          coldzera with CS2-era names like donk and m0NESY.
        </p>
      ),
      es: (
        <p>
          El premio MVP del Major va para el jugador más destacado del campeonato, casi siempre alguien del equipo campeón:
          todos los MVP de nuestra base también levantaron al menos un trofeo de Major. La selección mezcla leyendas de CS:GO, como kennyS, olofmeister y coldzera, con
          nombres de la era CS2, como donk y m0NESY.
        </p>
      ),
    },
  },
];

export const getStatPage = (slug: string) => statPages.find((page) => page.slug === slug);
