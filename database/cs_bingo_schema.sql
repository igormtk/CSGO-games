BEGIN;

-- CS Bingo relational schema and seed data.
-- Use this file as a starting point for PostgreSQL/Supabase/Neon.
-- Seed gerado a partir de src/data/csBingoDatabase.ts (dados atualizados em out/2026).

CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT NOT NULL,
  founded INTEGER,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive'))
);

CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  nickname TEXT NOT NULL,
  full_name TEXT NOT NULL,
  nationality TEXT NOT NULL,
  region TEXT NOT NULL,
  majors_won INTEGER NOT NULL DEFAULT 0,
  major_mvp BOOLEAN NOT NULL DEFAULT FALSE,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS player_roles (
  player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  PRIMARY KEY (player_id, role)
);

CREATE TABLE IF NOT EXISTS player_teams (
  player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  PRIMARY KEY (player_id, team_id)
);

CREATE TABLE IF NOT EXISTS player_hltv_top20_years (
  player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  PRIMARY KEY (player_id, year)
);

CREATE TABLE IF NOT EXISTS coaches (
  id TEXT PRIMARY KEY,
  nickname TEXT NOT NULL,
  full_name TEXT NOT NULL,
  nationality TEXT NOT NULL,
  current_team_id TEXT REFERENCES teams(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS coach_teams (
  coach_id TEXT NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  PRIMARY KEY (coach_id, team_id)
);

CREATE TABLE IF NOT EXISTS bingo_criteria (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  helper TEXT NOT NULL,
  criterion_type TEXT NOT NULL,
  criterion_value TEXT NOT NULL
);

-- Campos mantidos pela sincronização semanal com o Liquipedia (scripts/sync-player-teams.mjs).
ALTER TABLE players ADD COLUMN IF NOT EXISTS current_team_id TEXT REFERENCES teams(id) ON DELETE SET NULL;
ALTER TABLE players ADD COLUMN IF NOT EXISTS current_team_name TEXT;
ALTER TABLE players ADD COLUMN IF NOT EXISTS liquipedia_page TEXT;
ALTER TABLE players ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE TABLE IF NOT EXISTS player_transfers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  from_team_name TEXT,
  to_team_name TEXT,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS player_transfers_player_id_idx ON player_transfers (player_id, detected_at DESC);

INSERT INTO teams (id, name, country, region, founded, status) VALUES
  ('navi', 'Natus Vincere', 'Ukraine', 'Europe/CIS', 2009, 'active'),
  ('astralis', 'Astralis', 'Denmark', 'Europe', 2016, 'active'),
  ('faze', 'FaZe Clan', 'International', 'International', 2010, 'active'),
  ('g2', 'G2 Esports', 'Germany', 'Europe', 2014, 'active'),
  ('vitality', 'Team Vitality', 'France', 'Europe', 2013, 'active'),
  ('liquid', 'Team Liquid', 'United States', 'North America', 2000, 'active'),
  ('furia', 'FURIA', 'Brazil', 'South America', 2017, 'active'),
  ('fnatic', 'Fnatic', 'United Kingdom', 'Europe', 2004, 'active'),
  ('mibr', 'MIBR', 'Brazil', 'South America', 2003, 'active'),
  ('cloud9', 'Cloud9', 'United States', 'North America', 2013, 'active'),
  ('spirit', 'Team Spirit', 'Russia', 'Europe/CIS', 2015, 'active'),
  ('mousesports', 'MOUZ', 'Germany', 'Europe', 2002, 'active'),
  ('falcons', 'Team Falcons', 'Saudi Arabia', 'Middle East', 2017, 'active'),
  ('mongolz', 'The MongolZ', 'Mongolia', 'Asia', 2020, 'active'),
  ('nip', 'Ninjas in Pyjamas', 'Sweden', 'Europe', 2000, 'active')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  country = EXCLUDED.country,
  region = EXCLUDED.region,
  founded = EXCLUDED.founded,
  status = EXCLUDED.status;

INSERT INTO players (id, nickname, full_name, nationality, region, majors_won, major_mvp, active, current_team_id, current_team_name) VALUES
  ('s1mple', 's1mple', 'Oleksandr Kostyliev', 'Ukraine', 'Europe/CIS', 1, TRUE, TRUE, 'navi', 'Natus Vincere'),
  ('zywoo', 'ZywOo', 'Mathieu Herbaut', 'France', 'Europe', 3, TRUE, TRUE, 'vitality', 'Team Vitality'),
  ('device', 'device', 'Nicolai Reedtz', 'Denmark', 'Europe', 4, TRUE, TRUE, 'astralis', 'Astralis'),
  ('dupreeh', 'dupreeh', 'Peter Rasmussen', 'Denmark', 'Europe', 5, FALSE, TRUE, NULL, NULL),
  ('niko', 'NiKo', 'Nikola Kovac', 'Bosnia and Herzegovina', 'Europe', 1, FALSE, TRUE, 'falcons', 'Team Falcons'),
  ('coldzera', 'coldzera', 'Marcelo David', 'Brazil', 'South America', 2, TRUE, TRUE, NULL, NULL),
  ('fallen', 'FalleN', 'Gabriel Toledo', 'Brazil', 'South America', 2, FALSE, TRUE, 'furia', 'FURIA'),
  ('kscerato', 'KSCERATO', 'Kaike Cerato', 'Brazil', 'South America', 0, FALSE, TRUE, 'furia', 'FURIA'),
  ('twistzz', 'Twistzz', 'Russel Van Dulken', 'Canada', 'North America', 1, FALSE, TRUE, 'liquid', 'Team Liquid'),
  ('ropz', 'ropz', 'Robin Kool', 'Estonia', 'Europe', 3, FALSE, TRUE, 'vitality', 'Team Vitality'),
  ('karrigan', 'karrigan', 'Finn Andersen', 'Denmark', 'Europe', 2, FALSE, TRUE, 'falcons', 'Team Falcons'),
  ('rain', 'rain', 'Havard Nygaard', 'Norway', 'Europe', 1, TRUE, TRUE, 'faze', 'FaZe Clan'),
  ('kennys', 'kennyS', 'Kenny Schrub', 'France', 'Europe', 1, TRUE, FALSE, NULL, NULL),
  ('olofmeister', 'olofmeister', 'Olof Kajbjer', 'Sweden', 'Europe', 2, FALSE, FALSE, NULL, NULL),
  ('flusha', 'flusha', 'Robin Ronnquist', 'Sweden', 'Europe', 3, FALSE, FALSE, NULL, NULL),
  ('shroud', 'shroud', 'Michael Grzesiek', 'Canada', 'North America', 0, FALSE, FALSE, NULL, NULL),
  ('stewie2k', 'Stewie2K', 'Jacky Yip', 'United States', 'North America', 1, FALSE, TRUE, NULL, NULL),
  ('elige', 'EliGE', 'Jonathan Jablonowski', 'United States', 'North America', 0, FALSE, TRUE, 'liquid', 'Team Liquid'),
  ('donk', 'donk', 'Danil Kryshkovets', 'Russia', 'Europe/CIS', 1, TRUE, TRUE, 'spirit', 'Team Spirit'),
  ('sh1ro', 'sh1ro', 'Dmitry Sokolov', 'Russia', 'Europe/CIS', 1, FALSE, TRUE, 'spirit', 'Team Spirit'),
  ('magixx', 'magixx', 'Boris Vorobyev', 'Russia', 'Europe/CIS', 1, FALSE, TRUE, 'spirit', 'Team Spirit'),
  ('zont1x', 'zont1x', 'Myroslav Plakhotja', 'Ukraine', 'Europe/CIS', 1, FALSE, TRUE, 'spirit', 'Team Spirit'),
  ('m0nesy', 'm0NESY', 'Ilya Osipov', 'Russia', 'Europe/CIS', 1, TRUE, TRUE, 'falcons', 'Team Falcons'),
  ('kyousuke', 'kyousuke', 'Maksim Lukin', 'Russia', 'Europe/CIS', 1, FALSE, TRUE, 'falcons', 'Team Falcons'),
  ('teses', 'TeSeS', 'René Madsen', 'Denmark', 'Europe', 1, FALSE, TRUE, 'falcons', 'Team Falcons'),
  ('molodoy', 'molodoy', 'Danil Golubenko', 'Kazakhstan', 'Europe/CIS', 0, FALSE, TRUE, 'furia', 'FURIA'),
  ('yekindar', 'YEKINDAR', 'Mareks Gaļinskis', 'Latvia', 'Europe', 0, FALSE, TRUE, 'furia', 'FURIA'),
  ('yuurih', 'yuurih', 'Yuri Boian', 'Brazil', 'South America', 0, FALSE, TRUE, 'furia', 'FURIA'),
  ('apex', 'apEX', 'Dan Madesclaire', 'France', 'Europe', 4, FALSE, TRUE, 'vitality', 'Team Vitality'),
  ('flamez', 'flameZ', 'Shahar Shushan', 'Israel', 'Europe', 2, FALSE, TRUE, 'vitality', 'Team Vitality'),
  ('mezii', 'mezii', 'William Merriman', 'United Kingdom', 'Europe', 2, FALSE, TRUE, 'vitality', 'Team Vitality'),
  ('spinx', 'Spinx', 'Lotan Giladi', 'Israel', 'Europe', 0, FALSE, TRUE, 'mousesports', 'MOUZ'),
  ('torzsi', 'torzsi', 'Ádám Torzsás', 'Hungary', 'Europe', 0, FALSE, TRUE, 'mousesports', 'MOUZ'),
  ('xertion', 'xertioN', 'Dorian Berman', 'Israel', 'Europe', 0, FALSE, TRUE, 'mousesports', 'MOUZ'),
  ('frozen', 'frozen', 'David Čerňanský', 'Slovakia', 'Europe', 0, FALSE, TRUE, NULL, NULL),
  ('b1t', 'b1t', 'Valerii Vakhovskyi', 'Ukraine', 'Europe/CIS', 1, FALSE, TRUE, 'navi', 'Natus Vincere'),
  ('im', 'iM', 'Mihai Ivan', 'Romania', 'Europe', 1, FALSE, TRUE, 'navi', 'Natus Vincere'),
  ('w0nderful', 'w0nderful', 'Ihor Zhdanov', 'Ukraine', 'Europe/CIS', 1, FALSE, TRUE, 'navi', 'Natus Vincere'),
  ('aleksib', 'Aleksib', 'Aleksi Virolainen', 'Finland', 'Europe', 1, FALSE, TRUE, 'navi', 'Natus Vincere'),
  ('jl', 'jL', 'Justinas Lekavičius', 'Lithuania', 'Europe', 1, TRUE, TRUE, NULL, NULL),
  ('senzu', 'Senzu', 'Azbayar Munkhbold', 'Mongolia', 'Asia', 0, FALSE, TRUE, NULL, NULL),
  ('blitz', 'bLitz', 'Garidmagnai Byambasuren', 'Mongolia', 'Asia', 0, FALSE, TRUE, 'mongolz', 'The MongolZ')
ON CONFLICT (id) DO UPDATE SET
  nickname = EXCLUDED.nickname,
  full_name = EXCLUDED.full_name,
  nationality = EXCLUDED.nationality,
  region = EXCLUDED.region,
  majors_won = EXCLUDED.majors_won,
  major_mvp = EXCLUDED.major_mvp;

INSERT INTO player_roles (player_id, role) VALUES
  ('s1mple', 'AWPer'),
  ('s1mple', 'Rifler'),
  ('zywoo', 'AWPer'),
  ('zywoo', 'Rifler'),
  ('device', 'AWPer'),
  ('dupreeh', 'Rifler'),
  ('dupreeh', 'Entry fragger'),
  ('niko', 'Rifler'),
  ('niko', 'Entry fragger'),
  ('coldzera', 'Rifler'),
  ('coldzera', 'Lurker'),
  ('fallen', 'AWPer'),
  ('fallen', 'IGL'),
  ('kscerato', 'Rifler'),
  ('kscerato', 'Lurker'),
  ('twistzz', 'Rifler'),
  ('ropz', 'Rifler'),
  ('ropz', 'Lurker'),
  ('karrigan', 'IGL'),
  ('karrigan', 'Rifler'),
  ('rain', 'Rifler'),
  ('rain', 'Entry fragger'),
  ('kennys', 'AWPer'),
  ('olofmeister', 'Rifler'),
  ('olofmeister', 'Lurker'),
  ('flusha', 'Rifler'),
  ('flusha', 'Lurker'),
  ('shroud', 'Rifler'),
  ('stewie2k', 'Rifler'),
  ('stewie2k', 'Entry fragger'),
  ('elige', 'Rifler'),
  ('donk', 'Rifler'),
  ('donk', 'Entry fragger'),
  ('sh1ro', 'AWPer'),
  ('magixx', 'Rifler'),
  ('zont1x', 'Rifler'),
  ('m0nesy', 'AWPer'),
  ('kyousuke', 'Rifler'),
  ('teses', 'Rifler'),
  ('molodoy', 'AWPer'),
  ('yekindar', 'Rifler'),
  ('yekindar', 'Entry fragger'),
  ('yuurih', 'Rifler'),
  ('apex', 'IGL'),
  ('apex', 'Entry fragger'),
  ('flamez', 'Rifler'),
  ('flamez', 'Entry fragger'),
  ('mezii', 'Rifler'),
  ('spinx', 'Rifler'),
  ('spinx', 'Lurker'),
  ('torzsi', 'AWPer'),
  ('xertion', 'Rifler'),
  ('xertion', 'Entry fragger'),
  ('frozen', 'Rifler'),
  ('b1t', 'Rifler'),
  ('im', 'Rifler'),
  ('w0nderful', 'AWPer'),
  ('aleksib', 'IGL'),
  ('jl', 'Rifler'),
  ('senzu', 'Rifler'),
  ('blitz', 'IGL')
ON CONFLICT DO NOTHING;

INSERT INTO player_teams (player_id, team_id) VALUES
  ('s1mple', 'navi'),
  ('s1mple', 'liquid'),
  ('zywoo', 'vitality'),
  ('device', 'astralis'),
  ('device', 'nip'),
  ('dupreeh', 'astralis'),
  ('dupreeh', 'vitality'),
  ('dupreeh', 'falcons'),
  ('niko', 'faze'),
  ('niko', 'g2'),
  ('niko', 'mousesports'),
  ('niko', 'falcons'),
  ('coldzera', 'mibr'),
  ('coldzera', 'faze'),
  ('fallen', 'furia'),
  ('fallen', 'mibr'),
  ('fallen', 'liquid'),
  ('kscerato', 'furia'),
  ('twistzz', 'liquid'),
  ('twistzz', 'faze'),
  ('ropz', 'faze'),
  ('ropz', 'mousesports'),
  ('ropz', 'vitality'),
  ('karrigan', 'faze'),
  ('karrigan', 'mousesports'),
  ('karrigan', 'astralis'),
  ('karrigan', 'falcons'),
  ('rain', 'faze'),
  ('kennys', 'g2'),
  ('olofmeister', 'fnatic'),
  ('olofmeister', 'faze'),
  ('flusha', 'fnatic'),
  ('flusha', 'cloud9'),
  ('shroud', 'cloud9'),
  ('stewie2k', 'cloud9'),
  ('stewie2k', 'liquid'),
  ('elige', 'liquid'),
  ('donk', 'spirit'),
  ('sh1ro', 'cloud9'),
  ('sh1ro', 'spirit'),
  ('magixx', 'spirit'),
  ('zont1x', 'spirit'),
  ('m0nesy', 'g2'),
  ('m0nesy', 'falcons'),
  ('kyousuke', 'falcons'),
  ('teses', 'falcons'),
  ('molodoy', 'furia'),
  ('yekindar', 'liquid'),
  ('yekindar', 'furia'),
  ('yuurih', 'furia'),
  ('apex', 'vitality'),
  ('flamez', 'vitality'),
  ('mezii', 'vitality'),
  ('spinx', 'vitality'),
  ('spinx', 'mousesports'),
  ('torzsi', 'mousesports'),
  ('xertion', 'mousesports'),
  ('frozen', 'mousesports'),
  ('frozen', 'faze'),
  ('b1t', 'navi'),
  ('im', 'navi'),
  ('w0nderful', 'navi'),
  ('aleksib', 'g2'),
  ('aleksib', 'nip'),
  ('aleksib', 'navi'),
  ('jl', 'navi'),
  ('senzu', 'mongolz'),
  ('blitz', 'mongolz')
ON CONFLICT DO NOTHING;

INSERT INTO player_hltv_top20_years (player_id, year) VALUES
  ('s1mple', 2016),
  ('s1mple', 2017),
  ('s1mple', 2018),
  ('s1mple', 2019),
  ('s1mple', 2020),
  ('s1mple', 2021),
  ('s1mple', 2022),
  ('zywoo', 2019),
  ('zywoo', 2020),
  ('zywoo', 2021),
  ('zywoo', 2022),
  ('zywoo', 2023),
  ('zywoo', 2024),
  ('zywoo', 2025),
  ('device', 2014),
  ('device', 2015),
  ('device', 2016),
  ('device', 2017),
  ('device', 2018),
  ('device', 2019),
  ('device', 2020),
  ('device', 2021),
  ('device', 2023),
  ('dupreeh', 2013),
  ('dupreeh', 2014),
  ('dupreeh', 2015),
  ('dupreeh', 2017),
  ('dupreeh', 2018),
  ('dupreeh', 2019),
  ('niko', 2016),
  ('niko', 2017),
  ('niko', 2018),
  ('niko', 2019),
  ('niko', 2020),
  ('niko', 2021),
  ('niko', 2022),
  ('niko', 2023),
  ('niko', 2024),
  ('niko', 2025),
  ('coldzera', 2016),
  ('coldzera', 2017),
  ('coldzera', 2018),
  ('fallen', 2016),
  ('fallen', 2017),
  ('kscerato', 2020),
  ('kscerato', 2021),
  ('kscerato', 2022),
  ('kscerato', 2023),
  ('kscerato', 2024),
  ('kscerato', 2025),
  ('twistzz', 2018),
  ('twistzz', 2019),
  ('twistzz', 2021),
  ('twistzz', 2022),
  ('twistzz', 2023),
  ('twistzz', 2025),
  ('ropz', 2018),
  ('ropz', 2019),
  ('ropz', 2020),
  ('ropz', 2021),
  ('ropz', 2022),
  ('ropz', 2023),
  ('ropz', 2024),
  ('ropz', 2025),
  ('rain', 2017),
  ('rain', 2022),
  ('kennys', 2013),
  ('kennys', 2014),
  ('kennys', 2015),
  ('kennys', 2017),
  ('olofmeister', 2014),
  ('olofmeister', 2015),
  ('olofmeister', 2016),
  ('olofmeister', 2017),
  ('flusha', 2013),
  ('flusha', 2014),
  ('flusha', 2015),
  ('flusha', 2016),
  ('stewie2k', 2018),
  ('elige', 2017),
  ('elige', 2019),
  ('elige', 2020),
  ('elige', 2021),
  ('elige', 2022),
  ('elige', 2023),
  ('donk', 2024),
  ('donk', 2025),
  ('sh1ro', 2021),
  ('sh1ro', 2022),
  ('sh1ro', 2024),
  ('sh1ro', 2025),
  ('m0nesy', 2022),
  ('m0nesy', 2023),
  ('m0nesy', 2024),
  ('m0nesy', 2025),
  ('molodoy', 2025),
  ('yekindar', 2021),
  ('yekindar', 2025),
  ('flamez', 2025),
  ('mezii', 2025),
  ('spinx', 2025),
  ('torzsi', 2025),
  ('xertion', 2025),
  ('frozen', 2025),
  ('b1t', 2025),
  ('im', 2025),
  ('jl', 2024),
  ('senzu', 2025)
ON CONFLICT DO NOTHING;

INSERT INTO coaches (id, nickname, full_name, nationality, current_team_id) VALUES
  ('zonic', 'zonic', 'Danny Sørensen', 'Denmark', 'falcons'),
  ('hally', 'hally', 'Sergey Shavaev', 'Russia', 'spirit'),
  ('xtqzzz', 'XTQZZZ', 'Rémy Quoniam', 'France', 'vitality'),
  ('sidde', 'sidde', 'Sidnei Macedo', 'Brazil', 'furia'),
  ('sycrone', 'sycrone', 'Dennis Nielsen', 'Denmark', 'mousesports'),
  ('saw', 'sAw', 'Eetu Saha', 'Finland', 'g2'),
  ('flashie', 'flashie', 'Viktor Tamás Bea', 'Hungary', 'liquid'),
  ('maaraa', 'maaRaa', 'Erdenedalai Bayanbat', 'Mongolia', 'mongolz')
ON CONFLICT (id) DO UPDATE SET
  nickname = EXCLUDED.nickname,
  full_name = EXCLUDED.full_name,
  nationality = EXCLUDED.nationality,
  current_team_id = EXCLUDED.current_team_id;

INSERT INTO coach_teams (coach_id, team_id) VALUES
  ('zonic', 'astralis'),
  ('zonic', 'falcons'),
  ('hally', 'spirit'),
  ('xtqzzz', 'vitality'),
  ('sidde', 'furia'),
  ('sycrone', 'mousesports'),
  ('saw', 'g2'),
  ('flashie', 'liquid'),
  ('maaraa', 'mongolz')
ON CONFLICT DO NOTHING;

INSERT INTO bingo_criteria (id, label, helper, criterion_type, criterion_value) VALUES
  ('team-navi', 'NAVI', 'Jogou pela Natus Vincere', 'team', 'navi'),
  ('team-astralis', 'Astralis', 'Jogou pela Astralis', 'team', 'astralis'),
  ('team-faze', 'FaZe', 'Jogou pela FaZe Clan', 'team', 'faze'),
  ('team-g2', 'G2', 'Jogou pela G2 Esports', 'team', 'g2'),
  ('team-vitality', 'Vitality', 'Jogou pela Team Vitality', 'team', 'vitality'),
  ('team-liquid', 'Liquid', 'Jogou pela Team Liquid', 'team', 'liquid'),
  ('team-furia', 'FURIA', 'Jogou pela FURIA', 'team', 'furia'),
  ('team-fnatic', 'Fnatic', 'Jogou pela Fnatic', 'team', 'fnatic'),
  ('team-spirit', 'Spirit', 'Jogou pela Team Spirit', 'team', 'spirit'),
  ('team-mouz', 'MOUZ', 'Jogou pela MOUZ', 'team', 'mousesports'),
  ('team-falcons', 'Falcons', 'Jogou pela Team Falcons', 'team', 'falcons'),
  ('team-cloud9', 'Cloud9', 'Jogou pela Cloud9', 'team', 'cloud9'),
  ('nat-brazil', 'Brasil', 'Jogador brasileiro', 'nationality', 'Brazil'),
  ('nat-denmark', 'Dinamarca', 'Jogador dinamarquês', 'nationality', 'Denmark'),
  ('nat-france', 'França', 'Jogador francês', 'nationality', 'France'),
  ('nat-russia', 'Rússia', 'Jogador russo', 'nationality', 'Russia'),
  ('nat-ukraine', 'Ucrânia', 'Jogador ucraniano', 'nationality', 'Ukraine'),
  ('nat-israel', 'Israel', 'Jogador israelense', 'nationality', 'Israel'),
  ('region-na', 'NA', 'Representa a América do Norte', 'region', 'North America'),
  ('role-awper', 'AWPer', 'Atua ou atuou como AWPer', 'role', 'AWPer'),
  ('role-igl', 'IGL', 'Atua ou atuou como in-game leader', 'role', 'IGL'),
  ('role-lurker', 'Lurker', 'Atua ou atuou como lurker', 'role', 'Lurker'),
  ('role-entry', 'Entry fragger', 'Atua ou atuou como entry fragger', 'role', 'Entry fragger'),
  ('major-winner', 'Major winner', 'Venceu pelo menos um Major', 'achievement', 'major-winner'),
  ('major-mvp', 'Major MVP', 'Foi MVP de Major', 'achievement', 'major-mvp'),
  ('top20', 'HLTV Top 20', 'Apareceu no Top 20 da HLTV', 'achievement', 'hltv-top20'),
  ('multi-major', '2+ Majors', 'Venceu dois Majors ou mais', 'achievement', 'multi-major'),
  ('no-major', 'Sem Major', 'Nunca venceu um Major', 'achievement', 'no-major'),
  ('top20-5', 'Top 20 5+ vezes', 'Entrou no Top 20 da HLTV em cinco anos ou mais', 'achievement', 'hltv-top20-5'),
  ('teams-3', '3+ times', 'Passou por três times ou mais', 'achievement', 'teams-3'),
  ('active', 'Ativo', 'Ainda está ativo no cenário', 'status', 'true'),
  ('retired', 'Aposentado', 'Não joga mais profissionalmente', 'status', 'false')
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  helper = EXCLUDED.helper,
  criterion_type = EXCLUDED.criterion_type,
  criterion_value = EXCLUDED.criterion_value;

-- Segurança para o Supabase: qualquer visitante pode ler, ninguém escreve pela chave pública.
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "teams_public_read" ON teams;
CREATE POLICY "teams_public_read" ON teams FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "players_public_read" ON players;
CREATE POLICY "players_public_read" ON players FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE player_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "player_roles_public_read" ON player_roles;
CREATE POLICY "player_roles_public_read" ON player_roles FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE player_teams ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "player_teams_public_read" ON player_teams;
CREATE POLICY "player_teams_public_read" ON player_teams FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE player_hltv_top20_years ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "player_hltv_top20_years_public_read" ON player_hltv_top20_years;
CREATE POLICY "player_hltv_top20_years_public_read" ON player_hltv_top20_years FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "coaches_public_read" ON coaches;
CREATE POLICY "coaches_public_read" ON coaches FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE coach_teams ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "coach_teams_public_read" ON coach_teams;
CREATE POLICY "coach_teams_public_read" ON coach_teams FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE bingo_criteria ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "bingo_criteria_public_read" ON bingo_criteria;
CREATE POLICY "bingo_criteria_public_read" ON bingo_criteria FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE player_transfers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "player_transfers_public_read" ON player_transfers;
CREATE POLICY "player_transfers_public_read" ON player_transfers FOR SELECT TO anon, authenticated USING (true);

COMMIT;
