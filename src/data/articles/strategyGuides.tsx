import type { ReactNode } from "react";
import type { Language } from "@/lib/language";

// Guias de estratégia de cada jogo (/guides/<slug>). Texto próprio, complementar ao "como jogar"
// que aparece abaixo de cada jogo (src/data/gameGuides.ts).

type Localized<T> = Record<Language, T>;

export type StrategyGuide = {
  slug: string;
  gameHref: string;
  title: Localized<string>;
  intro: Localized<string>;
  cta: Localized<string>;
  content: Localized<ReactNode>;
};

export const strategyGuides: StrategyGuide[] = [
  {
    slug: "cs-bingo-tips",
    gameHref: "/bingo",
    title: {
      pt: "CS Bingo: 8 dicas para completar a cartela",
      en: "CS Bingo: 8 tips to complete the board",
      es: "CS Bingo: 8 consejos para completar el cartón",
    },
    intro: {
      pt: "Como ler a cartela, guardar as casas difíceis e usar pulos e coringa a seu favor no desafio diário.",
      en: "How to read the board, save the hard cells and use skips and the wildcard in your favor in the daily challenge.",
      es: "Cómo leer el cartón, guardar las casillas difíciles y usar los saltos y el comodín a tu favor en el desafío diario.",
    },
    cta: { pt: "Jogar o CS Bingo de hoje", en: "Play today's CS Bingo", es: "Jugar el CS Bingo de hoy" },
    content: {
      pt: (
        <>
          <h2>1. Leia a cartela antes do primeiro nome</h2>
          <p>
            As 16 casas não têm a mesma dificuldade. &ldquo;Ativo&rdquo;, &ldquo;3+ times&rdquo; e &ldquo;Sem Major&rdquo; aceitam
            dezenas de jogadores; &ldquo;Major MVP&rdquo;, &ldquo;Israel&rdquo;, &ldquo;NA&rdquo; ou uma casa combinada aceitam
            poucos. Antes de começar, marque mentalmente quais são as raras: elas é que decidem se a cartela fecha.
          </p>
          <h2>2. Não gaste um craque numa casa fácil</h2>
          <p>
            Se aparecer o dev1ce, ele cumpre Astralis, Dinamarca, AWPer, campeão de Major, 2+ Majors, Major MVP e Top 20 5+
            vezes. Colocá-lo em &ldquo;Ativo&rdquo; desperdiça um nome que fecharia uma casa difícil. A regra é simples: o
            jogador vai para a casa mais rara que ele cumpre.
          </p>
          <h2>3. Pular é de graça; errar custa vida</h2>
          <p>
            Você tem só 2 vidas e 42 nomes. Pular não tira nada, então na dúvida pule. Uma cartela perfeita vale +300 pontos,
            muito mais do que o risco de um chute.
          </p>
          <h2>4. Guarde o coringa para um nome versátil</h2>
          <p>
            O coringa coloca o jogador em todas as casas livres que ele cumpre. Use-o com quem fecha três ou mais casas de uma
            vez, de preferência no meio da partida, quando ainda há casas raras abertas.
          </p>
          <h2>5. &ldquo;Jogou pela&rdquo; vale para a carreira toda</h2>
          <p>
            As casas de time contam qualquer passagem, não só o time atual. O FalleN, por exemplo, cumpre SK Gaming, MIBR,
            Liquid e FURIA. Lembrar das trocas de time antigas é a melhor arma do bingo.
          </p>
          <h2>6. Casa combinada exige as duas coisas</h2>
          <p>
            Seis casas juntam dois critérios, como &ldquo;Brasil + Major winner&rdquo;. As duas partes precisam ser verdade ao
            mesmo tempo. Essas casas costumam aceitar poucos nomes: priorize-as.
          </p>
          <h2>7. Conheça as funções</h2>
          <p>
            AWPer, IGL, entry fragger e lurker são funções que o jogador exerce ou já exerceu. Muitos acumulam mais de uma: o
            coldzera aparece como lurker e AWPer, e o s1mple como rifler e AWPer.
          </p>
          <h2>8. No modo contra o relógio, decida rápido</h2>
          <p>
            Com 10 segundos por nome, o tempo esgotado só faz o nome passar, sem perder vida. Então, se não tiver certeza em
            poucos segundos, deixe passar e espere um nome melhor.
          </p>
        </>
      ),
      en: (
        <>
          <h2>1. Read the board before the first name</h2>
          <p>
            The 16 cells are not equally hard. &ldquo;Active&rdquo;, &ldquo;3+ teams&rdquo; and &ldquo;No Major&rdquo; accept dozens
            of players; &ldquo;Major MVP&rdquo;, &ldquo;Israel&rdquo;, &ldquo;NA&rdquo; or a combo cell accept only a few. Before you
            start, note which ones are rare: they decide whether the board gets completed.
          </p>
          <h2>2. Don&apos;t waste a star on an easy cell</h2>
          <p>
            If dev1ce shows up, he fits Astralis, Denmark, AWPer, Major winner, 2+ Majors, Major MVP and Top 20 5+ times.
            Putting him in &ldquo;Active&rdquo; wastes a name that could close a hard cell. The rule is simple: a player goes into
            the rarest cell he fits.
          </p>
          <h2>3. Skipping is free; mistakes cost lives</h2>
          <p>
            You only have 2 lives and 42 names. Skipping costs nothing, so when in doubt, skip. A perfect board is worth +300
            points, far more than the risk of a guess.
          </p>
          <h2>4. Save the wildcard for a versatile name</h2>
          <p>
            The wildcard places the player in every open cell he fits. Use it on someone who closes three or more cells at
            once, ideally mid-game, while rare cells are still open.
          </p>
          <h2>5. &ldquo;Played for&rdquo; covers the whole career</h2>
          <p>
            Team cells count any stint, not just the current team. FalleN, for example, fits SK Gaming, MIBR, Liquid and FURIA.
            Remembering old roster moves is the best weapon in bingo.
          </p>
          <h2>6. Combo cells need both conditions</h2>
          <p>
            Six cells join two criteria, like &ldquo;Brazil + Major winner&rdquo;. Both parts must be true at once. These cells
            usually accept few names: prioritize them.
          </p>
          <h2>7. Know the roles</h2>
          <p>
            AWPer, IGL, entry fragger and lurker are roles the player has or had. Many hold more than one: coldzera is listed as
            lurker and AWPer, and s1mple as rifler and AWPer.
          </p>
          <h2>8. In Against the clock, decide fast</h2>
          <p>
            With 10 seconds per name, running out of time only passes the name, with no life lost. If you&apos;re not sure within
            a few seconds, let it pass and wait for a better name.
          </p>
        </>
      ),
      es: (
        <>
          <h2>1. Lee el cartón antes del primer nombre</h2>
          <p>
            Las 16 casillas no tienen la misma dificultad. &ldquo;Activo&rdquo;, &ldquo;3+ equipos&rdquo; y &ldquo;Sin Major&rdquo;
            aceptan decenas de jugadores; &ldquo;Major MVP&rdquo;, &ldquo;Israel&rdquo;, &ldquo;NA&rdquo; o una casilla combinada
            aceptan pocos. Antes de empezar, identifica las raras: son las que deciden si el cartón se completa.
          </p>
          <h2>2. No gastes una estrella en una casilla fácil</h2>
          <p>
            Si aparece dev1ce, cumple Astralis, Dinamarca, AWPer, campeón de Major, 2+ Majors, Major MVP y Top 20 5+ veces.
            Ponerlo en &ldquo;Activo&rdquo; desperdicia un nombre que cerraría una casilla difícil. La regla es simple: el jugador
            va a la casilla más rara que cumpla.
          </p>
          <h2>3. Saltar es gratis; fallar cuesta vidas</h2>
          <p>
            Tienes solo 2 vidas y 42 nombres. Saltar no cuesta nada, así que ante la duda, salta. Un cartón perfecto vale +300
            puntos, mucho más que el riesgo de adivinar.
          </p>
          <h2>4. Guarda el comodín para un nombre versátil</h2>
          <p>
            El comodín coloca al jugador en todas las casillas libres que cumpla. Úsalo con alguien que cierre tres casillas o
            más a la vez, idealmente a mitad de partida, cuando aún quedan casillas raras abiertas.
          </p>
          <h2>5. &ldquo;Jugó en&rdquo; vale para toda la carrera</h2>
          <p>
            Las casillas de equipo cuentan cualquier paso, no solo el equipo actual. FalleN, por ejemplo, cumple SK Gaming, MIBR,
            Liquid y FURIA. Recordar los fichajes antiguos es la mejor arma del bingo.
          </p>
          <h2>6. La casilla combinada exige las dos cosas</h2>
          <p>
            Seis casillas juntan dos criterios, como &ldquo;Brasil + Major winner&rdquo;. Las dos partes deben ser verdad al mismo
            tiempo. Suelen aceptar pocos nombres: dales prioridad.
          </p>
          <h2>7. Conoce los roles</h2>
          <p>
            AWPer, IGL, entry fragger y lurker son roles que el jugador ejerce o ejerció. Muchos tienen más de uno: coldzera
            figura como lurker y AWPer, y s1mple como rifler y AWPer.
          </p>
          <h2>8. En Contrarreloj, decide rápido</h2>
          <p>
            Con 10 segundos por nombre, si se acaba el tiempo el nombre solo pasa, sin perder vida. Si no estás seguro en pocos
            segundos, déjalo pasar y espera un nombre mejor.
          </p>
        </>
      ),
    },
  },
  {
    slug: "mystery-player-strategy",
    gameHref: "/jogador-misterioso",
    title: {
      pt: "Jogador misterioso: como acertar em poucos palpites",
      en: "Mystery player: how to win in fewer guesses",
      es: "Jugador misterioso: cómo acertar en pocos intentos",
    },
    intro: {
      pt: "Um método para escolher o primeiro palpite e usar cada cor e seta como pista, até chegar ao pro player do dia.",
      en: "A method to choose your first guess and use every color and arrow as a clue until you reach today's pro player.",
      es: "Un método para elegir el primer intento y usar cada color y flecha como pista hasta llegar al pro player del día.",
    },
    cta: { pt: "Jogar o Jogador misterioso", en: "Play Mystery player", es: "Jugar a Jugador misterioso" },
    content: {
      pt: (
        <>
          <h2>O primeiro palpite: um jogador &ldquo;do meio&rdquo;</h2>
          <p>
            O alvo é sempre alguém com passagem pelo Top 20 da HLTV ou título de Major. Por isso, o melhor primeiro palpite é um
            jogador europeu com 1 a 3 Majors e vários anos de Top 20, como o ropz: as setas de Majors e de anos no Top 20 já
            dizem se o misterioso tem mais ou menos títulos, e a região separa logo Europa, CIS, Américas e Ásia.
          </p>
          <h2>Use as setas como uma busca binária</h2>
          <p>
            Se a seta de Majors aponta para cima depois de um palpite com 1 título, o misterioso tem 2 ou mais: isso deixa só
            algumas dezenas de nomes. Faça o mesmo com os anos no Top 20, sempre escolhendo um palpite que divida as opções ao
            meio.
          </p>
          <h2>Amarelo no time é ouro</h2>
          <p>
            Time amarelo significa que o misterioso já jogou naquele time, mas não joga mais. Pense nos jogadores que saíram
            dessa equipe nos últimos anos e cruze com o país e a função.
          </p>
          <h2>Região e país andam juntos</h2>
          <p>
            Região verde com país cinza significa outro país da mesma região. Na Europa, isso ainda é amplo; em regiões menores,
            como América do Sul ou Ásia, sobram poucos candidatos.
          </p>
          <h2>Guarde os palpites finais para nomes completos</h2>
          <p>
            Depois de 3 erros aparece um time antigo do jogador como dica. A partir daí, só chute nomes que cumpram todas as
            pistas verdes e amarelas já vistas: cada palpite incoerente é uma chance jogada fora.
          </p>
        </>
      ),
      en: (
        <>
          <h2>First guess: a &ldquo;middle&rdquo; player</h2>
          <p>
            The answer is always someone with an HLTV Top 20 appearance or a Major title. So the best opener is a European
            player with 1 to 3 Majors and several Top 20 years, like ropz: the Majors and Top 20 arrows immediately say whether
            the mystery player has more or fewer titles, and the region splits Europe, CIS, the Americas and Asia.
          </p>
          <h2>Use the arrows like a binary search</h2>
          <p>
            If the Majors arrow points up after a guess with 1 title, the mystery player has 2 or more: that leaves only a few
            dozen names. Do the same with Top 20 years, always picking a guess that cuts the options in half.
          </p>
          <h2>Yellow on the team is gold</h2>
          <p>
            A yellow team means the mystery player once played for that team but no longer does. Think of players who left that
            roster in recent years and cross them with country and role.
          </p>
          <h2>Region and country go together</h2>
          <p>
            Green region with a grey country means another country in the same region. In Europe that is still broad; in smaller
            regions like South America or Asia, very few candidates remain.
          </p>
          <h2>Save your last guesses for complete matches</h2>
          <p>
            After 3 misses you get one of the player&apos;s former teams as a hint. From then on, only guess names that fit every
            green and yellow clue you&apos;ve seen: each inconsistent guess is a wasted chance.
          </p>
        </>
      ),
      es: (
        <>
          <h2>Primer intento: un jugador &ldquo;del medio&rdquo;</h2>
          <p>
            La respuesta siempre es alguien con paso por el Top 20 de HLTV o un título de Major. Por eso, el mejor primer
            intento es un jugador europeo con 1 a 3 Majors y varios años de Top 20, como ropz: las flechas de Majors y de años en
            el Top 20 ya dicen si el misterioso tiene más o menos títulos, y la región separa Europa, CIS, las Américas y Asia.
          </p>
          <h2>Usa las flechas como una búsqueda binaria</h2>
          <p>
            Si la flecha de Majors apunta hacia arriba tras un intento con 1 título, el misterioso tiene 2 o más: quedan solo
            unas decenas de nombres. Haz lo mismo con los años en el Top 20, eligiendo siempre un intento que divida las opciones
            a la mitad.
          </p>
          <h2>Amarillo en el equipo vale oro</h2>
          <p>
            Equipo amarillo significa que el misterioso jugó en ese equipo, pero ya no. Piensa en los jugadores que salieron de
            esa plantilla en los últimos años y crúzalos con el país y el rol.
          </p>
          <h2>Región y país van juntos</h2>
          <p>
            Región verde con país gris significa otro país de la misma región. En Europa todavía es amplio; en regiones más
            pequeñas, como Sudamérica o Asia, quedan pocos candidatos.
          </p>
          <h2>Guarda los últimos intentos para nombres completos</h2>
          <p>
            Después de 3 errores aparece un equipo anterior del jugador como pista. Desde ahí, solo prueba nombres que cumplan
            todas las pistas verdes y amarillas vistas: cada intento incoherente es una oportunidad perdida.
          </p>
        </>
      ),
    },
  },
  {
    slug: "career-path-tips",
    gameHref: "/career-path",
    title: {
      pt: "Caminho de carreira: como reconhecer um jogador pelos times",
      en: "Career path: how to recognize a player by their teams",
      es: "Camino de carrera: cómo reconocer a un jugador por sus equipos",
    },
    intro: {
      pt: "Os padrões de transferência que entregam a região e a época de um pro player, e como aproveitar cada palpite.",
      en: "The transfer patterns that give away a pro player's region and era, and how to make every guess count.",
      es: "Los patrones de fichajes que delatan la región y la época de un pro player, y cómo aprovechar cada intento.",
    },
    cta: { pt: "Jogar o Caminho de carreira", en: "Play Career path", es: "Jugar a Camino de carrera" },
    content: {
      pt: (
        <>
          <h2>Os primeiros times dizem a região</h2>
          <p>
            Times de base e organizações locais quase sempre revelam o país de origem. Academias como a Team Spirit Academy
            apontam para a CIS; passagens por Games Academy ou Luminosity costumam indicar a geração brasileira campeã de 2016.
          </p>
          <h2>Algumas sequências são assinaturas</h2>
          <p>
            Luminosity → SK Gaming → MIBR é o caminho do núcleo brasileiro bicampeão de Major. Copenhagen Wolves, Dignitas e TSM
            antes da Astralis marcam a geração dinamarquesa. MOUZ → FaZe aparece na carreira de vários dos melhores riflers
            europeus da última década.
          </p>
          <h2>Um palpite errado ainda ajuda</h2>
          <p>
            Cada erro revela o próximo time. Então, em vez de pensar demais no primeiro palpite, chute o candidato mais provável:
            se errar, a pista seguinte costuma resolver.
          </p>
          <h2>Times grandes no fim da carreira</h2>
          <p>
            Quando os times acabam, o jogo mostra o país e depois a função. Se você já sabe a região pelos times iniciais, o país
            confirma a geração, e a função separa AWPers de riflers e IGLs.
          </p>
        </>
      ),
      en: (
        <>
          <h2>The first teams tell you the region</h2>
          <p>
            Academy rosters and local organizations almost always reveal the home country. Academies like Team Spirit Academy
            point to CIS; stints at Games Academy or Luminosity usually mean the Brazilian generation that won in 2016.
          </p>
          <h2>Some sequences are signatures</h2>
          <p>
            Luminosity → SK Gaming → MIBR is the path of the Brazilian core that won two Majors. Copenhagen Wolves, Dignitas and
            TSM before Astralis mark the Danish generation. MOUZ → FaZe shows up in the careers of several of the best European
            riflers of the last decade.
          </p>
          <h2>A wrong guess still helps</h2>
          <p>
            Each miss reveals the next team. So instead of overthinking your first guess, go with the most likely candidate: if
            you miss, the next clue often settles it.
          </p>
          <h2>Big teams late in the career</h2>
          <p>
            Once the teams run out, the game shows the country and then the role. If you already know the region from the early
            teams, the country confirms the generation, and the role separates AWPers from riflers and IGLs.
          </p>
        </>
      ),
      es: (
        <>
          <h2>Los primeros equipos dicen la región</h2>
          <p>
            Las academias y organizaciones locales casi siempre revelan el país de origen. Academias como Team Spirit Academy
            apuntan a la CIS; pasar por Games Academy o Luminosity suele indicar la generación brasileña campeona de 2016.
          </p>
          <h2>Algunas secuencias son firmas</h2>
          <p>
            Luminosity → SK Gaming → MIBR es el camino del núcleo brasileño bicampeón de Major. Copenhagen Wolves, Dignitas y TSM
            antes de Astralis marcan la generación danesa. MOUZ → FaZe aparece en la carrera de varios de los mejores riflers
            europeos de la última década.
          </p>
          <h2>Un intento fallido también ayuda</h2>
          <p>
            Cada error revela el siguiente equipo. En vez de pensar demasiado el primer intento, prueba con el candidato más
            probable: si fallas, la pista siguiente suele resolverlo.
          </p>
          <h2>Equipos grandes al final de la carrera</h2>
          <p>
            Cuando se acaban los equipos, el juego muestra el país y después el rol. Si ya conoces la región por los primeros
            equipos, el país confirma la generación y el rol separa AWPers de riflers e IGLs.
          </p>
        </>
      ),
    },
  },
  {
    slug: "guess-the-player-tips",
    gameHref: "/guess-name",
    title: {
      pt: "Adivinhe o jogador: como acertar os nomes reais em 10 segundos",
      en: "Guess the player: how to get the real names right in 10 seconds",
      es: "Adivina el jugador: cómo acertar los nombres reales en 10 segundos",
    },
    intro: {
      pt: "As opções erradas são da mesma nacionalidade. Os nomes que vale decorar e como decidir antes de o tempo acabar.",
      en: "The wrong options share the player's nationality. The names worth memorizing and how to decide before time runs out.",
      es: "Las opciones incorrectas son de la misma nacionalidad. Los nombres que vale memorizar y cómo decidir antes de que se acabe el tiempo.",
    },
    cta: { pt: "Jogar o Adivinhe o jogador", en: "Play Guess the player", es: "Jugar a Adivina el jugador" },
    content: {
      pt: (
        <>
          <h2>Por que as opções se parecem</h2>
          <p>
            Para o jogo não virar só reconhecer o país, as opções erradas costumam ser de jogadores da mesma nacionalidade. Então
            a dica não é &ldquo;esse nome é dinamarquês&rdquo;, e sim lembrar qual dinamarquês é qual.
          </p>
          <h2>Comece pelos nomes que todo mundo deveria saber</h2>
          <ul>
            <li>s1mple: Oleksandr Kostyliev (Ucrânia)</li>
            <li>ZywOo: Mathieu Herbaut (França)</li>
            <li>NiKo: Nikola Kovač (Bósnia e Herzegovina)</li>
            <li>dev1ce: Nicolai Reedtz (Dinamarca)</li>
            <li>FalleN: Gabriel Toledo (Brasil)</li>
            <li>coldzera: Marcelo David (Brasil)</li>
            <li>donk: Danil Kryshkovets (Rússia)</li>
          </ul>
          <h2>Nicks que vêm do nome</h2>
          <p>
            Muitos nicks são pedaços do nome real: o nome curto, as iniciais ou um apelido de família. Antes de olhar as opções,
            pergunte se alguma delas &ldquo;contém&rdquo; o nick.
          </p>
          <h2>Cuidado com o relógio</h2>
          <p>
            São 10 segundos por nome e 3 vidas para 20 nomes. Trocar de aba não pausa o tempo, e recarregar conta como erro. Se
            não souber, escolha rápido a opção mais provável: deixar o tempo acabar também tira uma vida.
          </p>
        </>
      ),
      en: (
        <>
          <h2>Why the options look alike</h2>
          <p>
            So the game isn&apos;t just about recognizing the country, the wrong options are usually players of the same
            nationality. The trick is not &ldquo;this name is Danish&rdquo; but remembering which Dane is which.
          </p>
          <h2>Start with the names everyone should know</h2>
          <ul>
            <li>s1mple: Oleksandr Kostyliev (Ukraine)</li>
            <li>ZywOo: Mathieu Herbaut (France)</li>
            <li>NiKo: Nikola Kovač (Bosnia and Herzegovina)</li>
            <li>dev1ce: Nicolai Reedtz (Denmark)</li>
            <li>FalleN: Gabriel Toledo (Brazil)</li>
            <li>coldzera: Marcelo David (Brazil)</li>
            <li>donk: Danil Kryshkovets (Russia)</li>
          </ul>
          <h2>Nicknames that come from the name</h2>
          <p>
            Many nicknames are pieces of the real name: a short first name, initials or a family nickname. Before reading the
            options, ask whether any of them &ldquo;contains&rdquo; the nickname.
          </p>
          <h2>Watch the clock</h2>
          <p>
            You get 10 seconds per name and 3 lives for 20 names. Switching tabs doesn&apos;t pause the timer, and reloading
            counts as a miss. If you don&apos;t know, quickly pick the most likely option: letting time run out also costs a life.
          </p>
        </>
      ),
      es: (
        <>
          <h2>Por qué las opciones se parecen</h2>
          <p>
            Para que el juego no sea solo reconocer el país, las opciones incorrectas suelen ser de jugadores de la misma
            nacionalidad. El truco no es &ldquo;este nombre es danés&rdquo;, sino recordar qué danés es cuál.
          </p>
          <h2>Empieza por los nombres que todos deberían saber</h2>
          <ul>
            <li>s1mple: Oleksandr Kostyliev (Ucrania)</li>
            <li>ZywOo: Mathieu Herbaut (Francia)</li>
            <li>NiKo: Nikola Kovač (Bosnia y Herzegovina)</li>
            <li>dev1ce: Nicolai Reedtz (Dinamarca)</li>
            <li>FalleN: Gabriel Toledo (Brasil)</li>
            <li>coldzera: Marcelo David (Brasil)</li>
            <li>donk: Danil Kryshkovets (Rusia)</li>
          </ul>
          <h2>Nicks que salen del nombre</h2>
          <p>
            Muchos nicks son partes del nombre real: el nombre corto, las iniciales o un apodo familiar. Antes de mirar las
            opciones, pregúntate si alguna &ldquo;contiene&rdquo; el nick.
          </p>
          <h2>Cuidado con el reloj</h2>
          <p>
            Son 10 segundos por nombre y 3 vidas para 20 nombres. Cambiar de pestaña no pausa el tiempo y recargar cuenta como
            error. Si no lo sabes, elige rápido la opción más probable: dejar que se acabe el tiempo también quita una vida.
          </p>
        </>
      ),
    },
  },
];

export const getStrategyGuide = (slug: string) => strategyGuides.find((guide) => guide.slug === slug);
