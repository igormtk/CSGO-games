export type CsTeam = {
  id: string;
  name: string;
  country: string;
  region: string;
  founded: number;
  status: "active" | "inactive";
  notableAchievements: string[];
};

export type CsPlayer = {
  id: string;
  nickname: string;
  fullName: string;
  nationality: string;
  region: string;
  roles: string[];
  currentTeam?: string;
  teams: string[];
  majorsWon: number;
  majorMvp: boolean;
  hltvTop20Years: number[];
  active: boolean;
};

export type BingoCriterion = {
  id: string;
  label: string;
  helper: string;
  type: "team" | "nationality" | "region" | "role" | "achievement" | "status";
  value: string | number | boolean;
};

export const csTeams: CsTeam[] = [
  {
    id: "navi",
    name: "Natus Vincere",
    country: "Ukraine",
    region: "Europe/CIS",
    founded: 2009,
    status: "active",
    notableAchievements: ["Major champion", "Intel Grand Slam"],
  },
  {
    id: "astralis",
    name: "Astralis",
    country: "Denmark",
    region: "Europe",
    founded: 2016,
    status: "active",
    notableAchievements: ["Four-time Major champion", "Intel Grand Slam"],
  },
  {
    id: "faze",
    name: "FaZe Clan",
    country: "International",
    region: "International",
    founded: 2010,
    status: "active",
    notableAchievements: ["Major champion", "Intel Grand Slam"],
  },
  {
    id: "g2",
    name: "G2 Esports",
    country: "Germany",
    region: "Europe",
    founded: 2014,
    status: "active",
    notableAchievements: ["IEM champion", "BLAST champion"],
  },
  {
    id: "vitality",
    name: "Team Vitality",
    country: "France",
    region: "Europe",
    founded: 2013,
    status: "active",
    notableAchievements: ["Major champion", "ESL Pro League champion"],
  },
  {
    id: "liquid",
    name: "Team Liquid",
    country: "United States",
    region: "North America",
    founded: 2000,
    status: "active",
    notableAchievements: ["Intel Grand Slam", "ESL One champion"],
  },
  {
    id: "furia",
    name: "FURIA",
    country: "Brazil",
    region: "South America",
    founded: 2017,
    status: "active",
    notableAchievements: ["Major playoff team", "ESL Pro League semifinalist"],
  },
  {
    id: "fnatic",
    name: "Fnatic",
    country: "United Kingdom",
    region: "Europe",
    founded: 2004,
    status: "active",
    notableAchievements: ["Three-time Major champion", "Katowice champion"],
  },
  {
    id: "mibr",
    name: "MIBR",
    country: "Brazil",
    region: "South America",
    founded: 2003,
    status: "active",
    notableAchievements: ["Major-winning legacy", "Brazilian icon"],
  },
  {
    id: "cloud9",
    name: "Cloud9",
    country: "United States",
    region: "North America",
    founded: 2013,
    status: "active",
    notableAchievements: ["Major champion", "North American icon"],
  },
];

