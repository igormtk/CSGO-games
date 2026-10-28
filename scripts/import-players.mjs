// Monta a base de jogadores e times a partir do Liquipedia e grava src/data/generated/liquipedia.ts.
//
// Uso:
//   npm run data:import   (ou npm run data:update para importar, baixar logos e gerar o seed)
//
// Quem entra na base: todo jogador que já apareceu no Top 20 da HLTV, todo campeão de Major,
// todo MVP de Major, a lista fixa CURATED_PLAYERS e o elenco atual dos times principais (os de
// CORE_TEAMS e os ativos com pelo menos MIN_PLAYERS_PER_TEAM desses jogadores no histórico).
// As listas são fixas para o resultado não crescer a cada execução.
// Times: os principais, os do histórico de MIN_PLAYERS_PER_TEAM jogadores e o atual de cada ativo.
// Ids existentes são mantidos (partidas salvas no navegador guardam ids).
// Depois de rodar: npm run data:logos e npm run data:seed.
// Dados do Liquipedia são CC-BY-SA 3.0: o site precisa creditar a fonte.

import { mkdirSync, writeFileSync } from "node:fs";

const API_URL = "https://liquipedia.net/counterstrike/api.php";
const CONTACT = process.env.LIQUIPEDIA_CONTACT || "https://github.com/igormtk/CSGO-games";
const USER_AGENT = `CSGamesBingo/1.0 (${CONTACT})`;
const TITLES_PER_REQUEST = 50;
const DELAY_BETWEEN_REQUESTS_MS = 2500;
const MIN_PLAYERS_PER_TEAM = 6;
const OUTPUT_FILE = "src/data/generated/liquipedia.ts";

// A base original, escolhida à mão: entra mesmo sem Top 20 ou Major.
const CURATED_PLAYERS = [
  "S1mple", "ZywOo", "Dev1ce", "Dupreeh", "NiKo", "Coldzera", "FalleN", "KSCERATO", "Twistzz", "Ropz", "Karrigan",
  "Rain", "KennyS", "Olofmeister", "Flusha", "Shroud", "Stewie2K", "EliGE", "Donk", "Sh1ro", "Magixx", "Zont1x",
  "M0NESY", "Kyousuke", "TeSeS", "Molodoy", "YEKINDAR", "Yuurih", "ApEX", "FlameZ", "Mezii", "Spinx", "Torzsi",
  "XertioN", "Frozen", "B1t", "IM", "W0nderful", "Aleksib", "JL", "Senzu", "BLitz",
];

// Times que o site destaca: o elenco atual sempre entra.
const CORE_TEAMS = [
  "Natus Vincere", "Astralis", "FaZe Clan", "G2 Esports", "Team Vitality", "Team Liquid", "FURIA", "Fnatic", "MIBR",
  "Cloud9", "Team Spirit", "MOUZ", "Team Falcons", "The MongolZ", "Ninjas in Pyjamas", "BC.Game Esports",
  "100 Thieves", "Without a Roof",
];

const REGION_BY_COUNTRY = {
  Russia: "Europe/CIS",
  Ukraine: "Europe/CIS",
  Kazakhstan: "Europe/CIS",
  Belarus: "Europe/CIS",
  Uzbekistan: "Europe/CIS",
  Kyrgyzstan: "Europe/CIS",
  "United States": "North America",
  Canada: "North America",
  Mexico: "North America",
  "South Africa": "Africa",
  Guatemala: "North America",
  Brazil: "South America",
  Argentina: "South America",
  Chile: "South America",
  Uruguay: "South America",
  Colombia: "South America",
  Peru: "South America",
  Mongolia: "Asia",
  China: "Asia",
  Japan: "Asia",
  "South Korea": "Asia",
  Indonesia: "Asia",
  Malaysia: "Asia",
  Philippines: "Asia",
  Thailand: "Asia",
  Vietnam: "Asia",
  India: "Asia",
  Australia: "Oceania",
  "New Zealand": "Oceania",
  "Saudi Arabia": "Middle East",
  "United Arab Emirates": "Middle East",
  Jordan: "Middle East",
  Turkey: "Europe",
  Türkiye: "Europe",
  Israel: "Europe",
};
const regionOfCountry = (country) => REGION_BY_COUNTRY[country] ?? "Europe";

const TEAM_REGIONS = {
  CIS: "Europe/CIS",
  Europe: "Europe",
  "North America": "North America",
  "South America": "South America",
  Americas: "North America",
  Asia: "Asia",
  "Asia-Pacific": "Asia",
  Oceania: "Oceania",
  "Middle East": "Middle East",
  MENA: "Middle East",
};

