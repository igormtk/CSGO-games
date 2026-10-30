import type { Language } from "@/lib/language";

// Texto de "como jogar" de cada jogo. Aparece abaixo do jogo (já no HTML, em inglês, para
// buscadores e IAs que não executam JavaScript) e alimenta o FAQ dos dados estruturados.

export type GameId = "bingo" | "mystery" | "guessName" | "careerPath" | "higherLower" | "lineup" | "groups" | "sixtySeconds";

type GuideCopy = {
  heading: string;
  intro: string;
  steps: string[];
  faqHeading: string;
  faq: { question: string; answer: string }[];
};

const commonFaq: Record<Language, { question: string; answer: string }[]> = {
  pt: [
    {
      question: "Precisa pagar ou criar conta?",
      answer: "Não. Todos os jogos do CS Games são gratuitos e funcionam sem cadastro; o progresso fica salvo no seu navegador.",
    },
    {
      question: "De onde vêm os dados dos jogadores?",
      answer:
        "Do Liquipedia (licença CC BY-SA): times, histórico, nacionalidade, funções, títulos de Major e aparições no Top 20 da HLTV de mais de 200 pro players.",
    },
  ],
  en: [
    {
      question: "Is it free? Do I need an account?",
      answer: "It's free and needs no sign-up. Your progress is saved in your browser.",
    },
    {
      question: "Where does the player data come from?",
      answer:
        "From Liquipedia (CC BY-SA): teams, career history, nationality, roles, Major titles and HLTV Top 20 appearances for 200+ pro players.",
    },
  ],
  es: [
    {
      question: "¿Es gratis? ¿Necesito una cuenta?",
      answer: "Es gratis y no requiere registro. Tu progreso queda guardado en tu navegador.",
    },
    {
      question: "¿De dónde salen los datos de los jugadores?",
      answer:
        "De Liquipedia (CC BY-SA): equipos, trayectoria, nacionalidad, roles, títulos de Major y apariciones en el Top 20 de HLTV de más de 200 pro players.",
    },
  ],
};