export const csPlayers: CsPlayer[] = [
  {
    id: "s1mple",
    nickname: "s1mple",
    fullName: "Oleksandr Kostyliev",
    nationality: "Ukraine",
    region: "Europe/CIS",
    roles: ["AWPer", "Rifler"],
    currentTeam: "navi",
    teams: ["navi", "liquid"],
    majorsWon: 1,
    majorMvp: true,
    hltvTop20Years: [2016, 2017, 2018, 2019, 2020, 2021, 2022],
    active: true,
  },
  {
    id: "zywoo",
    nickname: "ZywOo",
    fullName: "Mathieu Herbaut",
    nationality: "France",
    region: "Europe",
    roles: ["AWPer", "Rifler"],
    currentTeam: "vitality",
    teams: ["vitality"],
    majorsWon: 1,
    majorMvp: true,
    hltvTop20Years: [2019, 2020, 2021, 2022, 2023, 2024],
    active: true,
  },
  {
    id: "device",
    nickname: "device",
    fullName: "Nicolai Reedtz",
    nationality: "Denmark",
    region: "Europe",
    roles: ["AWPer"],
    currentTeam: "astralis",
    teams: ["astralis", "nip"],
    majorsWon: 4,
    majorMvp: true,
    hltvTop20Years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2023],
    active: true,
  },
  {
    id: "dupreeh",
    nickname: "dupreeh",
    fullName: "Peter Rasmussen",
    nationality: "Denmark",
    region: "Europe",
    roles: ["Rifler", "Entry fragger"],
    teams: ["astralis", "vitality", "falcons"],
    majorsWon: 5,
    majorMvp: false,
    hltvTop20Years: [2013, 2014, 2015, 2017, 2018, 2019],
    active: true,
  },
  {
    id: "niko",
    nickname: "NiKo",
    fullName: "Nikola Kovac",
    nationality: "Bosnia and Herzegovina",
    region: "Europe",
    roles: ["Rifler", "Entry fragger"],
    teams: ["faze", "g2", "mousesports"],
    majorsWon: 0,
    majorMvp: false,
    hltvTop20Years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    active: true,
  },
  {
    id: "coldzera",
    nickname: "coldzera",
    fullName: "Marcelo David",
    nationality: "Brazil",
    region: "South America",
    roles: ["Rifler", "Lurker"],
    teams: ["mibr", "faze", "sk"],
    majorsWon: 2,
    majorMvp: true,
    hltvTop20Years: [2016, 2017, 2018],
    active: true,
  },
  {
    id: "fallen",
    nickname: "FalleN",
    fullName: "Gabriel Toledo",
    nationality: "Brazil",
    region: "South America",
    roles: ["AWPer", "IGL"],
    currentTeam: "furia",
    teams: ["furia", "mibr", "liquid", "sk"],
    majorsWon: 2,
    majorMvp: false,
    hltvTop20Years: [2016, 2017],
    active: true,
  },
  {
    id: "kscerato",
    nickname: "KSCERATO",
    fullName: "Kaike Cerato",
    nationality: "Brazil",
    region: "South America",
    roles: ["Rifler", "Lurker"],
    currentTeam: "furia",
    teams: ["furia"],
    majorsWon: 0,
    majorMvp: false,
    hltvTop20Years: [2020, 2021, 2022, 2023, 2024],
    active: true,
  },
  {
    id: "twistzz",
    nickname: "Twistzz",
    fullName: "Russel Van Dulken",
    nationality: "Canada",
    region: "North America",
    roles: ["Rifler"],
    currentTeam: "liquid",
    teams: ["liquid", "faze"],
    majorsWon: 1,
    majorMvp: false,
    hltvTop20Years: [2018, 2019, 2021, 2022, 2023],
    active: true,
  },
  {
    id: "ropz",
    nickname: "ropz",
    fullName: "Robin Kool",
    nationality: "Estonia",
    region: "Europe",
    roles: ["Rifler", "Lurker"],
    currentTeam: "faze",
    teams: ["faze", "mousesports"],
    majorsWon: 1,
    majorMvp: false,
    hltvTop20Years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
    active: true,
  },
  {
    id: "karrigan",
    nickname: "karrigan",
    fullName: "Finn Andersen",
    nationality: "Denmark",
    region: "Europe",
    roles: ["IGL", "Rifler"],
    currentTeam: "faze",
    teams: ["faze", "mousesports", "astralis"],
    majorsWon: 1,
    majorMvp: false,
    hltvTop20Years: [],
    active: true,
  },
  {
    id: "rain",
    nickname: "rain",
    fullName: "Havard Nygaard",
    nationality: "Norway",
    region: "Europe",
    roles: ["Rifler", "Entry fragger"],
    currentTeam: "faze",
    teams: ["faze"],
    majorsWon: 1,
    majorMvp: true,
    hltvTop20Years: [2017, 2022],
    active: true,
  },
  {
    id: "kennys",
    nickname: "kennyS",
    fullName: "Kenny Schrub",
    nationality: "France",
    region: "Europe",
    roles: ["AWPer"],
    teams: ["g2", "titan", "envy"],
    majorsWon: 1,
    majorMvp: true,
    hltvTop20Years: [2013, 2014, 2015, 2017],
    active: false,
  },
  {
    id: "olofmeister",
    nickname: "olofmeister",
    fullName: "Olof Kajbjer",
    nationality: "Sweden",
    region: "Europe",
    roles: ["Rifler", "Lurker"],
    teams: ["fnatic", "faze"],
    majorsWon: 2,
    majorMvp: false,
    hltvTop20Years: [2014, 2015, 2016, 2017],
    active: false,
  },
  {
    id: "flusha",
    nickname: "flusha",
    fullName: "Robin Ronnquist",
    nationality: "Sweden",
    region: "Europe",
    roles: ["Rifler", "Lurker"],
    teams: ["fnatic", "cloud9"],
    majorsWon: 3,
    majorMvp: false,
    hltvTop20Years: [2013, 2014, 2015, 2016],
    active: false,
  },
  {
    id: "shroud",
    nickname: "shroud",
    fullName: "Michael Grzesiek",
    nationality: "Canada",
    region: "North America",
    roles: ["Rifler"],
    teams: ["cloud9"],
    majorsWon: 0,
    majorMvp: false,
    hltvTop20Years: [],
    active: false,
  },
  {
    id: "stewie2k",
    nickname: "Stewie2K",
    fullName: "Jacky Yip",
    nationality: "United States",
    region: "North America",
    roles: ["Rifler", "Entry fragger"],
    teams: ["cloud9", "liquid"],
    majorsWon: 1,
    majorMvp: false,
    hltvTop20Years: [2018],
    active: true,
  },
  {
    id: "elige",
    nickname: "EliGE",
    fullName: "Jonathan Jablonowski",
    nationality: "United States",
    region: "North America",
    roles: ["Rifler"],
    teams: ["liquid", "complexity"],
    majorsWon: 0,
    majorMvp: false,
    hltvTop20Years: [2017, 2019, 2020, 2021, 2022, 2023],
    active: true,
  },
];