// Funções do Liquipedia para as do bingo. "support" não vira critério.
const ROLE_MAP = { igl: "IGL", rifle: "Rifler", rifler: "Rifler", awp: "AWPer", awper: "AWPer", entry: "Entry fragger", lurker: "Lurker" };

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let lastRequestAt = 0;

const api = async (params) => {
  const wait = lastRequestAt + DELAY_BETWEEN_REQUESTS_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastRequestAt = Date.now();
  const response = await fetch(`${API_URL}?${new URLSearchParams({ format: "json", formatversion: "2", ...params })}`, {
    headers: { "User-Agent": USER_AGENT, "Accept-Encoding": "gzip" },
  });
  if (!response.ok) throw new Error(`Liquipedia: ${response.status} ${await response.text()}`);
  return response.json();
};

// Busca o wikitext de várias páginas, seguindo redirecionamentos. Devolve título pedido → página.
const fetchPages = async (titles) => {
  const result = new Map();
  const unique = [...new Set(titles)];
  for (let start = 0; start < unique.length; start += TITLES_PER_REQUEST) {
    const batch = unique.slice(start, start + TITLES_PER_REQUEST);
    const { query } = await api({
      action: "query",
      prop: "revisions",
      rvprop: "content",
      rvslots: "main",
      redirects: "1",
      titles: batch.join("|"),
    });
    const resolve = (title) => {
      const normalized = query.normalized?.find((entry) => entry.from === title)?.to ?? title;
      return query.redirects?.find((entry) => entry.from === normalized)?.to ?? normalized;
    };
    const pageByTitle = new Map(query.pages.map((page) => [page.title, page]));
    batch.forEach((title) => {
      const page = pageByTitle.get(resolve(title));
      if (page && !page.missing) {
        result.set(title, { title: page.title, wikitext: page.revisions?.[0]?.slots?.main?.content ?? "" });
      }
    });
  }
  return result;
};

const cleanWikiValue = (value) =>
  value
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\[\[(?:[^|\]]*\|)?([^\]]*)\]\]/g, "$1")
    .replace(/\{\{[^}]*\}\}/g, "")
    .replace(/'''?/g, "")
    .trim();

const readField = (wikitext, field) => {
  const match = wikitext.match(new RegExp(`\\n\\|\\s*${field}\\s*=([^\\n]*)`));
  return match ? cleanWikiValue(match[1]) : "";
};

const sectionBetween = (text, startMarker, endPattern) => {
  const start = text.indexOf(startMarker);
  if (start < 0) throw new Error(`Seção não encontrada: ${startMarker}`);
  const rest = text.slice(start + startMarker.length);
  const end = rest.search(endPattern);
  return end < 0 ? rest : rest.slice(0, end);
};

// {{player|AdreN|link=AdreN (Kazakh player)|flag=kz}} → página do jogador
const readPlayerTemplate = (template) => {
  const parts = template.split("|").map((part) => part.trim());
  return parts.find((part) => part.startsWith("link="))?.slice(5) ?? parts[1];
};

const parseTop20 = (wikitext) => {
  const entries = [];
  const sections = wikitext.split(/=+\{\{HiddenSort\|(\d{4})\}\}=+/);
  for (let index = 1; index < sections.length; index += 2) {
    const year = Number(sections[index]);
    for (const line of sections[index + 1].split("\n")) {
      // Alguns anos têm caracteres invisíveis (U+2060) colados nas aspas.
      const match = line
        .replace(/[\u2060\u200b]/g, "")
        .match(/(?:\}\}|^\|)\s*([^"|{}]*?)\s*"'''\[\[([^\]|]+)(?:\|[^\]]*)?\]\]'''"\s*([^|{\n]*)/);
      if (match) entries.push({ year, page: match[2].trim(), firstName: match[1].trim(), lastName: match[3].trim() });
    }
  }
  const perYear = Object.entries(Object.groupBy(entries, (entry) => entry.year)).filter(([, list]) => list.length !== 20);
  if (perYear.length) console.warn(`! Top 20 com contagem diferente de 20: ${perYear.map(([year, list]) => `${year}=${list.length}`).join(", ")}`);
  return entries;
};

const parseMajorStats = (wikitext) => {
  const mvps = sectionBetween(wikitext, "===HLTV  Major MVP Awards===", /\n===/)
    .match(/\{\{player\|[^}]+\}\}/g)
    .map((template) => readPlayerTemplate(template.slice(2, -2)));

  const titles = new Map();
  for (const row of sectionBetween(wikitext, "===Titles Won per Player===", /\n===/).split("\n|-")) {
    const player = row.match(/\{\{player\|[^}]+\}\}/);
    const count = row.match(/'''(\d+)'''/);
    if (player && count) titles.set(readPlayerTemplate(player[0].slice(2, -2)), Number(count[1]));
  }
  return { mvps, titles };
};

// Primeira frase do artigo: Russel "'''Twistzz'''" Van Dulken {{born}} is...
const readLeadName = (wikitext) => {
  const match = wikitext.match(/\n([^\n"{}[\]|]{2,60}?)\s*"'''[^']+'''"\s*([^\n{(]*?)\s*(?:\{\{|\(|\bis\b|\bwas\b|,)/);
  if (!match) return "";
  // "Jacky 'Jake' Yip": o apelido entre aspas simples não faz parte do nome.
  return `${match[1].trim()} ${match[2].trim()}`.replace(/\s*'[^']*'\s*/g, " ").trim();
};