export const gameGuides: Record<GameId, Record<Language, GuideCopy>> = {
  bingo: {
    pt: {
      heading: "Como jogar o CS Bingo",
      intro:
        "O CS Bingo é um desafio diário de Counter-Strike: encaixe pro players numa cartela 4x4 cruzando times, nacionalidades, funções e conquistas. A cartela é a mesma para todo mundo e muda à meia-noite (horário de Brasília).",
      steps: [
        "Antes de começar, escolha o modo: Clássico, sem tempo, ou Contra o relógio, com 10 segundos por nome.",
        "Um nome aparece por vez: 42 jogadores sorteados da base para o dia.",
        "Clique numa casa cujo critério o jogador cumpra, como \"Jogou pela NAVI\" ou \"Campeão de Major\". Seis casas combinam dois critérios.",
        "Errou a casa? Perde uma das 2 vidas. Não conhece o jogador? Pule sem custo.",
        "O coringa, uma vez por partida, coloca o nome em todas as casas livres que ele cumpre.",
        "Cada acerto vale 100 pontos; completar a cartela sem errar dá +300. Compartilhe o resultado e mantenha a sequência diária.",
      ],
      faqHeading: "Perguntas frequentes",
      faq: [
        { question: "Posso jogar mais de uma vez por dia?", answer: "Não: é uma tentativa por dia, igual para todos. Uma cartela nova aparece à meia-noite (horário de Brasília)." },
        ...commonFaq.pt,
      ],
    },
    en: {
      heading: "How to play CS Bingo",
      intro:
        "CS Bingo is a daily Counter-Strike challenge: fit pro players into a 4x4 board by matching teams, nationalities, roles and achievements. Everyone gets the same board, and a new one arrives at midnight Brasília time (UTC−3).",
      steps: [
        "Before you start, choose the mode: Classic, with no timer, or Against the clock, with 10 seconds per name.",
        "One name appears at a time: 42 players drawn from the database for the day.",
        "Click a cell whose criterion the player meets, like \"Played for NAVI\" or \"Major winner\". Six cells combine two criteria.",
        "Wrong cell? You lose one of your 2 lives. Don't know the player? Skip for free.",
        "The wildcard, once per game, places the name in every open cell it fits.",
        "Each hit is worth 100 points; a perfect board adds +300. Share your result and keep your daily streak.",
      ],
      faqHeading: "FAQ",
      faq: [
        { question: "Can I play more than once a day?", answer: "No: there is one attempt per day, the same for everyone. A new board arrives at midnight Brasília time." },
        ...commonFaq.en,
      ],
    },
    es: {
      heading: "Cómo jugar a CS Bingo",
      intro:
        "CS Bingo es un desafío diario de Counter-Strike: coloca pro players en un cartón 4x4 cruzando equipos, nacionalidades, roles y logros. El cartón es el mismo para todos y cambia a medianoche, hora de Brasilia (UTC−3).",
      steps: [
        "Antes de empezar, elige el modo: Clásico, sin tiempo, o Contrarreloj, con 10 segundos por nombre.",
        "Aparece un nombre por vez: 42 jugadores sorteados de la base para el día.",
        "Haz clic en una casilla cuyo criterio cumpla el jugador, como \"Jugó en NAVI\" o \"Campeón de Major\". Seis casillas combinan dos criterios.",
        "¿Casilla equivocada? Pierdes una de tus 2 vidas. ¿No conoces al jugador? Sáltalo sin costo.",
        "El comodín, una vez por partida, coloca el nombre en todas las casillas libres que cumpla.",
        "Cada acierto vale 100 puntos; completar el cartón sin fallar suma +300. Comparte tu resultado y mantén tu racha diaria.",
      ],
      faqHeading: "Preguntas frecuentes",
      faq: [
        { question: "¿Puedo jugar más de una vez al día?", answer: "No: hay un solo intento por día, igual para todos. Hay un cartón nuevo a medianoche (hora de Brasilia)." },
        ...commonFaq.es,
      ],
    },
  },
  mystery: {
    pt: {
      heading: "Como jogar o Jogador misterioso",
      intro:
        "O Jogador misterioso é um jogo diário de adivinhação de Counter-Strike: descubra o pro player do dia em até 6 palpites. O alvo é sempre um nome conhecido, com passagem pelo Top 20 da HLTV ou título de Major.",
      steps: [
        "Digite o nick de qualquer pro player para dar um palpite.",
        "Cada palpite mostra seis pistas: time atual, país, região, função, Majors vencidos e anos no Top 20 da HLTV.",
        "Verde é igual. Amarelo é perto: o misterioso já jogou nesse time, é da mesma região, divide alguma função ou está a 1 de distância. As setas dizem se o número dele é maior ou menor.",
        "Depois de 3 erros aparece uma dica com um time antigo do jogador.",
        "Acertou? Compartilhe o resultado em quadradinhos e volte amanhã para manter a sequência.",
      ],
      faqHeading: "Perguntas frequentes",
      faq: [
        { question: "Quando muda o jogador misterioso?", answer: "Todo dia à meia-noite (horário de Brasília). O jogador é o mesmo para todo mundo." },
        ...commonFaq.pt,
      ],
    },
    en: {
      heading: "How to play Mystery player",
      intro:
        "Mystery player is a daily Counter-Strike guessing game: find today's pro player in up to 6 guesses. The answer is always a well-known name with an HLTV Top 20 appearance or a Major title.",
      steps: [
        "Type any pro player's nickname to make a guess.",
        "Each guess shows six clues: current team, country, region, role, Majors won and years in HLTV's Top 20.",
        "Green means same. Yellow means close: the mystery player has played for that team, is from the same region, shares a role or is 1 away. Arrows tell you whether their number is higher or lower.",
        "After 3 misses you get a hint with one of the player's former teams.",
        "Got it? Share your result and come back tomorrow to keep your streak.",
      ],
      faqHeading: "FAQ",
      faq: [
        { question: "When does the mystery player change?", answer: "Every day at midnight Brasília time (UTC−3). Everyone gets the same player." },
        ...commonFaq.en,
      ],
    },
    es: {
      heading: "Cómo jugar a Jugador misterioso",
      intro:
        "Jugador misterioso es un juego diario de adivinanzas de Counter-Strike: descubre al pro player del día en hasta 6 intentos. La respuesta siempre es un nombre conocido, con paso por el Top 20 de HLTV o un título de Major.",
      steps: [
        "Escribe el nick de cualquier pro player para hacer un intento.",
        "Cada intento muestra seis pistas: equipo actual, país, región, rol, Majors ganados y años en el Top 20 de HLTV.",
        "Verde es igual. Amarillo es cerca: el misterioso ya jugó en ese equipo, es de la misma región, comparte algún rol o está a 1 de distancia. Las flechas indican si su número es mayor o menor.",
        "Después de 3 errores aparece una pista con un equipo anterior del jugador.",
        "¿Acertaste? Comparte tu resultado y vuelve mañana para mantener tu racha.",
      ],
      faqHeading: "Preguntas frecuentes",
      faq: [
        { question: "¿Cuándo cambia el jugador misterioso?", answer: "Todos los días a medianoche, hora de Brasilia (UTC−3). El jugador es el mismo para todos." },
        ...commonFaq.es,
      ],
    },
  },
  guessName: {
    pt: {
      heading: "Como jogar o Adivinhe o jogador",
      intro:
        "O Adivinhe o jogador é um desafio diário de Counter-Strike: aparecem os nicks de 20 pro players, os mesmos para todo mundo, e você escolhe o nome verdadeiro de cada um entre 4 opções, com 10 segundos por nome.",
      steps: [
        "Clique em Começar: os 20 nomes do dia aparecem um por vez.",
        "Escolha o nome real entre 4 opções antes de o cronômetro de 10 segundos zerar. As erradas costumam ser da mesma nacionalidade, para dificultar.",
        "Errou ou o tempo acabou? Perde uma das 3 vidas. Trocar de aba não pausa o tempo, e recarregar a página conta o nome da tela como erro.",
        "No fim, compartilhe o resultado em quadradinhos e volte amanhã para manter a sequência.",
      ],
      faqHeading: "Perguntas frequentes",
      faq: [
        { question: "Posso jogar mais de uma vez por dia?", answer: "Não: é uma tentativa por dia, com os mesmos 20 nomes para todos. Um desafio novo aparece à meia-noite (horário de Brasília)." },
        ...commonFaq.pt,
      ],
    },
    en: {
      heading: "How to play Guess the player",
      intro:
        "Guess the player is a daily Counter-Strike challenge: you see the nicknames of 20 pro players, the same for everyone, and pick each one's real name from 4 options, with 10 seconds per name.",
      steps: [
        "Click Start: today's 20 names appear one at a time.",
        "Pick the real name from 4 options before the 10-second timer runs out. Wrong answers are usually from the same country, to make it harder.",
        "Wrong answer or time's up? You lose one of your 3 lives. Switching tabs doesn't pause the timer, and reloading the page counts the name on screen as a miss.",
        "At the end, share your result and come back tomorrow to keep your streak.",
      ],
      faqHeading: "FAQ",
      faq: [
        { question: "Can I play more than once a day?", answer: "No: there is one attempt per day, with the same 20 names for everyone. A new challenge arrives at midnight Brasília time." },
        ...commonFaq.en,
      ],
    },
    es: {
      heading: "Cómo jugar a Adivina el jugador",
      intro:
        "Adivina el jugador es un desafío diario de Counter-Strike: aparecen los nicks de 20 pro players, los mismos para todos, y eliges el nombre real de cada uno entre 4 opciones, con 10 segundos por nombre.",
      steps: [
        "Haz clic en Empezar: los 20 nombres del día aparecen uno por vez.",
        "Elige el nombre real entre 4 opciones antes de que el cronómetro de 10 segundos llegue a cero. Las incorrectas suelen ser de la misma nacionalidad, para complicarlo.",
        "¿Fallaste o se acabó el tiempo? Pierdes una de tus 3 vidas. Cambiar de pestaña no pausa el tiempo, y recargar la página cuenta el nombre en pantalla como error.",
        "Al final, comparte tu resultado y vuelve mañana para mantener tu racha.",
      ],
      faqHeading: "Preguntas frecuentes",
      faq: [
        { question: "¿Puedo jugar más de una vez al día?", answer: "No: hay un solo intento por día, con los mismos 20 nombres para todos. Hay un desafío nuevo a medianoche (hora de Brasilia)." },
        ...commonFaq.es,
      ],
    },
  },
  careerPath: {
    pt: {
      heading: "Como jogar o Caminho de carreira",
      intro:
        "O Caminho de carreira é um desafio diário de Counter-Strike: aparecem os times por onde um pro player passou, em ordem, e você descobre quem é em até 6 palpites.",
      steps: [
        "Os 2 primeiros times da carreira começam revelados; os outros ficam escondidos.",
        "Digite o nick de qualquer pro player para dar um palpite.",
        "Cada erro revela o próximo time. Quando os times acabam, aparecem o país e depois a função do jogador.",
        "Acertou? Compartilhe o resultado e volte amanhã para manter a sequência.",
      ],
      faqHeading: "Perguntas frequentes",
      faq: [
        { question: "Quando muda a carreira do dia?", answer: "Todo dia à meia-noite (horário de Brasília). O jogador é o mesmo para todo mundo." },
        ...commonFaq.pt,
      ],
    },
    en: {
      heading: "How to play Career path",
      intro:
        "Career path is a daily Counter-Strike challenge: you see the teams a pro player has played for, in order, and find out who it is in up to 6 guesses.",
      steps: [
        "The first 2 teams of the career start revealed; the rest stay hidden.",
        "Type any pro player's nickname to make a guess.",
        "Each miss reveals the next team. Once the teams run out, the player's country and then role appear.",
        "Got it? Share your result and come back tomorrow to keep your streak.",
      ],
      faqHeading: "FAQ",
      faq: [
        { question: "When does the career of the day change?", answer: "Every day at midnight Brasília time (UTC−3). Everyone gets the same player." },
        ...commonFaq.en,
      ],
    },
    es: {
      heading: "Cómo jugar a Camino de carrera",
      intro:
        "Camino de carrera es un desafío diario de Counter-Strike: aparecen los equipos por los que pasó un pro player, en orden, y descubres quién es en hasta 6 intentos.",
      steps: [
        "Los 2 primeros equipos de la carrera empiezan revelados; los demás quedan ocultos.",
        "Escribe el nick de cualquier pro player para hacer un intento.",
        "Cada error revela el siguiente equipo. Cuando se acaban los equipos, aparecen el país y después el rol del jugador.",
        "¿Acertaste? Comparte tu resultado y vuelve mañana para mantener tu racha.",
      ],
      faqHeading: "Preguntas frecuentes",
      faq: [
        { question: "¿Cuándo cambia la carrera del día?", answer: "Todos los días a medianoche, hora de Brasilia (UTC−3). El jugador es el mismo para todos." },
        ...commonFaq.es,
      ],
    },
  },
  higherLower: {
    pt: {
      heading: "Como jogar o Mais ou menos",
      intro:
        "O Mais ou menos é um jogo infinito de Counter-Strike: dois pro players aparecem lado a lado e você diz qual tem mais títulos de Major ou mais anos no Top 20 da HLTV. Não tem limite diário.",
      steps: [
        "Leia a pergunta da rodada, como \"Quem tem mais títulos de Major?\".",
        "O jogador da esquerda mostra o número; o da direita fica escondido. Toque em quem você acha que tem mais. Nunca há empate.",
        "Acertou? O jogador da direita passa para a esquerda, um novo aparece e a pergunta pode mudar.",
        "Um erro encerra a partida. Compartilhe a sua sequência e tente bater o seu recorde.",
      ],
      faqHeading: "Perguntas frequentes",
      faq: [
        { question: "Posso jogar mais de uma vez por dia?", answer: "Sim. O Mais ou menos não é diário: cada partida sorteia jogadores novos, e o seu recorde fica salvo no navegador." },
        ...commonFaq.pt,
      ],
    },
    en: {
      heading: "How to play Higher or lower",
      intro:
        "Higher or lower is an endless Counter-Strike game: two pro players appear side by side and you say which one has more Major titles or more years in the HLTV Top 20. There is no daily limit.",
      steps: [
        "Read the round's question, like \"Who has more Major titles?\".",
        "The player on the left shows the number; the one on the right stays hidden. Tap whoever you think has more. There are never ties.",
        "Right? The player on the right moves to the left, a new one appears and the question may change.",
        "One miss ends the run. Share your streak and try to beat your record.",
      ],
      faqHeading: "FAQ",
      faq: [
        { question: "Can I play more than once a day?", answer: "Yes. Higher or lower isn't daily: every run draws new players, and your record is saved in your browser." },
        ...commonFaq.en,
      ],
    },
    es: {
      heading: "Cómo jugar a Más o menos",
      intro:
        "Más o menos es un juego infinito de Counter-Strike: aparecen dos pro players lado a lado y dices cuál tiene más títulos de Major o más años en el Top 20 de HLTV. No tiene límite diario.",
      steps: [
        "Lee la pregunta de la ronda, como \"¿Quién tiene más títulos de Major?\".",
        "El jugador de la izquierda muestra el número; el de la derecha queda oculto. Toca a quien creas que tiene más. Nunca hay empate.",
        "¿Acertaste? El jugador de la derecha pasa a la izquierda, aparece uno nuevo y la pregunta puede cambiar.",
        "Un error termina la partida. Comparte tu racha e intenta superar tu récord.",
      ],
      faqHeading: "Preguntas frecuentes",
      faq: [
        { question: "¿Puedo jugar más de una vez al día?", answer: "Sí. Más o menos no es diario: cada partida sortea jugadores nuevos y tu récord queda guardado en tu navegador." },
        ...commonFaq.es,
      ],
    },
  },
  lineup: {
    pt: {
      heading: "Como jogar a Escalação",
      intro:
        "A Escalação é um desafio diário de Counter-Strike: aparece um time e você cita 5 pro players que já jogaram por ele, em qualquer época. O time é o mesmo para todo mundo e muda à meia-noite (horário de Brasília).",
      steps: [
        "Veja o time do dia no topo da tela.",
        "Digite o nick de um jogador que já passou pelo time e escolha na lista. Vale qualquer época da carreira.",
        "Cada acerto ocupa uma das 5 vagas. Cada erro custa uma das 3 vidas.",
        "Preencha as 5 vagas para vencer. No fim aparecem todos os jogadores da nossa base que passaram pelo time.",
      ],
      faqHeading: "Perguntas frequentes",
      faq: [
        {
          question: "Por que um jogador que passou pelo time não valeu?",
          answer: "Contamos os times principais da carreira de cada jogador, segundo o Liquipedia, e só os jogadores que estão na nossa base. Passagens curtas ou por times de base podem não aparecer.",
        },
        { question: "Posso jogar dias anteriores?", answer: "Sim. O arquivo de desafios tem todos os dias desde janeiro de 2026; eles não contam para a sequência." },
        ...commonFaq.pt,
      ],
    },
    en: {
      heading: "How to play Lineup",
      intro:
        "Lineup is a daily Counter-Strike challenge: a team appears and you name 5 pro players who have played for it, from any era. Everyone gets the same team, and a new one arrives at midnight Brasília time (UTC−3).",
      steps: [
        "See today's team at the top of the screen.",
        "Type the nickname of a player who has played for the team and pick it from the list. Any point of their career counts.",
        "Each right answer fills one of the 5 slots. Each miss costs one of your 3 lives.",
        "Fill all 5 slots to win. At the end you see every player in our database who played for the team.",
      ],
      faqHeading: "FAQ",
      faq: [
        {
          question: "Why didn't a player who was on the team count?",
          answer: "We count each player's main career teams according to Liquipedia, and only players in our database. Short stints or academy teams may be missing.",
        },
        { question: "Can I play past days?", answer: "Yes. The challenge archive has every day since January 2026; they don't count toward your streak." },
        ...commonFaq.en,
      ],
    },
    es: {
      heading: "Cómo jugar a Alineación",
      intro:
        "Alineación es un desafío diario de Counter-Strike: aparece un equipo y nombras 5 pro players que hayan jugado en él, de cualquier época. El equipo es el mismo para todos y cambia a medianoche (hora de Brasilia).",
      steps: [
        "Mira el equipo del día arriba de la pantalla.",
        "Escribe el nick de un jugador que haya pasado por el equipo y elígelo de la lista. Vale cualquier momento de su carrera.",
        "Cada acierto ocupa uno de los 5 puestos. Cada error cuesta una de tus 3 vidas.",
        "Completa los 5 puestos para ganar. Al final aparecen todos los jugadores de nuestra base que pasaron por el equipo.",
      ],
      faqHeading: "Preguntas frecuentes",
      faq: [
        {
          question: "¿Por qué no valió un jugador que estuvo en el equipo?",
          answer: "Contamos los equipos principales de la carrera de cada jugador según Liquipedia, y solo jugadores de nuestra base. Pasos cortos o equipos de cantera pueden no aparecer.",
        },
        { question: "¿Puedo jugar días anteriores?", answer: "Sí. El archivo de desafíos tiene todos los días desde enero de 2026; no cuentan para la racha." },
        ...commonFaq.es,
      ],
    },
  },
  groups: {
    pt: {
      heading: "Como jogar o Agrupe os 16",
      intro:
        "O Agrupe os 16 é um desafio diário de Counter-Strike: 16 pro players escondem 4 grupos de 4 com algo em comum, como um time, um país, uma função ou um feito. O desafio é o mesmo para todo mundo e muda à meia-noite (horário de Brasília).",
      steps: [
        "Toque em 4 jogadores que você acha que formam um grupo e clique em Enviar.",
        "Acertou? O grupo aparece com a característica em comum. Os grupos vão do mais fácil (amarelo) ao mais difícil (roxo).",
        "Errou? Perde uma das 4 vidas. Se 3 dos 4 estiverem no mesmo grupo, o jogo avisa.",
        "Cada jogador cabe em um grupo só: a solução é única. Use Embaralhar para ver os nomes de outro jeito.",
      ],
      faqHeading: "Perguntas frequentes",
      faq: [
        {
          question: "Que tipo de grupo pode aparecer?",
          answer: `Jogadores que passaram pelo mesmo time, da mesma nacionalidade, com a mesma função (AWPer ou IGL), MVPs de Major, quem tem 2 ou mais títulos de Major ou quem passou 5 ou mais anos no Top 20 da HLTV.`,
        },
        { question: "Posso jogar dias anteriores?", answer: "Sim. O arquivo de desafios tem todos os dias desde janeiro de 2026; eles não contam para a sequência." },
        ...commonFaq.pt,
      ],
    },
    en: {
      heading: "How to play Sort the 16",
      intro:
        "Sort the 16 is a daily Counter-Strike puzzle: 16 pro players hide 4 groups of 4 that share something, like a team, a country, a role or an achievement. Everyone gets the same puzzle, and a new one arrives at midnight Brasília time (UTC−3).",
      steps: [
        "Tap 4 players you think form a group and press Submit.",
        "Right? The group shows up with what they share. Groups go from easiest (yellow) to hardest (purple).",
        "Wrong? You lose one of your 4 lives. If 3 of the 4 are in the same group, the game tells you.",
        "Each player fits only one group: the solution is unique. Use Shuffle to see the names in a new order.",
      ],
      faqHeading: "FAQ",
      faq: [
        {
          question: "What kinds of groups can appear?",
          answer: `Players who played for the same team, share a nationality, share a role (AWPer or IGL), Major MVPs, players with 2 or more Major titles or players with 5 or more years in the HLTV Top 20.`,
        },
        { question: "Can I play past days?", answer: "Yes. The challenge archive has every day since January 2026; they don't count toward your streak." },
        ...commonFaq.en,
      ],
    },
    es: {
      heading: "Cómo jugar a Agrupa los 16",
      intro:
        "Agrupa los 16 es un desafío diario de Counter-Strike: 16 pro players esconden 4 grupos de 4 con algo en común, como un equipo, un país, un rol o un logro. El desafío es el mismo para todos y cambia a medianoche (hora de Brasilia).",
      steps: [
        "Toca 4 jugadores que creas que forman un grupo y pulsa Enviar.",
        "¿Acertaste? El grupo aparece con lo que tienen en común. Los grupos van del más fácil (amarillo) al más difícil (morado).",
        "¿Fallaste? Pierdes una de tus 4 vidas. Si 3 de los 4 están en el mismo grupo, el juego te avisa.",
        "Cada jugador cabe en un solo grupo: la solución es única. Usa Mezclar para ver los nombres en otro orden.",
      ],
      faqHeading: "Preguntas frecuentes",
      faq: [
        {
          question: "¿Qué tipo de grupos pueden aparecer?",
          answer: `Jugadores que pasaron por el mismo equipo, de la misma nacionalidad, con el mismo rol (AWPer o IGL), MVPs de Major, quienes tienen 2 o más títulos de Major o quienes pasaron 5 o más años en el Top 20 de HLTV.`,
        },
        { question: "¿Puedo jugar días anteriores?", answer: "Sí. El archivo de desafíos tiene todos los días desde enero de 2026; no cuentan para la racha." },
        ...commonFaq.es,
      ],
    },
  },
  sixtySeconds: {
    pt: {
      heading: "Como jogar o 60 segundos",
      intro:
        "O 60 segundos é um desafio diário de Counter-Strike: aparece um tema, como um time, um país ou um feito, e você digita o máximo de pro players que se encaixam nele em um minuto. O tema é o mesmo para todo mundo e muda à meia-noite (horário de Brasília).",
      steps: [
        "Leia o tema do dia e clique em Começar: o relógio de 60 segundos dispara.",
        "Comece a digitar o nick e escolha o jogador na lista, ou aperte Enter para ficar com o primeiro.",
        "A lista mostra jogadores de toda a base, não só do tema: ela ajuda a escrever, mas a resposta é sua. Nomes fora do tema não tiram pontos.",
        "No fim aparecem os jogadores da nossa base que faltaram. Recarregar a página não pausa o relógio.",
      ],
      faqHeading: "Perguntas frequentes",
      faq: [
        {
          question: "Por que um jogador que eu digitei não valeu?",
          answer: "Só contam jogadores da nossa base (mais de 200 pro players do Liquipedia), escritos com o nick usado lá. Para times, valem os times principais da carreira.",
        },
        { question: "Posso jogar dias anteriores?", answer: "Sim. O arquivo de desafios tem todos os dias desde janeiro de 2026; eles não contam para a sequência." },
        ...commonFaq.pt,
      ],
    },
    en: {
      heading: "How to play 60 seconds",
      intro:
        "60 seconds is a daily Counter-Strike challenge: a theme appears, like a team, a country or an achievement, and you type as many matching pro players as you can in one minute. Everyone gets the same theme, and a new one arrives at midnight Brasília time (UTC−3).",
      steps: [
        "Read today's theme and click Start: the 60-second clock begins.",
        "Start typing the nickname and pick the player from the list, or press Enter to take the first one.",
        "The list shows players from the whole database, not just the theme: it helps with spelling, but the answer is yours. Names outside the theme don't cost points.",
        "At the end you see the players in our database you missed. Reloading the page doesn't pause the clock.",
      ],
      faqHeading: "FAQ",
      faq: [
        {
          question: "Why didn't a player I typed count?",
          answer: "Only players in our database count (200+ pro players from Liquipedia), spelled with the nickname used there. For teams, each player's main career teams count.",
        },
        { question: "Can I play past days?", answer: "Yes. The challenge archive has every day since January 2026; they don't count toward your streak." },
        ...commonFaq.en,
      ],
    },
    es: {
      heading: "Cómo jugar a 60 segundos",
      intro:
        "60 segundos es un desafío diario de Counter-Strike: aparece un tema, como un equipo, un país o un logro, y escribes todos los pro players que encajan en él en un minuto. El tema es el mismo para todos y cambia a medianoche (hora de Brasilia).",
      steps: [
        "Lee el tema del día y haz clic en Empezar: arranca el reloj de 60 segundos.",
        "Empieza a escribir el nick y elige al jugador de la lista, o pulsa Enter para quedarte con el primero.",
        "La lista muestra jugadores de toda la base, no solo del tema: ayuda a escribir, pero la respuesta es tuya. Los nombres fuera del tema no restan.",
        "Al final aparecen los jugadores de nuestra base que faltaron. Recargar la página no pausa el reloj.",
      ],
      faqHeading: "Preguntas frecuentes",
      faq: [
        {
          question: "¿Por qué no valió un jugador que escribí?",
          answer: "Solo cuentan jugadores de nuestra base (más de 200 pro players de Liquipedia), escritos con el nick que se usa allí. Para equipos, valen los equipos principales de la carrera.",
        },
        { question: "¿Puedo jugar días anteriores?", answer: "Sí. El archivo de desafíos tiene todos los días desde enero de 2026; no cuentan para la racha." },
        ...commonFaq.es,
      ],
    },
  },
};
