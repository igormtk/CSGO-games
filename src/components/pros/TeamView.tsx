"use client";

import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { ArticlePage } from "@/components/content/ArticlePage";
import { TeamBadge } from "@/components/teams/TeamBadge";
import { getCountryFlag, getCountryName } from "@/data/countryFlags";
import { useLanguage } from "@/lib/language";
import { getTeam, getTeamPlayers, teamSeo } from "@/lib/proPages";
import { Fact, PlayerLink } from "./ProLinks";
import { crumbs, proCopy } from "./proCopy";

export function TeamView({ id }: { id: string }) {
  const language = useLanguage();
  const team = getTeam(id);
  if (!team) return null;
  const copy = proCopy[language];
  const seo = teamSeo(team);
  const players = getTeamPlayers(team.id);
  const roster = players.filter((player) => player.currentTeam === team.id);

  const body: ReactNode = (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span className="grid h-20 w-20 shrink-0 place-items-center bg-cs-bg">
          <TeamBadge teamId={team.id} className="h-16 w-16" size={128} />
        </span>
        <dl className="grid flex-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          <Fact label={copy.country}>
            {getCountryFlag(team.country)} {getCountryName(team.country, language)}
          </Fact>
          <Fact label={copy.founded}>{team.founded}</Fact>
          <Fact label={copy.region}>{team.region}</Fact>
          <Fact label={copy.status}>{team.status === "active" ? copy.teamActive : copy.teamInactive}</Fact>
        </dl>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: copy.playersCount, value: players.length },
          { label: copy.majorWinners, value: players.filter((player) => player.majorsWon > 0).length },
          { label: copy.mvps, value: players.filter((player) => player.majorMvp).length },
        ].map((stat) => (
          <div key={stat.label} className="cs-cut-sm bg-cs-panel p-3">
            <p className="text-[11px] font-bold uppercase leading-tight tracking-wider text-cs-text/45">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold leading-none text-cs-orange">{stat.value}</p>
          </div>
        ))}
      </div>

      <h2>{copy.roster}</h2>
      {roster.length ? (
        <ul className="flex flex-wrap gap-2 !ml-0">
          {roster.map((player) => (
            <li key={player.id} className="cs-cut-sm !ml-0 list-none bg-cs-raised px-3 py-1.5 [&_a]:!no-underline">
              <PlayerLink player={player} />
            </li>
          ))}
        </ul>
      ) : (
        <p>{copy.noRoster}</p>
      )}

      <h2>{copy.allPlayers}</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="border-b-2 border-cs-line text-xs uppercase tracking-wider text-cs-text/50">
            <tr>
              <th className="py-2 pr-2">{copy.player}</th>
              <th className="hidden py-2 pr-2 sm:table-cell">{copy.roles}</th>
              <th className="py-2 pr-2 text-right">Majors</th>
              <th className="py-2 text-right">Top 20</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id} className="border-b border-cs-line/50">
                <td className="py-2 pr-2">
                  <PlayerLink player={player} />
                  <span className="block text-xs text-cs-text/50">{player.fullName}</span>
                </td>
                <td className="hidden py-2 pr-2 sm:table-cell">{player.roles.join(", ")}</td>
                <td className="py-2 pr-2 text-right font-bold text-cs-orange">{player.majorsWon}</td>
                <td className="py-2 text-right font-bold">{player.hltvTop20Years.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="flex flex-wrap items-center gap-x-3 text-sm text-cs-text/50">
        {copy.source}
        {team.liquipediaPage ? (
          <a
            href={`https://liquipedia.net/counterstrike/${encodeURIComponent(team.liquipediaPage.replace(/ /g, "_"))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1"
          >
            {copy.liquipedia} <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : null}
      </p>
    </>
  );

  return (
    <ArticlePage
      title={seo.title}
      intro={seo.description}
      content={{ pt: body, en: body, es: body }}
      crumb={crumbs.teams}
      cta={{ href: "/lineup", label: { pt: proCopy.pt.playLineup, en: proCopy.en.playLineup, es: proCopy.es.playLineup } }}
    />
  );
}
