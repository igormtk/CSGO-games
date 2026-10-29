import { Activity, Crosshair, Globe2, Trophy } from "lucide-react";
import type { BingoCriterion } from "@/data/csBingoDatabase";
import { countryFlags } from "@/data/countryFlags";
import { TeamBadge } from "@/components/teams/TeamBadge";

// Ícone de cada critério nas casas da cartela: bandeira, logo do time ou ícone do tipo.
export function CriterionIcon({ criterion }: { criterion: BingoCriterion }) {
  if (criterion.type === "nationality") {
    return (
      <span className="block text-[length:clamp(14px,4.5cqmin,26px)] leading-none">
        {countryFlags[String(criterion.value)] ?? "🏳️"}
      </span>
    );
  }

  const iconClass = "h-[clamp(14px,4cqmin,22px)] w-[clamp(14px,4cqmin,22px)]";
  switch (criterion.type) {
    case "team":
      return (
        <TeamBadge
          teamId={String(criterion.value)}
          className="h-[clamp(16px,5cqmin,28px)] w-[clamp(20px,6.5cqmin,36px)]"
          size={72}
        />
      );
    case "region":
      return <Globe2 className={`${iconClass} text-cs-blue`} />;
    case "role":
      return <Crosshair className={`${iconClass} text-cs-red`} />;
    case "achievement":
      return <Trophy className={`${iconClass} text-cs-gold`} />;
    default:
      return <Activity className={`${iconClass} text-cs-green`} />;
  }
}
