// Textos dos critérios do CS Bingo nos três idiomas (o português vem de bingoCriteria).
import { getTeamName } from "@/data/csBingoDatabase";
import type { BingoCriterion } from "@/data/csBingoDatabase";
import type { Language } from "@/lib/language";
import type { BoardCell } from "./board";

export type CriterionCopy = {
  label: string;
  helper: string;
};

// Liga os dois critérios de uma casa: "Brasil e IGL".
export const comboJoiners: Record<Language, string> = { pt: "e", en: "and", es: "y" };

const criterionTranslations: Record<Language, Record<string, CriterionCopy>> = {
  pt: {},
  en: {
    "nat-brazil": { label: "Brazil", helper: "Brazilian player" },
    "nat-denmark": { label: "Denmark", helper: "Danish player" },
    "nat-france": { label: "France", helper: "French player" },
    "nat-russia": { label: "Russia", helper: "Russian player" },
    "nat-ukraine": { label: "Ukraine", helper: "Ukrainian player" },
    "nat-israel": { label: "Israel", helper: "Israeli player" },
    "nat-sweden": { label: "Sweden", helper: "Swedish player" },
    "nat-poland": { label: "Poland", helper: "Polish player" },
    "role-entry": { label: "Entry fragger", helper: "Plays or played as an entry fragger" },
    "multi-major": { label: "2+ Majors", helper: "Won two or more Majors" },
    "no-major": { label: "No Major", helper: "Never won a Major" },
    "top20-5": { label: "Top 20 5+ times", helper: "Made HLTV's Top 20 in five or more years" },
    "teams-3": { label: "3+ teams", helper: "Played for three or more teams" },
    retired: { label: "Retired", helper: "No longer plays professionally" },
    "region-na": { label: "NA", helper: "Represents North America" },
    "role-awper": { label: "AWPer", helper: "Plays or played as an AWPer" },
    "role-igl": { label: "IGL", helper: "Plays or played as an in-game leader" },
    "role-lurker": { label: "Lurker", helper: "Plays or played as a lurker" },
    "major-winner": { label: "Major winner", helper: "Won at least one Major" },
    "major-mvp": { label: "Major MVP", helper: "Was a Major MVP" },
    top20: { label: "HLTV Top 20", helper: "Appeared in HLTV's Top 20" },
    active: { label: "Active", helper: "Still active in the scene" },
  },
  es: {
    "nat-brazil": { label: "Brasil", helper: "Jugador brasileño" },
    "nat-denmark": { label: "Dinamarca", helper: "Jugador danés" },
    "nat-france": { label: "Francia", helper: "Jugador francés" },
    "nat-russia": { label: "Rusia", helper: "Jugador ruso" },
    "nat-ukraine": { label: "Ucrania", helper: "Jugador ucraniano" },
    "nat-israel": { label: "Israel", helper: "Jugador israelí" },
    "nat-sweden": { label: "Suecia", helper: "Jugador sueco" },
    "nat-poland": { label: "Polonia", helper: "Jugador polaco" },
    "role-entry": { label: "Entry fragger", helper: "Juega o jugó como entry fragger" },
    "multi-major": { label: "2+ Majors", helper: "Ganó dos Majors o más" },
    "no-major": { label: "Sin Major", helper: "Nunca ganó un Major" },
    "top20-5": { label: "Top 20 5+ veces", helper: "Entró en el Top 20 de HLTV en cinco años o más" },
    "teams-3": { label: "3+ equipos", helper: "Pasó por tres equipos o más" },
    retired: { label: "Retirado", helper: "Ya no juega profesionalmente" },
    "region-na": { label: "NA", helper: "Representa a Norteamérica" },
    "role-awper": { label: "AWPer", helper: "Juega o jugó como AWPer" },
    "role-igl": { label: "IGL", helper: "Juega o jugó como líder dentro del juego" },
    "role-lurker": { label: "Lurker", helper: "Juega o jugó como lurker" },
    "major-winner": { label: "Campeón de Major", helper: "Ganó al menos un Major" },
    "major-mvp": { label: "MVP de Major", helper: "Fue MVP de un Major" },
    top20: { label: "HLTV Top 20", helper: "Apareció en el Top 20 de HLTV" },
    active: { label: "Activo", helper: "Sigue activo en la escena" },
  },
};

export const getCellCopy = (cell: BoardCell, language: Language) => {
  const copies = cell.map((criterion) => getCriterionCopy(criterion, language));
  return {
    label: copies.map((criterionCopy) => criterionCopy.label).join(` ${comboJoiners[language]} `),
    helper: copies.map((criterionCopy) => criterionCopy.helper).join(" · "),
  };
};

const teamHelpers: Record<Language, (teamName: string) => string> = {
  pt: (teamName) => `Jogou pela ${teamName}`,
  en: (teamName) => `Played for ${teamName}`,
  es: (teamName) => `Jugó en ${teamName}`,
};

export const getCriterionCopy = (criterion: BingoCriterion, language: Language) => {
  if (criterion.type === "team") {
    return { label: criterion.label, helper: teamHelpers[language](getTeamName(String(criterion.value))) };
  }
  return criterionTranslations[language][criterion.id] ?? { label: criterion.label, helper: criterion.helper };
};
