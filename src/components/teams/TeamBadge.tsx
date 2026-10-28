import Image from "next/image";
import { getTeamName } from "@/data/csBingoDatabase";
import { getTeamLogo } from "@/data/teamLogos";

type TeamBadgeProps = {
  teamId: string;
  className?: string;
  // Tamanho em px usado pelo next/image para escolher a resolução.
  size?: number;
};

// Logo do time, ou um selo com as iniciais quando não temos a logo.
export function TeamBadge({ teamId, className = "h-6 w-6", size = 48 }: TeamBadgeProps) {
  const name = getTeamName(teamId);
  const logo = getTeamLogo(teamId);

  if (!logo) {
    const initials = name
      .split(/\s+/)
      .filter((word) => !/^(team|the|esports|clan)$/i.test(word))
      .map((word) => word[0])
      .join("")
      .slice(0, 3)
      .toUpperCase();
    return (
      <span
        title={name}
        className={`inline-grid shrink-0 place-items-center bg-cs-raised text-[10px] font-bold leading-none text-cs-blue ${className}`}
      >
        {initials || name.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <span title={name} className={`relative inline-block shrink-0 ${className}`}>
      <Image src={logo} alt={name} fill sizes={`${size}px`} className="object-contain" />
    </span>
  );
}
