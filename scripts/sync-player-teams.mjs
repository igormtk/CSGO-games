// Sincroniza o time atual e o status dos jogadores com o Liquipedia.
// Roda toda semana pelo GitHub Actions (.github/workflows/sync-player-teams.yml).
//
// Uso:
//   node scripts/sync-player-teams.mjs            grava as mudanças no Supabase
//   node scripts/sync-player-teams.mjs --dry-run  só mostra o que mudaria
//
// Com SUPABASE_URL e SUPABASE_SECRET_KEY, lê e grava no Supabase. Sem elas, compara com
// src/data/csBingoDatabase.ts e só imprime o relatório.
// Dados do Liquipedia são CC-BY-SA 3.0: o site precisa creditar a fonte.

const API_URL = "https://liquipedia.net/counterstrike/api.php";
// O Liquipedia exige um User-Agent com contato do responsável pelo uso da API.
const CONTACT = process.env.LIQUIPEDIA_CONTACT || "https://github.com/igormtk/CSGO-games";
const USER_AGENT = `CSGamesBingo/1.0 (${CONTACT})`;
const TITLES_PER_REQUEST = 50;
const DELAY_BETWEEN_REQUESTS_MS = 2500;

// Nomes que o Liquipedia usa de forma diferente dos nossos times.
const TEAM_ALIASES = {
  "FaZe": "faze",
  "Mousesports": "mousesports",
  "MIBR": "mibr",
  "Made in Brazil": "mibr",
  "NIP": "nip",
  "Vitality": "vitality",
  "Spirit": "spirit",
  "Falcons": "falcons",
  "Liquid": "liquid",
};

const dryRun = process.argv.includes("--dry-run");
const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
const useSupabase = Boolean(supabaseUrl && supabaseKey);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const supabase = async (path, options = {}) => {
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: { apikey: supabaseKey, "Content-Type": "application/json", ...options.headers },
  });
  if (!response.ok) throw new Error(`Supabase ${options.method ?? "GET"} ${path}: ${response.status} ${await response.text()}`);
  return response.status === 204 ? null : response.json();
};

const loadDatabase = async () => {
  if (useSupabase) {
    const [players, teams, playerTeams] = await Promise.all([
      supabase("players?select=id,nickname,active,current_team_id,current_team_name,liquipedia_page"),
      supabase("teams?select=id,name"),
      supabase("player_teams?select=player_id,team_id"),
    ]);
    return { players, teams, playerTeams };
  }

  const data = await import("../src/data/csBingoDatabase.ts");
  return {
    players: data.csPlayers.map((player) => ({
      id: player.id,
      nickname: player.nickname,
      active: player.active,
      current_team_id: player.currentTeam ?? null,
      current_team_name: player.currentTeam ? data.getTeamName(player.currentTeam) : null,
      liquipedia_page: null,
    })),
    teams: data.csTeams.map((team) => ({ id: team.id, name: team.name })),
    playerTeams: data.csPlayers.flatMap((player) => player.teams.map((teamId) => ({ player_id: player.id, team_id: teamId }))),
  };
};

// Tira links e marcações de wiki do valor de um campo do infobox.
const cleanWikiValue = (value) =>
  value
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\[\[(?:[^|\]]*\|)?([^\]]*)\]\]/g, "$1")
    .replace(/\{\{[^}]*\}\}/g, "")
    .trim();

const readInfoboxField = (wikitext, field) => {
  const match = wikitext.match(new RegExp(`\\|\\s*${field}\\s*=([^\\n|]*)`));
  return match ? cleanWikiValue(match[1]) : "";
};

