import { csPlayers, csTeams } from "@/data/csBingoDatabase";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

// Resumo do site em Markdown para IAs (padrão llms.txt): o que é, quais jogos existem e onde ficam.
export const dynamic = "force-static";

export function GET() {
  const body = `# ${siteName}

> ${siteDescription} Gratuito, sem cadastro, em português, inglês e espanhol.

${siteName} (${siteUrl}) reúne mini games de Counter-Strike (CS2 e CS:GO) para fãs da cena profissional. Os desafios diários mudam à meia-noite no horário de Brasília (UTC−3) e são iguais para todos os jogadores. A base tem ${csPlayers.length} pro players e ${csTeams.length} times, com dados do Liquipedia (CC BY-SA): times, histórico de carreira, nacionalidade, funções, títulos de Major, MVPs de Major e aparições no Top 20 da HLTV.

## Jogos

- [CS Bingo](${siteUrl}/bingo): desafio diário. Uma cartela 4x4 com critérios como times, nacionalidades, funções e conquistas; 42 jogadores aparecem um por vez e o jogador encaixa cada um numa casa que ele cumpre. Duas vidas, pulo livre, um coringa por partida, uma tentativa por dia.
- [Jogador misterioso](${siteUrl}/jogador-misterioso): desafio diário de adivinhação. Descubra o pro player do dia em até 6 palpites; cada palpite compara time atual, país, região, função, Majors e anos no Top 20 da HLTV com o jogador misterioso.
- [Adivinhe o jogador](${siteUrl}/guess-name): quiz sem limite. Aparece o nick de um pro player e o jogador escolhe o nome real entre 4 opções, com 3 vidas.

## Informações

- [Termos de uso](${siteUrl}/termos)
- [Política de privacidade](${siteUrl}/privacidade): o progresso fica só no navegador; não há cadastro.
- Fonte dos dados: [Liquipedia Counter-Strike](https://liquipedia.net/counterstrike/) (CC BY-SA 3.0).
- Sem afiliação com a Valve. Counter-Strike é marca registrada da Valve Corporation.
`;

  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
