import type { Language } from "@/lib/i18n";

// Título e descrição de cada página nos três idiomas: vão no <title>, na meta description, no
// Open Graph e nos dados estruturados de /pt/..., /es/... e do endereço em inglês.
type Localized = Record<Language, string>;

export type PageSeo = { path: string; title: Localized; description: Localized; keywords?: string[] };

export const pageSeo = {
  home: {
    path: "/",
    title: {
      en: "CS Games · Daily Counter-Strike games",
      pt: "CS Games · Jogos diários de Counter-Strike",
      es: "CS Games · Juegos diarios de Counter-Strike",
    },
    description: {
      en: "Daily Counter-Strike games: CS Bingo, mystery player, career path, lineup, Sort the 16, 60 seconds and Higher or lower. Free, no sign-up.",
      pt: "Jogos diários de Counter-Strike: CS Bingo, jogador misterioso, caminho de carreira, escalação, Agrupe os 16, 60 segundos e Mais ou menos. Grátis e sem cadastro.",
      es: "Juegos diarios de Counter-Strike: CS Bingo, jugador misterioso, camino de carrera, alineación, Agrupa los 16, 60 segundos y Más o menos. Gratis y sin registro.",
    },
    keywords: ["Counter-Strike", "CS2", "CS:GO", "daily games", "CS quiz", "jogos de CS", "juegos de CS", "pro players", "HLTV", "Major"],
  },
  bingo: {
    path: "/bingo",
    title: { en: "Daily CS Bingo", pt: "CS Bingo diário", es: "CS Bingo diario" },
    description: {
      en: "Fit 16 Counter-Strike pro players into today's board: teams, nationalities, roles and Majors. One attempt per day, the same board for everyone.",
      pt: "Encaixe 16 pro players de Counter-Strike na cartela do dia: times, nacionalidades, funções e Majors. Uma tentativa por dia, a mesma cartela para todo mundo.",
      es: "Coloca 16 pro players de Counter-Strike en el cartón del día: equipos, nacionalidades, roles y Majors. Un intento por día, el mismo cartón para todos.",
    },
    keywords: ["CS Bingo", "Counter-Strike bingo", "bingo de CS", "CS2", "daily game", "pro players", "HLTV", "Major"],
  },
  multiplayer: {
    path: "/bingo/multiplayer",
    title: { en: "CS Bingo multiplayer", pt: "CS Bingo multiplayer", es: "CS Bingo multijugador" },
    description: {
      en: "Play CS Bingo against your friends: create a room, share the code and race on the same Counter-Strike pro player board in real time.",
      pt: "Jogue CS Bingo contra os amigos: crie uma sala, mande o código e disputem a mesma cartela de pro players de Counter-Strike em tempo real.",
      es: "Juega CS Bingo contra tus amigos: crea una sala, comparte el código y compitan en el mismo cartón de pro players de Counter-Strike en tiempo real.",
    },
    keywords: ["CS Bingo multiplayer", "Counter-Strike game with friends", "jogo de CS com amigos", "CS2 quiz"],
  },
  mystery: {
    path: "/jogador-misterioso",
    title: { en: "Mystery player", pt: "Jogador misterioso", es: "Jugador misterioso" },
    description: {
      en: "Find today's Counter-Strike pro player in 6 guesses. Each guess reveals clues about team, country, role, Majors and HLTV Top 20.",
      pt: "Descubra o pro player de Counter-Strike do dia em 6 palpites. Cada palpite dá pistas de time, país, função, Majors e Top 20 da HLTV.",
      es: "Descubre al pro player de Counter-Strike del día en 6 intentos. Cada intento da pistas de equipo, país, rol, Majors y Top 20 de HLTV.",
    },
    keywords: ["mystery player", "guess the CS pro player", "jogador misterioso", "adivinhe o jogador de CS", "CS2", "HLTV Top 20"],
  },
  careerPath: {
    path: "/career-path",
    title: { en: "Career path", pt: "Caminho de carreira", es: "Camino de carrera" },
    description: {
      en: "Daily Counter-Strike challenge: see the teams a pro player has played for, in order, and guess who it is in 6 tries.",
      pt: "Desafio diário de Counter-Strike: veja os times por onde um pro player passou, em ordem, e descubra quem é em 6 tentativas.",
      es: "Desafío diario de Counter-Strike: mira los equipos por los que pasó un pro player, en orden, y adivina quién es en 6 intentos.",
    },
    keywords: ["CS career path", "guess the CS pro player", "caminho de carreira", "Counter-Strike teams quiz", "CS2 daily game"],
  },
  guessName: {
    path: "/guess-name",
    title: { en: "Guess the player", pt: "Adivinhe o jogador", es: "Adivina el jugador" },
    description: {
      en: "Daily challenge: 20 Counter-Strike pro players and 10 seconds each to pick their real name from 4 options. One attempt per day.",
      pt: "Desafio diário: 20 pro players de Counter-Strike e 10 segundos para escolher o nome real de cada um entre 4 opções. Uma tentativa por dia.",
      es: "Desafío diario: 20 pro players de Counter-Strike y 10 segundos para elegir el nombre real de cada uno entre 4 opciones. Un intento por día.",
    },
    keywords: ["pro players real names", "nome real dos pro players", "Counter-Strike quiz", "CS2", "guess the player"],
  },
  lineup: {
    path: "/lineup",
    title: { en: "Lineup", pt: "Escalação", es: "Alineación" },
    description: {
      en: "Daily Counter-Strike challenge: one team a day, name 5 pro players who have played for it. Three misses allowed.",
      pt: "Desafio diário de Counter-Strike: um time por dia, cite 5 pro players que já jogaram nele. Vale errar 3 vezes.",
      es: "Desafío diario de Counter-Strike: un equipo por día, nombra 5 pro players que jugaron en él. Puedes fallar 3 veces.",
    },
    keywords: ["Counter-Strike lineup quiz", "CS2 teams quiz", "escalação de CS", "name the players", "daily CS game"],
  },
  groups: {
    path: "/groups",
    title: { en: "Sort the 16", pt: "Agrupe os 16", es: "Agrupa los 16" },
    description: {
      en: "Daily Counter-Strike puzzle: sort 16 pro players into 4 groups of 4 that share a team, country, role or achievement. Four mistakes allowed.",
      pt: "Quebra-cabeça diário de Counter-Strike: separe 16 pro players em 4 grupos de 4 que têm algo em comum, como time, país, função ou conquista. Vale errar 4 vezes.",
      es: "Rompecabezas diario de Counter-Strike: separa 16 pro players en 4 grupos de 4 que comparten equipo, país, rol o logro. Puedes fallar 4 veces.",
    },
    keywords: ["Counter-Strike puzzle", "CS2 groups game", "connections CS", "pro players quiz", "daily CS game"],
  },
  sixtySeconds: {
    path: "/60-seconds",
    title: { en: "60 seconds", pt: "60 segundos", es: "60 segundos" },
    description: {
      en: "Daily Counter-Strike speed quiz: one theme a day and 60 seconds to name as many matching pro players as you can remember.",
      pt: "Quiz relâmpago diário de Counter-Strike: um tema por dia e 60 segundos para citar o máximo de pro players que se encaixam nele.",
      es: "Quiz relámpago diario de Counter-Strike: un tema por día y 60 segundos para nombrar todos los pro players que encajan en él.",
    },
    keywords: ["Counter-Strike quiz", "CS2 speed quiz", "name the pro players", "quiz de CS", "daily CS game"],
  },
  higherLower: {
    path: "/higher-or-lower",
    title: { en: "Higher or lower", pt: "Mais ou menos", es: "Más o menos" },
    description: {
      en: "Endless Counter-Strike game: two pro players, guess who has more Major titles or more years in the HLTV Top 20. Keep the streak going.",
      pt: "Jogo infinito de Counter-Strike: dois pro players, adivinhe quem tem mais títulos de Major ou mais anos no Top 20 da HLTV. Mantenha a sequência.",
      es: "Juego infinito de Counter-Strike: dos pro players, adivina quién tiene más títulos de Major o más años en el Top 20 de HLTV. Mantén la racha.",
    },
    keywords: ["higher or lower", "mais ou menos CS", "Counter-Strike quiz", "CS2", "pro players stats game"],
  },
  archive: {
    path: "/archive",
    title: { en: "Challenge archive", pt: "Arquivo de desafios", es: "Archivo de desafíos" },
    description: {
      en: "Play past daily challenges of CS Bingo, Mystery player, Career path, Guess the player, Lineup, Sort the 16 and 60 seconds. Every day since January 2026.",
      pt: "Jogue os desafios diários anteriores do CS Bingo, Jogador misterioso, Caminho de carreira, Adivinhe o jogador, Escalação, Agrupe os 16 e 60 segundos. Todos os dias desde janeiro de 2026.",
      es: "Juega los desafíos diarios anteriores de CS Bingo, Jugador misterioso, Camino de carrera, Adivina el jugador, Alineación, Agrupa los 16 y 60 segundos. Todos los días desde enero de 2026.",
    },
  },
  guides: {
    path: "/guides",
    title: { en: "Guides and stats", pt: "Guias e estatísticas", es: "Guías y estadísticas" },
    description: {
      en: "Strategy guides for every CS Games daily game and stats lists from the Counter-Strike pro scene.",
      pt: "Guias de estratégia para cada jogo diário do CS Games e listas de estatísticas da cena profissional de Counter-Strike.",
      es: "Guías de estrategia para cada juego diario de CS Games y listas de estadísticas de la escena profesional de Counter-Strike.",
    },
  },
  about: {
    path: "/about",
    title: { en: "About", pt: "Sobre", es: "Acerca de" },
    description: {
      en: "Who makes CS Games, where the Counter-Strike data comes from and how the daily challenges work.",
      pt: "Quem faz o CS Games, de onde vêm os dados de Counter-Strike e como funcionam os desafios diários.",
      es: "Quién hace CS Games, de dónde salen los datos de Counter-Strike y cómo funcionan los desafíos diarios.",
    },
  },
  privacy: {
    path: "/privacidade",
    title: { en: "Privacy policy", pt: "Política de privacidade", es: "Política de privacidad" },
    description: {
      en: "What data CS Games uses and why: local storage, anonymous metrics and ads.",
      pt: "Quais dados o CS Games usa e por quê: armazenamento local, métricas anônimas e anúncios.",
      es: "Qué datos usa CS Games y por qué: almacenamiento local, métricas anónimas y anuncios.",
    },
  },
  terms: {
    path: "/termos",
    title: { en: "Terms of use", pt: "Termos de uso", es: "Términos de uso" },
    description: {
      en: "Terms of use of CS Games: free games for entertainment, public player data and trademarks.",
      pt: "Termos de uso do CS Games: jogos gratuitos de entretenimento, dados públicos de jogadores e marcas.",
      es: "Términos de uso de CS Games: juegos gratuitos de entretenimiento, datos públicos de jugadores y marcas.",
    },
  },
} satisfies Record<string, PageSeo>;