const readTeamHistory = (wikitext) =>
  [...wikitext.matchAll(/\{\{TH\|([^|}]*)\|([^|}]+)(?:\|[^}]*)?\}\}/g)]
    .map((match) => ({ team: cleanWikiValue(match[2]), present: /present/i.test(match[1]) }))
    .filter((entry) => entry.team);

// Elenco ativo de um time: {{Squad|status=active |{{Person|id=b1t|name=...}} ...}}. Técnicos e
// analistas têm role= e ficam de fora.
const readActiveSquad = (wikitext) => {
  const start = wikitext.search(/\{\{Squad\|status=active/i);
  if (start < 0) return [];
  const block = wikitext.slice(start, wikitext.indexOf("\n}}", start));
  return [...block.matchAll(/\{\{Person\|([^\n]*)\}\}/g)]
    .map((match) => Object.fromEntries(match[1].split("|").map((part) => part.split("=").map((piece) => piece.trim()))))
    .filter((person) => person.id && !person.role)
    .map((person) => ({ page: person.link || person.id, name: cleanWikiValue(person.name ?? "") }));
};

const slug = (text) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const tsString = (value) => JSON.stringify(value);

const main = async () => {
  const previous = await import("../src/data/csBingoDatabase.ts");
  const previousPlayerByNickname = new Map(previous.csPlayers.map((player) => [player.nickname.toLowerCase(), player]));
  const previousTeams = previous.csTeams;

  console.log("Lendo Top 20 da HLTV e estatísticas de Majors...");
  const listPages = await fetchPages(["HLTV/Top 20 Players", "Majors/Player Statistics"]);
  const top20 = parseTop20(listPages.get("HLTV/Top 20 Players").wikitext);
  const { mvps, titles } = parseMajorStats(listPages.get("Majors/Player Statistics").wikitext);
  console.log(`  Top 20: ${top20.length} entradas, MVPs: ${mvps.length}, campeões: ${titles.size}`);

  const requested = [
    ...top20.map((entry) => entry.page),
    ...mvps,
    ...titles.keys(),
    ...CURATED_PLAYERS,
  ];
  console.log(`Lendo ${new Set(requested).size} páginas de jogadores...`);
  const playerPages = await fetchPages(requested);

  // Agrupa pelo título final: "dev1ce" e "Device" levam à mesma página.
  const canonical = (title) => playerPages.get(title)?.title;
  const top20ByPage = new Map();
  const leadByPage = new Map();
  top20.forEach((entry) => {
    const page = canonical(entry.page);
    if (!page) return;
    top20ByPage.set(page, [...(top20ByPage.get(page) ?? []), entry.year]);
    if (entry.firstName && entry.lastName) leadByPage.set(page, `${entry.firstName} ${entry.lastName}`);
  });
  const mvpPages = new Set(mvps.map(canonical).filter(Boolean));
  const titlesByPage = new Map([...titles].map(([title, count]) => [canonical(title), count]).filter(([page]) => page));

  const rawPlayers = new Map();
  const addPlayers = (pages, nameByPage = new Map()) => {
    for (const [requestedTitle, { title, wikitext }] of pages) {
      if (rawPlayers.has(title)) continue;
      if (!/\{\{\s*Infobox player/i.test(wikitext)) {
        console.warn(`! ${requestedTitle}: página sem infobox de jogador`);
        continue;
      }
      const status = readField(wikitext, "status").toLowerCase();
      const history = readTeamHistory(wikitext);
      rawPlayers.set(title, {
        page: title,
        nickname: readField(wikitext, "id") || title.replace(/\s*\(.*\)$/, ""),
        fullName:
          leadByPage.get(title) ||
          nameByPage.get(requestedTitle) ||
          readLeadName(wikitext) ||
          readField(wikitext, "romanized_name") ||
          readField(wikitext, "name"),
        country: readField(wikitext, "country"),
        // "Inactive" cobre banco e quem trocou de jogo: conta como ativo só quem ainda tem time.
        active: status === "active" || (status === "inactive" && history.some((entry) => entry.present)),
        // O campo team= usa apelidos de template ("BC.Game"); o histórico traz o nome da página.
        team: history.findLast((entry) => entry.present)?.team ?? readField(wikitext, "team"),
        roles: [
          ...new Set(
            readField(wikitext, "roles")
              .split(/[,/]/)
              .map((role) => ROLE_MAP[role.trim().toLowerCase()])
              .filter(Boolean)
          ),
        ],
        history: history.map((entry) => entry.team),
        top20Years: [...new Set(top20ByPage.get(title) ?? [])].sort(),
        majorsWon: titlesByPage.get(title) ?? 0,
        majorMvp: mvpPages.has(title),
      });
    }
  };
  addPlayers(playerPages);
  // Ids antigos pela página do Liquipedia: o nick "device" da base antiga é "dev1ce" lá.
  const previousIdByPage = new Map(
    previous.csPlayers
      .map((player) => [player.liquipediaPage ?? canonical(player.nickname), player])
      .filter(([page]) => page)
  );
  const missing = [...new Set(requested)].filter((title) => !playerPages.has(title));
  if (missing.length) console.warn(`! Páginas não encontradas: ${missing.join(", ")}`);
  console.log(`  ${rawPlayers.size} jogadores com infobox`);

  // Nomes de time variam ("mousesports", "Made in Brazil"): resolve todos pelos redirecionamentos.
  const teamPages = new Map();
  const loadTeamPages = async (names) => {
    const pending = [...new Set(names)].filter((name) => name && !teamPages.has(name));
    if (!pending.length) return;
    console.log(`Lendo ${pending.length} páginas de times...`);
    (await fetchPages(pending)).forEach((page, name) => teamPages.set(name, page));
  };
  const teamPageOf = (name) => {
    const page = teamPages.get(name);
    return page && /\{\{\s*Infobox team/i.test(page.wikitext) ? page.title : undefined;
  };
  const wikitextOfTeam = (page) => [...teamPages.values()].find((entry) => entry.title === page)?.wikitext ?? "";
  const countPlayersByTeam = () => {
    const counts = new Map();
    for (const player of rawPlayers.values()) {
      new Set(player.history.map(teamPageOf).filter(Boolean)).forEach((page) => counts.set(page, (counts.get(page) ?? 0) + 1));
    }
    return counts;
  };

  await loadTeamPages([...[...rawPlayers.values()].flatMap((player) => [...player.history, player.team]), ...CORE_TEAMS]);

  // Elencos atuais dos times principais entram na base.
  const coreTeamPages = new Set([
    ...CORE_TEAMS.map(teamPageOf).filter(Boolean),
    ...[...countPlayersByTeam()]
      .filter(([page, count]) => count >= MIN_PLAYERS_PER_TEAM && !readField(wikitextOfTeam(page), "disbanded"))
      .map(([page]) => page),
  ]);
  const squad = [...coreTeamPages].flatMap((page) => readActiveSquad(wikitextOfTeam(page)));
  const squadNames = new Map(squad.map((person) => [person.page, person.name]));
  const newSquadTitles = squad.map((person) => person.page).filter((title) => !playerPages.has(title));
  console.log(`Lendo ${new Set(newSquadTitles).size} jogadores dos elencos de ${coreTeamPages.size} times principais...`);
  const squadPages = await fetchPages(newSquadTitles);
  addPlayers(squadPages, squadNames);
  console.log(`  ${rawPlayers.size} jogadores no total`);
  await loadTeamPages([...rawPlayers.values()].flatMap((player) => [...player.history, player.team]));

  const playersByTeam = countPlayersByTeam();
  const trackedPages = new Set([
    ...coreTeamPages,
    ...[...playersByTeam].filter(([, count]) => count >= MIN_PLAYERS_PER_TEAM).map(([page]) => page),
    ...[...rawPlayers.values()].filter((player) => player.active && player.team).map((player) => teamPageOf(player.team)).filter(Boolean),
  ]);

  const usedTeamIds = new Set();
  const teams = [...trackedPages].map((page) => {
    const wikitext = wikitextOfTeam(page);
    const previousTeam = previousTeams.find((team) => team.liquipediaPage === page || teamPageOf(team.name) === page);
    const name = readField(wikitext, "name") || page;
    let id = previousTeam?.id ?? slug(name);
    while (usedTeamIds.has(id)) id += "x";
    usedTeamIds.add(id);
    const country = readField(wikitext, "location") || previousTeam?.country || "International";
    return {
      id,
      name: previousTeam?.name ?? name,
      liquipediaPage: page,
      country,
      region: TEAM_REGIONS[readField(wikitext, "region")] ?? previousTeam?.region ?? regionOfCountry(country),
      founded: Number(readField(wikitext, "created").match(/\d{4}/)?.[0]) || previousTeam?.founded || 0,
      status: readField(wikitext, "disbanded") ? "inactive" : "active",
      notableAchievements: previousTeam?.notableAchievements ?? [],
      playerCount: playersByTeam.get(page) ?? 0,
    };
  });
  const teamIdByPage = new Map(teams.map((team) => [team.liquipediaPage, team.id]));
  const teamIdOf = (name) => teamIdByPage.get(teamPageOf(name));

  const usedPlayerIds = new Set();
  const players = [...rawPlayers.values()]
    .map((player) => {
      const previousPlayer = previousIdByPage.get(player.page) ?? previousPlayerByNickname.get(player.nickname.toLowerCase());
      let id = previousPlayer?.id ?? slug(player.nickname);
      while (usedPlayerIds.has(id)) id += "x";
      usedPlayerIds.add(id);
      const currentTeam = player.active ? teamIdOf(player.team) : undefined;
      const teamIds = [...new Set([...player.history.map(teamIdOf), currentTeam].filter(Boolean))];
      if (!player.country) console.warn(`! ${player.page}: sem país`);
      return {
        id,
        nickname: player.nickname,
        fullName: player.fullName || player.nickname,
        nationality: player.country,
        region: regionOfCountry(player.country),
        roles: player.roles.length ? player.roles : previousPlayer?.roles ?? ["Rifler"],
        currentTeam,
        teams: teamIds,
        majorsWon: player.majorsWon,
        majorMvp: player.majorMvp,
        hltvTop20Years: player.top20Years,
        active: player.active,
        liquipediaPage: player.page,
      };
    })
    .sort((a, b) => a.nickname.localeCompare(b.nickname, "en", { sensitivity: "base" }));

  // Países fora da tabela caem em "Europe": a lista serve para conferir que são mesmo europeus.
  const europeByDefault = [...new Set(players.map((player) => player.nationality))].filter((country) => !REGION_BY_COUNTRY[country]);
  console.log(`  Países tratados como Europa: ${europeByDefault.sort().join(", ")}`);

  const lines = [
    "// Gerado por scripts/import-players.mjs a partir do Liquipedia (CC-BY-SA 3.0). Não edite à mão:",
    "// rode o script de novo. Ajustes manuais pontuais ficam em src/data/csBingoDatabase.ts.",
    'import type { CsPlayer, CsTeam } from "../csBingoDatabase";',
    "",
    "export const generatedTeams: CsTeam[] = [",
    ...teams.map(
      ({ playerCount, ...team }) =>
        `  { id: ${tsString(team.id)}, name: ${tsString(team.name)}, liquipediaPage: ${tsString(team.liquipediaPage)}, country: ${tsString(team.country)}, region: ${tsString(team.region)}, founded: ${team.founded}, status: ${tsString(team.status)}, notableAchievements: ${tsString(team.notableAchievements)} }, // ${playerCount} jogadores`
    ),
    "];",
    "",
    "export const generatedPlayers: CsPlayer[] = [",
    ...players.map((player) => {
      const fields = [
        `id: ${tsString(player.id)}`,
        `nickname: ${tsString(player.nickname)}`,
        `fullName: ${tsString(player.fullName)}`,
        `nationality: ${tsString(player.nationality)}`,
        `region: ${tsString(player.region)}`,
        `roles: ${tsString(player.roles)}`,
        ...(player.currentTeam ? [`currentTeam: ${tsString(player.currentTeam)}`] : []),
        `teams: ${tsString(player.teams)}`,
        `majorsWon: ${player.majorsWon}`,
        `majorMvp: ${player.majorMvp}`,
        `hltvTop20Years: ${tsString(player.hltvTop20Years)}`,
        `active: ${player.active}`,
        `liquipediaPage: ${tsString(player.liquipediaPage)}`,
      ];
      return `  { ${fields.join(", ")} },`;
    }),
    "];",
    "",
  ];
  mkdirSync("src/data/generated", { recursive: true });
  writeFileSync(OUTPUT_FILE, lines.join("\n"));
  console.log(`✓ ${players.length} jogadores e ${teams.length} times em ${OUTPUT_FILE}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
