import type { Language } from "@/lib/language";

// Texto de "como jogar" de cada jogo. Aparece abaixo do jogo (já no HTML, em português, para
// buscadores e IAs que não executam JavaScript) e alimenta o FAQ dos dados estruturados.

export type GameId = "bingo" | "mystery" | "guessName";

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
        "No Adivinhe o jogador você mostra o quanto conhece a cena de Counter-Strike: aparece o nick de um pro player e você escolhe o nome verdadeiro dele entre 4 opções.",
      steps: [
        "Clique em Começar: os nicks aparecem em ordem aleatória.",
        "Escolha o nome real entre 4 opções. As erradas costumam ser da mesma nacionalidade, para dificultar.",
        "Você tem 3 vidas; cada erro custa uma.",
        "Acerte o máximo de nomes que conseguir e bata o seu recorde.",
      ],
      faqHeading: "Perguntas frequentes",
      faq: [
        { question: "Tem limite de partidas?", answer: "Não: diferente dos jogos diários, aqui dá para jogar quantas vezes quiser." },
        ...commonFaq.pt,
      ],
    },
    en: {
      heading: "How to play Guess the player",
      intro:
        "Guess the player tests how well you know the Counter-Strike scene: you see a pro player's nickname and pick their real name from 4 options.",
      steps: [
        "Click Start: nicknames appear in random order.",
        "Pick the real name from 4 options. Wrong answers are usually from the same country, to make it harder.",
        "You have 3 lives; each miss costs one.",
        "Get as many names right as you can and beat your record.",
      ],
      faqHeading: "FAQ",
      faq: [
        { question: "Is there a limit on games?", answer: "No: unlike the daily games, you can play as many times as you like." },
        ...commonFaq.en,
      ],
    },
    es: {
      heading: "Cómo jugar a Adivina el jugador",
      intro:
        "En Adivina el jugador demuestras cuánto conoces la escena de Counter-Strike: aparece el nick de un pro player y eliges su nombre real entre 4 opciones.",
      steps: [
        "Haz clic en Empezar: los nicks aparecen en orden aleatorio.",
        "Elige el nombre real entre 4 opciones. Las incorrectas suelen ser de la misma nacionalidad, para complicarlo.",
        "Tienes 3 vidas; cada error cuesta una.",
        "Acierta todos los nombres que puedas y supera tu récord.",
      ],
      faqHeading: "Preguntas frecuentes",
      faq: [
        { question: "¿Hay límite de partidas?", answer: "No: a diferencia de los juegos diarios, aquí puedes jugar todas las veces que quieras." },
        ...commonFaq.es,
      ],
    },
  },
};