export const bingoCriteria: BingoCriterion[] = [
  { id: "team-navi", label: "NAVI", helper: "Jogou pela Natus Vincere", type: "team", value: "navi" },
  { id: "team-astralis", label: "Astralis", helper: "Jogou pela Astralis", type: "team", value: "astralis" },
  { id: "team-faze", label: "FaZe", helper: "Jogou pela FaZe Clan", type: "team", value: "faze" },
  { id: "team-g2", label: "G2", helper: "Jogou pela G2 Esports", type: "team", value: "g2" },
  { id: "team-vitality", label: "Vitality", helper: "Jogou pela Team Vitality", type: "team", value: "vitality" },
  { id: "team-liquid", label: "Liquid", helper: "Jogou pela Team Liquid", type: "team", value: "liquid" },
  { id: "team-furia", label: "FURIA", helper: "Jogou pela FURIA", type: "team", value: "furia" },
  { id: "team-fnatic", label: "Fnatic", helper: "Jogou pela Fnatic", type: "team", value: "fnatic" },
  { id: "nat-brazil", label: "Brasil", helper: "Jogador brasileiro", type: "nationality", value: "Brazil" },
  { id: "nat-denmark", label: "Dinamarca", helper: "Jogador dinamarquês", type: "nationality", value: "Denmark" },
  { id: "nat-france", label: "França", helper: "Jogador francês", type: "nationality", value: "France" },
  { id: "region-na", label: "NA", helper: "Representa a América do Norte", type: "region", value: "North America" },
  { id: "role-awper", label: "AWPer", helper: "Atua ou atuou como AWPer", type: "role", value: "AWPer" },
  { id: "role-igl", label: "IGL", helper: "Atua ou atuou como in-game leader", type: "role", value: "IGL" },
  { id: "role-lurker", label: "Lurker", helper: "Atua ou atuou como lurker", type: "role", value: "Lurker" },
  { id: "major-winner", label: "Major winner", helper: "Venceu pelo menos um Major", type: "achievement", value: "major-winner" },
  { id: "major-mvp", label: "Major MVP", helper: "Foi MVP de Major", type: "achievement", value: "major-mvp" },
  { id: "top20", label: "HLTV Top 20", helper: "Apareceu no Top 20 da HLTV", type: "achievement", value: "hltv-top20" },
  { id: "active", label: "Ativo", helper: "Ainda está ativo no cenário", type: "status", value: true },
];

export const teamNameById = csTeams.reduce<Record<string, string>>((acc, team) => {
  acc[team.id] = team.name;
  return acc;
}, {});

export const getTeamName = (teamId: string) => teamNameById[teamId] ?? teamId;

export const playerMatchesCriterion = (player: CsPlayer, criterion: BingoCriterion) => {
  switch (criterion.type) {
    case "team":
      return player.teams.includes(String(criterion.value));
    case "nationality":
      return player.nationality === criterion.value;
    case "region":
      return player.region === criterion.value;
    case "role":
      return player.roles.includes(String(criterion.value));
    case "achievement":
      if (criterion.value === "major-winner") return player.majorsWon > 0;
      if (criterion.value === "major-mvp") return player.majorMvp;
      if (criterion.value === "hltv-top20") return player.hltvTop20Years.length > 0;
      return false;
    case "status":
      return player.active === criterion.value;
    default:
      return false;
  }
};

export const playerMatchesCell = (
  player: CsPlayer,
  rowCriterion: BingoCriterion,
  columnCriterion: BingoCriterion
) => playerMatchesCriterion(player, rowCriterion) && playerMatchesCriterion(player, columnCriterion);
