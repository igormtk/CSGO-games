// Regera os dados (INSERTs) de database/cs_bingo_schema.sql a partir de src/data/csBingoDatabase.ts.
// O esquema e as políticas de segurança do arquivo ficam como estão.
//
// Uso:
//   node --experimental-strip-types scripts/generate-seed.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { bingoCriteria, csCoaches, csPlayers, csTeams } from "../src/data/csBingoDatabase.ts";
import { teamLogoFiles } from "../src/data/generated/teamLogos.ts";

const SCHEMA_FILE = "database/cs_bingo_schema.sql";
const START_MARKER = "INSERT INTO teams";
const END_MARKER = "-- Segurança para o Supabase";

const sql = (value) => {
  if (value === undefined || value === null) return "NULL";
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  if (typeof value === "number") return String(value);
  return `'${String(value).replace(/'/g, "''")}'`;
};

const insert = (table, columns, rows, conflict) =>
  rows.length
    ? `INSERT INTO ${table} (${columns.join(", ")}) VALUES\n${rows.map((row) => `  (${row.map(sql).join(", ")})`).join(",\n")}\n${conflict};\n`
    : "";

const upsert = (key, columns) =>
  `ON CONFLICT (${key}) DO UPDATE SET\n${columns.map((column) => `  ${column} = EXCLUDED.${column}`).join(",\n")}`;

const teamName = (teamId) => csTeams.find((team) => team.id === teamId)?.name;

const blocks = [
  insert(
    "teams",
    ["id", "name", "country", "region", "founded", "status", "logo_url"],
    csTeams.map((team) => [
      team.id,
      team.name,
      team.country,
      team.region,
      team.founded || null,
      team.status,
      teamLogoFiles[team.id] ? `/teams/${teamLogoFiles[team.id]}` : null,
    ]),
    upsert("id", ["name", "country", "region", "founded", "status", "logo_url"])
  ),
  insert(
    "players",
    ["id", "nickname", "full_name", "nationality", "region", "majors_won", "major_mvp", "active", "current_team_id", "current_team_name", "liquipedia_page"],
    csPlayers.map((player) => [
      player.id,
      player.nickname,
      player.fullName,
      player.nationality,
      player.region,
      player.majorsWon,
      player.majorMvp,
      player.active,
      player.currentTeam,
      player.currentTeam ? teamName(player.currentTeam) : null,
      player.liquipediaPage,
    ]),
    // Time atual e status ficam com a sincronização semanal (scripts/sync-player-teams.mjs).
    upsert("id", ["nickname", "full_name", "nationality", "region", "majors_won", "major_mvp", "liquipedia_page"])
  ),
  insert(
    "player_roles",
    ["player_id", "role"],
    csPlayers.flatMap((player) => player.roles.map((role) => [player.id, role])),
    "ON CONFLICT DO NOTHING"
  ),
  insert(
    "player_teams",
    ["player_id", "team_id"],
    csPlayers.flatMap((player) => player.teams.map((teamId) => [player.id, teamId])),
    "ON CONFLICT DO NOTHING"
  ),
  insert(
    "player_hltv_top20_years",
    ["player_id", "year"],
    csPlayers.flatMap((player) => player.hltvTop20Years.map((year) => [player.id, year])),
    "ON CONFLICT DO NOTHING"
  ),
  insert(
    "coaches",
    ["id", "nickname", "full_name", "nationality", "current_team_id"],
    csCoaches.map((coach) => [coach.id, coach.nickname, coach.fullName, coach.nationality, coach.currentTeam]),
    upsert("id", ["nickname", "full_name", "nationality", "current_team_id"])
  ),
  insert(
    "coach_teams",
    ["coach_id", "team_id"],
    csCoaches.flatMap((coach) => coach.teamsCoached.map((teamId) => [coach.id, teamId])),
    "ON CONFLICT DO NOTHING"
  ),
  insert(
    "bingo_criteria",
    ["id", "label", "helper", "criterion_type", "criterion_value"],
    bingoCriteria.map((criterion) => [criterion.id, criterion.label, criterion.helper, criterion.type, String(criterion.value)]),
    upsert("id", ["label", "helper", "criterion_type", "criterion_value"])
  ),
];

const schema = readFileSync(SCHEMA_FILE, "utf8");
const start = schema.indexOf(START_MARKER);
const end = schema.indexOf(END_MARKER);
if (start < 0 || end < 0) throw new Error(`Marcadores não encontrados em ${SCHEMA_FILE}`);

writeFileSync(SCHEMA_FILE, `${schema.slice(0, start)}${blocks.join("\n")}\n${schema.slice(end)}`);
console.log(`✓ ${SCHEMA_FILE}: ${csTeams.length} times, ${csPlayers.length} jogadores, ${csCoaches.length} técnicos`);
