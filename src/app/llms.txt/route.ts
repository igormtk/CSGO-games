import { csPlayers, csTeams } from "@/data/csBingoDatabase";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

// Resumo do site em Markdown para IAs (padrão llms.txt), no idioma base (inglês).
export const dynamic = "force-static";

export function GET() {
  const body = `# ${siteName}

> ${siteDescription} Free, no sign-up, available in English, Portuguese and Spanish.

${siteName} (${siteUrl}) is a set of Counter-Strike (CS2 and CS:GO) mini games for fans of the pro scene. Daily challenges reset at midnight Brasília time (UTC−3) and are the same for every player. The database covers ${csPlayers.length} pro players and ${csTeams.length} teams, sourced from Liquipedia (CC BY-SA): teams, career history, nationality, roles, Major titles, Major MVPs and HLTV Top 20 appearances.

## Games

- [CS Bingo](${siteUrl}/bingo): daily challenge. A 4x4 board with criteria such as teams, nationalities, roles and achievements; 42 players appear one at a time and the player places each one in a cell they fit. Two lives, free skips, one wildcard per game, one attempt per day.
- [Mystery player](${siteUrl}/jogador-misterioso): daily guessing game. Find the pro player of the day in up to 6 guesses; each guess compares current team, country, region, role, Majors and HLTV Top 20 years with the mystery player.
- [Guess the player](${siteUrl}/guess-name): daily challenge. 20 pro players' nicknames, the same for everyone; the player picks each real name from 4 options within 10 seconds per name, with 3 lives and one attempt per day.

## Information

- [Terms of use](${siteUrl}/termos)
- [Privacy policy](${siteUrl}/privacidade): progress is stored only in the browser; there are no accounts. Visits are counted with cookieless, anonymous Vercel Web Analytics.
- Data source: [Liquipedia Counter-Strike](https://liquipedia.net/counterstrike/) (CC BY-SA 3.0).
- Not affiliated with Valve. Counter-Strike is a registered trademark of Valve Corporation.
`;

  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
