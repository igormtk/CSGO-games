"use client";

import { ArrowRight, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { ArticlePage } from "@/components/content/ArticlePage";
import { getCountryFlag, getCountryName } from "@/data/countryFlags";
import { getTeamName } from "@/data/csBingoDatabase";
import { useLanguage } from "@/lib/language";
import { getPlayer, getTeammates, playerSeo } from "@/lib/proPages";
import { Fact, PlayerLink, TeamLink } from "./ProLinks";
import { crumbs, proCopy } from "./proCopy";

export function PlayerView({ id }: { id: string }) {
  const language = useLanguage();
  const player = getPlayer(id);
  if (!player) return null;
  const copy = proCopy[language];
  const seo = playerSeo(player);
  const teammates = getTeammates(player);

  const body: ReactNode = (
    <>
      <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
        <Fact label={copy.fullName}>{player.fullName}</Fact>
        <Fact label={copy.country}>
          {getCountryFlag(player.nationality)} {getCountryName(player.nationality, language)}
        </Fact>
        <Fact label={copy.roles}>{player.roles.join(", ")}</Fact>
        <Fact label={copy.currentTeam}>{player.currentTeam ? <TeamLink teamId={player.currentTeam} /> : copy.noTeam}</Fact>
        <Fact label={copy.status}>{player.active ? copy.active : copy.inactive}</Fact>
      </dl>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: copy.majors, value: player.majorsWon },
          { label: copy.mvp, value: player.majorMvp ? copy.yes : copy.no },
          { label: copy.top20, value: player.hltvTop20Years.length },
        ].map((stat) => (
          <div key={stat.label} className="cs-cut-sm bg-cs-panel p-3">
            <p className="text-[11px] font-bold uppercase leading-tight tracking-wider text-cs-text/45">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold leading-none text-cs-orange">{stat.value}</p>
          </div>
        ))}
      </div>
      {player.hltvTop20Years.length ? (
        <p className="text-sm">
          {copy.top20}: {[...player.hltvTop20Years].sort().join(", ")}
        </p>
      ) : null}

      <h2>{copy.career}</h2>
      <ol className="flex flex-wrap items-center gap-2 !ml-0">
        {player.teams.map((teamId, index) => (
          <li key={teamId} className="!ml-0 flex list-none items-center gap-2">
            <span className="cs-cut-sm flex items-center gap-2 bg-cs-raised px-3 py-2 text-sm font-bold uppercase tracking-wide [&_a]:!no-underline">
              <span className="text-cs-text/40">{index + 1}</span>
              <TeamLink teamId={teamId} />
            </span>
            {index < player.teams.length - 1 ? <ArrowRight className="h-4 w-4 shrink-0 text-cs-text/30" aria-hidden /> : null}
          </li>
        ))}
      </ol>

      {teammates.length ? (
        <>
          <h2>{copy.teammates}</h2>
          <p>{copy.teammatesIntro}</p>
          <ul className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
            {teammates.map(({ player: mate, shared }) => (
              <li key={mate.id}>
                <PlayerLink player={mate} />{" "}
                <span className="text-sm text-cs-text/50">({shared.map(getTeamName).join(", ")})</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <p className="flex flex-wrap items-center gap-x-3 text-sm text-cs-text/50">
        {copy.source}
        {player.liquipediaPage ? (
          <a
            href={`https://liquipedia.net/counterstrike/${encodeURIComponent(player.liquipediaPage.replace(/ /g, "_"))}`}
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
      crumb={crumbs.players}
      cta={{ href: "/career-path", label: { pt: proCopy.pt.playCareer, en: proCopy.en.playCareer, es: proCopy.es.playCareer } }}
    />
  );
}
