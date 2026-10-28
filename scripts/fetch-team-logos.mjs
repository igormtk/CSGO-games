// Baixa as logos dos times do Liquipedia para public/teams/{id}.{ext}.
// Usa o ícone do template TeamIcon (só o símbolo, sem o nome escrito) na versão para fundo
// escuro, que combina com o site. O nome do time já aparece no nosso rótulo.
//
// Uso:
//   node --experimental-strip-types scripts/fetch-team-logos.mjs           só as que faltam
//   node --experimental-strip-types scripts/fetch-team-logos.mjs --force   todas de novo
//
// Os times vêm de src/data/generated/liquipedia.ts (scripts/import-players.mjs). No fim, grava em
// src/data/generated/teamLogos.ts o arquivo de cada time com logo; os outros mostram as iniciais.
// As logos são marcas dos times: usamos só para identificar o time (ver /termos).

import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { generatedTeams } from "../src/data/generated/liquipedia.ts";
import { extname, join } from "node:path";

const API_URL = "https://liquipedia.net/counterstrike/api.php";
const CONTACT = process.env.LIQUIPEDIA_CONTACT || "https://github.com/igormtk/CSGO-games";
const USER_AGENT = `CSGamesBingo/1.0 (${CONTACT})`;
const DELAY_BETWEEN_REQUESTS_MS = 2500;
const OUTPUT_DIR = "public/teams";

const PAGE_BY_TEAM = Object.fromEntries(generatedTeams.map((team) => [team.id, team.liquipediaPage ?? team.name]));

const force = process.argv.includes("--force");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const api = async (params) => {
  const response = await fetch(`${API_URL}?${new URLSearchParams({ format: "json", formatversion: "2", ...params })}`, {
    headers: { "User-Agent": USER_AGENT, "Accept-Encoding": "gzip" },
  });
  if (!response.ok) throw new Error(`Liquipedia: ${response.status} ${await response.text()}`);
  return response.json();
};

const BASE_URL = "https://liquipedia.net";

// TeamIcon gera uma imagem para o tema claro e outra para o escuro; ficamos com a escura.
// As URLs vêm como miniatura (/thumb/.../41px-arquivo.png): tirar o /thumb dá o original.
const readIconUrl = (html) => {
  const sources = [...html.matchAll(/src="([^"]+)"/g)].map((match) => match[1]);
  const source = sources.find((src) => /darkmode/i.test(src)) ?? sources.at(-1);
  if (!source) return undefined;
  return BASE_URL + source.replace("/thumb/", "/").replace(/\/[^/]+$/, "");
};

const existingLogo = (teamId) => readdirSync(OUTPUT_DIR).find((file) => file.replace(extname(file), "") === teamId);

const LOGO_LIST_FILE = "src/data/generated/teamLogos.ts";

const writeLogoList = () => {
  // A extensão vem do arquivo original no Liquipedia (png na maioria, às vezes svg).
  const files = Object.fromEntries(
    Object.keys(PAGE_BY_TEAM)
      .map((teamId) => [teamId, existingLogo(teamId)])
      .filter(([, file]) => file)
  );
  writeFileSync(
    LOGO_LIST_FILE,
    [
      "// Gerado por scripts/fetch-team-logos.mjs: arquivo da logo de cada time em public/teams.",
      `export const teamLogoFiles: Record<string, string> = ${JSON.stringify(files, null, 2)};`,
      "",
    ].join("\n")
  );
  console.log(`${Object.keys(files).length} de ${Object.keys(PAGE_BY_TEAM).length} times com logo (${LOGO_LIST_FILE})`);
};

const main = async () => {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const pending = Object.entries(PAGE_BY_TEAM).filter(([teamId]) => force || !existingLogo(teamId));
  if (pending.length === 0) {
    console.log("Todas as logos já existem. Use --force para baixar de novo.");
    writeLogoList();
    return;
  }

  // Uma chamada só: cada ícone vem separado por um marcador com o id do time.
  const { parse } = await api({
    action: "parse",
    prop: "text",
    contentmodel: "wikitext",
    text: pending.map(([teamId, page]) => `@@${teamId}@@ {{TeamIcon|${page}}}`).join("\n"),
  });
  const parts = parse.text.split(/@@([^@]+)@@/);
  const urlByTeam = new Map();
  for (let index = 1; index < parts.length; index += 2) {
    const url = readIconUrl(parts[index + 1]);
    if (url) urlByTeam.set(parts[index], url);
    else console.warn(`! ${parts[index]}: TeamIcon sem imagem para "${PAGE_BY_TEAM[parts[index]]}"`);
  }

  for (const [teamId, url] of urlByTeam) {
    await sleep(DELAY_BETWEEN_REQUESTS_MS);
    const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!response.ok) {
      console.warn(`! ${teamId}: download falhou (${response.status})`);
      continue;
    }
    const outputPath = join(OUTPUT_DIR, `${teamId}${extname(new URL(url).pathname).toLowerCase()}`);
    writeFileSync(outputPath, Buffer.from(await response.arrayBuffer()));
    console.log(`✓ ${teamId} → /${outputPath.replace(/^public\//, "")}`);
  }
  writeLogoList();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
