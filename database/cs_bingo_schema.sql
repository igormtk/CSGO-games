-- CS Bingo relational schema and seed data.
-- Use this file as a starting point for PostgreSQL/Supabase/Neon.

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

CREATE TABLE IF NOT EXISTS bingo_criteria (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  helper TEXT NOT NULL,
  criterion_type TEXT NOT NULL,
  criterion_value TEXT NOT NULL
);

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
  ('cloud9', 'Cloud9', 'United States', 'North America', 2013, 'active')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  country = EXCLUDED.country,
  region = EXCLUDED.region,
  founded = EXCLUDED.founded,
  status = EXCLUDED.status;

INSERT INTO players (id, nickname, full_name, nationality, region, majors_won, major_mvp, active) VALUES
  ('s1mple', 's1mple', 'Oleksandr Kostyliev', 'Ukraine', 'Europe/CIS', 1, TRUE, TRUE),
  ('zywoo', 'ZywOo', 'Mathieu Herbaut', 'France', 'Europe', 1, TRUE, TRUE),
  ('device', 'device', 'Nicolai Reedtz', 'Denmark', 'Europe', 4, TRUE, TRUE),
  ('dupreeh', 'dupreeh', 'Peter Rasmussen', 'Denmark', 'Europe', 5, FALSE, TRUE),
  ('niko', 'NiKo', 'Nikola Kovac', 'Bosnia and Herzegovina', 'Europe', 0, FALSE, TRUE),
  ('coldzera', 'coldzera', 'Marcelo David', 'Brazil', 'South America', 2, TRUE, TRUE),
  ('fallen', 'FalleN', 'Gabriel Toledo', 'Brazil', 'South America', 2, FALSE, TRUE),
  ('kscerato', 'KSCERATO', 'Kaike Cerato', 'Brazil', 'South America', 0, FALSE, TRUE),
  ('twistzz', 'Twistzz', 'Russel Van Dulken', 'Canada', 'North America', 1, FALSE, TRUE),
  ('ropz', 'ropz', 'Robin Kool', 'Estonia', 'Europe', 1, FALSE, TRUE),
  ('karrigan', 'karrigan', 'Finn Andersen', 'Denmark', 'Europe', 1, FALSE, TRUE),
  ('rain', 'rain', 'Havard Nygaard', 'Norway', 'Europe', 1, TRUE, TRUE),
  ('kennys', 'kennyS', 'Kenny Schrub', 'France', 'Europe', 1, TRUE, FALSE),
  ('olofmeister', 'olofmeister', 'Olof Kajbjer', 'Sweden', 'Europe', 2, FALSE, FALSE),
  ('flusha', 'flusha', 'Robin Ronnquist', 'Sweden', 'Europe', 3, FALSE, FALSE),
  ('shroud', 'shroud', 'Michael Grzesiek', 'Canada', 'North America', 0, FALSE, FALSE),
  ('stewie2k', 'Stewie2K', 'Jacky Yip', 'United States', 'North America', 1, FALSE, TRUE),
  ('elige', 'EliGE', 'Jonathan Jablonowski', 'United States', 'North America', 0, FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
  nickname = EXCLUDED.nickname,
  full_name = EXCLUDED.full_name,
  nationality = EXCLUDED.nationality,
  region = EXCLUDED.region,
  majors_won = EXCLUDED.majors_won,
  major_mvp = EXCLUDED.major_mvp,
  active = EXCLUDED.active;

INSERT INTO player_roles (player_id, role) VALUES
  ('s1mple', 'AWPer'), ('s1mple', 'Rifler'),
  ('zywoo', 'AWPer'), ('zywoo', 'Rifler'),
  ('device', 'AWPer'),
  ('dupreeh', 'Rifler'), ('dupreeh', 'Entry fragger'),
  ('niko', 'Rifler'), ('niko', 'Entry fragger'),
  ('coldzera', 'Rifler'), ('coldzera', 'Lurker'),
  ('fallen', 'AWPer'), ('fallen', 'IGL'),
  ('kscerato', 'Rifler'), ('kscerato', 'Lurker'),
  ('twistzz', 'Rifler'),
  ('ropz', 'Rifler'), ('ropz', 'Lurker'),
  ('karrigan', 'IGL'), ('karrigan', 'Rifler'),
  ('rain', 'Rifler'), ('rain', 'Entry fragger'),
  ('kennys', 'AWPer'),
  ('olofmeister', 'Rifler'), ('olofmeister', 'Lurker'),
  ('flusha', 'Rifler'), ('flusha', 'Lurker'),
  ('shroud', 'Rifler'),
  ('stewie2k', 'Rifler'), ('stewie2k', 'Entry fragger'),
  ('elige', 'Rifler')
ON CONFLICT DO NOTHING;

INSERT INTO player_teams (player_id, team_id) VALUES
  ('s1mple', 'navi'), ('s1mple', 'liquid'),
  ('zywoo', 'vitality'),
  ('device', 'astralis'),
  ('dupreeh', 'astralis'), ('dupreeh', 'vitality'),
  ('niko', 'faze'), ('niko', 'g2'),
  ('coldzera', 'mibr'), ('coldzera', 'faze'),
  ('fallen', 'furia'), ('fallen', 'mibr'), ('fallen', 'liquid'),
  ('kscerato', 'furia'),
  ('twistzz', 'liquid'), ('twistzz', 'faze'),
  ('ropz', 'faze'),
  ('karrigan', 'faze'), ('karrigan', 'astralis'),
  ('rain', 'faze'),
  ('kennys', 'g2'),
  ('olofmeister', 'fnatic'), ('olofmeister', 'faze'),
  ('flusha', 'fnatic'), ('flusha', 'cloud9'),
  ('shroud', 'cloud9'),
  ('stewie2k', 'cloud9'), ('stewie2k', 'liquid'),
  ('elige', 'liquid')
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
  ('nat-brazil', 'Brasil', 'Jogador brasileiro', 'nationality', 'Brazil'),
  ('nat-denmark', 'Dinamarca', 'Jogador dinamarquês', 'nationality', 'Denmark'),
  ('nat-france', 'França', 'Jogador francês', 'nationality', 'France'),
  ('region-na', 'NA', 'Representa a América do Norte', 'region', 'North America'),
  ('role-awper', 'AWPer', 'Atua ou atuou como AWPer', 'role', 'AWPer'),
  ('role-igl', 'IGL', 'Atua ou atuou como in-game leader', 'role', 'IGL'),
  ('role-lurker', 'Lurker', 'Atua ou atuou como lurker', 'role', 'Lurker'),
  ('major-winner', 'Major winner', 'Venceu pelo menos um Major', 'achievement', 'major-winner'),
  ('major-mvp', 'Major MVP', 'Foi MVP de Major', 'achievement', 'major-mvp'),
  ('top20', 'HLTV Top 20', 'Apareceu no Top 20 da HLTV', 'achievement', 'hltv-top20'),
  ('active', 'Ativo', 'Ainda está ativo no cenário', 'status', 'true')
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  helper = EXCLUDED.helper,
  criterion_type = EXCLUDED.criterion_type,
  criterion_value = EXCLUDED.criterion_value;
