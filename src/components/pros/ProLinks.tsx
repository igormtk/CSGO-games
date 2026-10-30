"use client";

import type { ReactNode } from "react";
import Link from "@/components/LocalLink";
import { TeamBadge } from "@/components/teams/TeamBadge";
import { getTeamName } from "@/data/csBingoDatabase";
import type { CsPlayer } from "@/data/csBingoDatabase";
import { getCountryFlag } from "@/data/countryFlags";
import { hasTeamPage } from "@/lib/proPages";

// Nome do time com logo; vira link quando o time tem página.
export function TeamLink({ teamId, badge = true }: { teamId: string; badge?: boolean }) {
  const label = (
    <>
      {badge ? <TeamBadge teamId={teamId} className="h-5 w-5" size={40} /> : null}
      {getTeamName(teamId)}
    </>
  );
  return hasTeamPage(teamId) ? (
    <Link href={`/teams/${teamId}`} className="inline-flex items-center gap-1.5">
      {label}
    </Link>
  ) : (
    <span className="inline-flex items-center gap-1.5">{label}</span>
  );
}

// Linha "rótulo: valor" das fichas de jogador e time.
export function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col border-b border-cs-line/60 pb-1.5">
      <dt className="text-[11px] font-bold uppercase tracking-wider text-cs-text/45">{label}</dt>
      <dd className="font-bold text-cs-text [&_a]:!no-underline">{children}</dd>
    </div>
  );
}

export function PlayerLink({ player }: { player: CsPlayer }) {
  return (
    <Link href={`/players/${player.id}`} className="font-bold">
      {getCountryFlag(player.nationality)} {player.nickname}
    </Link>
  );
}