const fetchLiquipediaPlayers = async (players) => {
  const results = new Map();

  for (let start = 0; start < players.length; start += TITLES_PER_REQUEST) {
    if (start > 0) await sleep(DELAY_BETWEEN_REQUESTS_MS);

    const batch = players.slice(start, start + TITLES_PER_REQUEST);
    const titleByPlayer = new Map(batch.map((player) => [player.id, player.liquipedia_page || player.nickname]));
    const params = new URLSearchParams({
      action: "query",
      prop: "revisions",
      rvprop: "content",
      rvslots: "main",
      redirects: "1",
      format: "json",
      formatversion: "2",
      titles: [...titleByPlayer.values()].join("|"),
    });
    const response = await fetch(`${API_URL}?${params}`, {
      headers: { "User-Agent": USER_AGENT, "Accept-Encoding": "gzip" },
    });
    if (!response.ok) throw new Error(`Liquipedia: ${response.status} ${await response.text()}`);
    const { query } = await response.json();

    // O título pedido pode ter sido normalizado (primeira letra maiúscula) e redirecionado.
    const resolve = (title) => {
      const normalized = query.normalized?.find((entry) => entry.from === title)?.to ?? title;
      return query.redirects?.find((entry) => entry.from === normalized)?.to ?? normalized;
    };
    const pageByTitle = new Map(query.pages.map((page) => [page.title, page]));

    batch.forEach((player) => {
      const page = pageByTitle.get(resolve(titleByPlayer.get(player.id)));
      const wikitext = page?.revisions?.[0]?.slots?.main?.content ?? "";
      if (!/\{\{\s*Infobox player/i.test(wikitext)) {
        results.set(player.id, { error: page?.missing ? "página não existe" : "página sem infobox de jogador" });
        return;
      }
      results.set(player.id, {
        page: page.title,
        team: readInfoboxField(wikitext, "team"),
        status: readInfoboxField(wikitext, "status"),
      });
    });
  }

  return results;
};

const main = async () => {
  const { players, teams, playerTeams } = await loadDatabase();
  const teamIdByName = new Map([
    ...teams.map((team) => [team.name.toLowerCase(), team.id]),
    ...Object.entries(TEAM_ALIASES).map(([name, id]) => [name.toLowerCase(), id]),
  ]);
  const knownTeamIds = new Set(teams.map((team) => team.id));
  const liquipedia = await fetchLiquipediaPlayers(players);

  const updates = [];
  const problems = [];

  players.forEach((player) => {
    const remote = liquipedia.get(player.id);
    if (!remote || remote.error) {
      problems.push(`${player.nickname}: ${remote?.error ?? "sem resposta"}`);
      return;
    }

    const active = remote.status ? remote.status.toLowerCase() === "active" : player.active;
    // Para aposentados e inativos o infobox mantém o último time; isso não é time atual.
    const teamName = active ? remote.team || null : null;
    const teamId = teamName ? teamIdByName.get(teamName.toLowerCase()) ?? null : null;
    const teamChanged = (teamName ?? "").toLowerCase() !== (player.current_team_name ?? "").toLowerCase();

    if (teamChanged || active !== player.active || (remote.page && remote.page !== player.liquipedia_page)) {
      updates.push({ player, teamName, teamId, active, teamChanged, page: remote.page });
    }
  });

  const transfers = updates.filter((update) => update.teamChanged);
  console.log(`Fonte: ${useSupabase ? "Supabase" : "src/data/csBingoDatabase.ts"} · ${players.length} jogadores`);
  console.log(`\nTransferências (${transfers.length}):`);
  transfers.forEach(({ player, teamName, teamId }) =>
    console.log(`  ${player.nickname}: ${player.current_team_name ?? "sem time"} → ${teamName ?? "sem time"}${teamName && !teamId ? " (time fora da base)" : ""}`)
  );
  const statusChanges = updates.filter((update) => update.active !== update.player.active);
  console.log(`\nMudanças de status (${statusChanges.length}):`);
  statusChanges.forEach(({ player, active }) => console.log(`  ${player.nickname}: ${active ? "ativo" : "inativo/aposentado"}`));
  if (problems.length) {
    console.log(`\nNão encontrados no Liquipedia (${problems.length}) — ajuste players.liquipedia_page:`);
    problems.forEach((problem) => console.log(`  ${problem}`));
  }

  if (dryRun || !useSupabase) {
    console.log(`\n${useSupabase ? "--dry-run" : "Sem credenciais do Supabase"}: nada foi gravado.`);
    return;
  }

  const now = new Date().toISOString();
  const existingLinks = new Set(playerTeams.map((link) => `${link.player_id}:${link.team_id}`));

  for (const { player, teamName, teamId, active, teamChanged, page } of updates) {
    await supabase(`players?id=eq.${encodeURIComponent(player.id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        current_team_id: teamId && knownTeamIds.has(teamId) ? teamId : null,
        current_team_name: teamName,
        active,
        liquipedia_page: page,
        updated_at: now,
      }),
    });

    if (teamChanged) {
      await supabase("player_transfers", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          player_id: player.id,
          from_team_name: player.current_team_name,
          to_team_name: teamName,
          detected_at: now,
        }),
      });
    }

    // O histórico ("jogou pela X") alimenta os critérios de time do bingo.
    if (teamId && knownTeamIds.has(teamId) && !existingLinks.has(`${player.id}:${teamId}`)) {
      await supabase("player_teams", {
        method: "POST",
        headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
        body: JSON.stringify({ player_id: player.id, team_id: teamId }),
      });
    }
  }

  console.log(`\n${updates.length} jogadores atualizados no Supabase.`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
