import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { TeamView } from "@/components/pros/TeamView";
import { htmlLang, localizePath } from "@/lib/i18n";
import { getTeam, getTeamPlayers, hasTeamPage, teamSeo, teamsWithPages } from "@/lib/proPages";
import { getPageLanguage, localizedMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

type Props = { params: Promise<{ id: string }> };

export const generateStaticParams = () => teamsWithPages.map((team) => ({ id: team.id }));

const findTeam = (id: string) => (hasTeamPage(id) ? getTeam(id) : undefined);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const team = findTeam((await params).id);
  return team ? localizedMetadata(teamSeo(team), { type: "article" }) : {};
}

export default async function TeamPage({ params }: Props) {
  const team = findTeam((await params).id);
  if (!team) notFound();
  const language = await getPageLanguage();
  const seo = teamSeo(team);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SportsTeam",
          name: team.name,
          sport: "Counter-Strike",
          foundingDate: String(team.founded),
          url: `${siteUrl}${localizePath(seo.path, language)}`,
          inLanguage: htmlLang(language),
          member: getTeamPlayers(team.id).map((player) => ({
            "@type": "Person",
            name: player.fullName,
            alternateName: player.nickname,
            url: `${siteUrl}${localizePath(`/players/${player.id}`, language)}`,
          })),
        }}
      />
      <TeamView id={team.id} />
    </>
  );
}
