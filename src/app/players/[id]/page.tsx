import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { PlayerView } from "@/components/pros/PlayerView";
import { csPlayers, getTeamName } from "@/data/csBingoDatabase";
import { htmlLang, localizePath } from "@/lib/i18n";
import { getPlayer, playerSeo } from "@/lib/proPages";
import { getPageLanguage, localizedMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

type Props = { params: Promise<{ id: string }> };

export const generateStaticParams = () => csPlayers.map((player) => ({ id: player.id }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const player = getPlayer((await params).id);
  return player ? localizedMetadata(playerSeo(player), { type: "article" }) : {};
}

export default async function PlayerPage({ params }: Props) {
  const player = getPlayer((await params).id);
  if (!player) notFound();
  const language = await getPageLanguage();
  const seo = playerSeo(player);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: `${siteUrl}${localizePath(seo.path, language)}`,
          name: seo.title[language],
          inLanguage: htmlLang(language),
          mainEntity: {
            "@type": "Person",
            name: player.fullName,
            alternateName: player.nickname,
            nationality: player.nationality,
            jobTitle: "Counter-Strike professional player",
            ...(player.currentTeam ? { affiliation: { "@type": "SportsTeam", name: getTeamName(player.currentTeam) } } : {}),
            ...(player.liquipediaPage
              ? { sameAs: [`https://liquipedia.net/counterstrike/${encodeURIComponent(player.liquipediaPage.replace(/ /g, "_"))}`] }
              : {}),
          },
        }}
      />
      <PlayerView id={player.id} />
    </>
  );
}
