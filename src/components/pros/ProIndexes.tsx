"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import Link from "@/components/LocalLink";
import { ArticlePage } from "@/components/content/ArticlePage";
import { TeamBadge } from "@/components/teams/TeamBadge";
import { getCountryFlag } from "@/data/countryFlags";
import { getTeamName } from "@/data/csBingoDatabase";
import { useLanguage } from "@/lib/language";
import { getTeamPlayers, playersByName, playersIndexSeo, teamsIndexSeo, teamsWithPages } from "@/lib/proPages";
import { proCopy } from "./proCopy";

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

// Todos os jogadores com link; a busca só filtra na tela (o HTML do servidor traz a lista inteira).
export function PlayersIndex() {
  const language = useLanguage();
  const copy = proCopy[language];
  const [query, setQuery] = useState("");
  const search = normalize(query.trim());
  const players = search
    ? playersByName.filter((player) => normalize(`${player.nickname} ${player.fullName}`).includes(search))
    : playersByName;

  const body: ReactNode = (
    <>
      <label className="cs-cut-sm flex items-center gap-2 border-2 border-cs-line bg-cs-panel px-3 focus-within:border-cs-orange">
        <Search className="h-5 w-5 shrink-0 text-cs-text/40" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={copy.search}
          aria-label={copy.search}
          className="w-full bg-transparent py-2.5 font-bold outline-none placeholder:text-cs-text/35"
        />
      </label>
      <ul className="grid gap-x-4 gap-y-1 !ml-0 sm:grid-cols-2">
        {players.map((player) => (
          <li key={player.id} className="!ml-0 list-none">
            <Link href={`/players/${player.id}`} className="font-bold">
              {getCountryFlag(player.nationality)} {player.nickname}
            </Link>{" "}
            <span className="text-sm text-cs-text/50">· {player.currentTeam ? getTeamName(player.currentTeam) : copy.noTeam}</span>
          </li>
        ))}
      </ul>
    </>
  );

  return <ArticlePage title={playersIndexSeo.title} intro={playersIndexSeo.description} content={{ pt: body, en: body, es: body }} />;
}

export function TeamsIndex() {
  const language = useLanguage();
  const copy = proCopy[language];
  const teams = [...teamsWithPages].sort((a, b) => getTeamPlayers(b.id).length - getTeamPlayers(a.id).length);

  const body: ReactNode = (
    <ul className="grid gap-2 !ml-0 sm:grid-cols-2">
      {teams.map((team) => (
        <li key={team.id} className="!ml-0 list-none">
          <Link
            href={`/teams/${team.id}`}
            className="cs-cut-sm flex items-center gap-3 bg-cs-panel px-3 py-2 !no-underline transition hover:bg-cs-raised"
          >
            <TeamBadge teamId={team.id} className="h-8 w-8" size={64} />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-bold uppercase tracking-wide text-cs-text">{team.name}</span>
              <span className="block text-sm text-cs-text/50">
                {getCountryFlag(team.country)} {copy.playersCountLabel(getTeamPlayers(team.id).length)}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );

  return <ArticlePage title={teamsIndexSeo.title} intro={teamsIndexSeo.description} content={{ pt: body, en: body, es: body }} />;
}
