import { statPages } from "@/data/articles/stats";
import { strategyGuides } from "@/data/articles/strategyGuides";
import { csPlayers, csTeams } from "@/data/csBingoDatabase";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

// Resumo do site em Markdown para IAs (padrão llms.txt), no idioma base (inglês).
export const dynamic = "force-static";

export function GET() {
  const body = `# ${siteName}

> ${siteDescription} Free, no sign-up, available in English, Portuguese and Spanish.

${siteName} (${siteUrl}) is a set of Counter-Strike (CS2 and CS:GO) mini games for fans of the pro scene. Daily challenges reset at midnight Brasília time (UTC−3) and are the same for every player. The database covers ${csPlayers.length} pro players and ${csTeams.length} teams, sourced from Liquipedia (CC BY-SA): teams, career history, nationality, roles, Major titles, Major MVPs and HLTV Top 20 appearances.

## Games

- [CS Bingo](${siteUrl}/bingo): daily challenge. A 4x4 board with criteria such as teams, nationalities, roles and achievements; 42 players appear one at a time and the player places each one in a cell they fit. Two lives, free skips, one wildcard per game, one attempt per day. Before starting, the player picks Classic (no timer) or Against the clock (10 seconds per name; when time runs out the name passes).
- [CS Bingo multiplayer](${siteUrl}/bingo/multiplayer): play CS Bingo with friends. One player creates a room and shares its code; everyone gets the same board and names and races in real time, with a live scoreboard. Most points wins; ties go to whoever finished first. The room creator picks Classic or Against the clock (10 seconds per name) before creating the room.
- [Mystery player](${siteUrl}/jogador-misterioso): daily guessing game. Find the pro player of the day in up to 6 guesses; each guess compares current team, country, region, role, Majors and HLTV Top 20 years with the mystery player.
- [Career path](${siteUrl}/career-path): daily guessing game. The teams a pro player has played for are shown in order, starting with 2 revealed; each miss reveals the next team, then the country and the role. 6 guesses.
- [Guess the player](${siteUrl}/guess-name): daily challenge. 20 pro players' nicknames, the same for everyone; the player picks each real name from 4 options within 10 seconds per name, with 3 lives and one attempt per day.
- [Lineup](${siteUrl}/lineup): daily challenge. One team a day, the same for everyone; the player names 5 pro players who have played for it (any era, main career teams per Liquipedia), with 3 misses allowed. At the end, every player in the database who played for the team is shown.
- [Higher or lower](${siteUrl}/higher-or-lower): endless game, no daily limit. Two pro players are shown; the top one reveals a number (Major titles, HLTV Top 20 years or career teams) and the player says whether the bottom one has more or less. There are no ties. Each right answer extends the streak; one miss ends the run.
- [Challenge archive](${siteUrl}/archive): every past daily challenge of CS Bingo, Mystery player, Career path, Guess the player and Lineup since January 2026, playable at any time (add ?date=YYYY-MM-DD to a daily game's URL). Archive games don't count toward the daily streak.

## Guides and stats

${strategyGuides.map((guide) => `- [${guide.title.en}](${siteUrl}/guides/${guide.slug}): ${guide.intro.en}`).join("\n")}
${statPages.map((page) => `- [${page.title.en}](${siteUrl}/stats/${page.slug}): ${page.intro.en}`).join("\n")}

## Information

- [About](${siteUrl}/about): who makes CS Games, data sources and how the daily challenges work.

- [Terms of use](${siteUrl}/termos)
- [Privacy policy](${siteUrl}/privacidade): progress is stored only in the browser; there are no accounts. Visits are counted with cookieless, anonymous Vercel Web Analytics.
- Data source: [Liquipedia Counter-Strike](https://liquipedia.net/counterstrike/) (CC BY-SA 3.0).
- Not affiliated with Valve. Counter-Strike is a registered trademark of Valve Corporation.
`;

  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
