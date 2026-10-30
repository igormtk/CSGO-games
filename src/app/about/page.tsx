import Link from "@/components/LocalLink";
import { LegalPage } from "@/components/legal/LegalPage";
import { csPlayers, csTeams } from "@/data/csBingoDatabase";
import { pageSeo } from "@/data/pageSeo";
import { localizedMetadata } from "@/lib/seo";

export const generateMetadata = () => localizedMetadata(pageSeo.about);

const players = csPlayers.length;
const teams = csTeams.length;

const content = {
  pt: (
    <>
      <p>
        O CS Games é um projeto independente, feito no Brasil por fãs de Counter-Strike, com mini games diários sobre a cena
        profissional de CS2 e CS:GO. A ideia é simples: um desafio rápido por dia, igual para todo mundo, para testar e
        comparar com os amigos o quanto você conhece os pro players.
      </p>

      <h2>Os jogos</h2>
      <ul>
        <li><Link href="/bingo">CS Bingo</Link>: encaixe pro players numa cartela 4x4 cruzando times, países, funções e conquistas.</li>
        <li><Link href="/jogador-misterioso">Jogador misterioso</Link>: descubra o jogador do dia em 6 palpites.</li>
        <li><Link href="/career-path">Caminho de carreira</Link>: adivinhe o jogador pela sequência de times.</li>
        <li><Link href="/guess-name">Adivinhe o jogador</Link>: acerte o nome real de 20 pro players.</li>
        <li><Link href="/bingo/multiplayer">Bingo multiplayer</Link>: dispute a mesma cartela com amigos em tempo real.</li>
      </ul>
      <p>
        Também publicamos <Link href="/guides">guias de estratégia e listas de estatísticas</Link> da cena.
      </p>

      <h2>Como os desafios são montados</h2>
      <p>
        Cada desafio diário é sorteado a partir da data, sempre do mesmo jeito, então todo mundo recebe o mesmo jogo. Ele muda
        à meia-noite no horário de Brasília (UTC−3). Não há conta nem cadastro: o andamento fica salvo só no seu navegador.
      </p>

      <h2>De onde vêm os dados</h2>
      <p>
        A base tem {players} pro players e {teams} times, com histórico de times, nacionalidade, funções, títulos de Major,
        prêmios de MVP e aparições no Top 20 da HLTV. Os dados vêm do{" "}
        <a href="https://liquipedia.net/counterstrike/" target="_blank" rel="noopener noreferrer">Liquipedia</a>, sob a licença
        CC BY-SA, e os times atuais são atualizados toda semana. Achou um erro? Escreva para o contato abaixo.
      </p>

      <h2>Publicidade</h2>
      <p>
        Os jogos são gratuitos e se pagam com anúncios, sempre identificados como &ldquo;Publicidade&rdquo;. Marcas que queiram
        falar com quem joga CS todo dia podem usar o mesmo contato. Detalhes sobre dados e cookies estão na{" "}
        <Link href="/privacidade">política de privacidade</Link>.
      </p>

      <h2>Aviso</h2>
      <p>
        O CS Games não é afiliado à Valve, à HLTV nem ao Liquipedia. Counter-Strike e os nomes de times pertencem aos seus
        donos.
      </p>
    </>
  ),
  en: (
    <>
      <p>
        CS Games is an independent project, made in Brazil by Counter-Strike fans, with daily mini games about the CS2 and
        CS:GO pro scene. The idea is simple: one quick challenge a day, the same for everyone, to test how well you know the pro
        players and compare with your friends.
      </p>

      <h2>The games</h2>
      <ul>
        <li><Link href="/bingo">CS Bingo</Link>: fit pro players into a 4x4 board by matching teams, countries, roles and achievements.</li>
        <li><Link href="/jogador-misterioso">Mystery player</Link>: find the player of the day in 6 guesses.</li>
        <li><Link href="/career-path">Career path</Link>: guess the player from their sequence of teams.</li>
        <li><Link href="/guess-name">Guess the player</Link>: name the real names of 20 pro players.</li>
        <li><Link href="/bingo/multiplayer">Bingo multiplayer</Link>: race friends on the same board in real time.</li>
      </ul>
      <p>
        We also publish <Link href="/guides">strategy guides and stats lists</Link> about the scene.
      </p>

      <h2>How the challenges are built</h2>
      <p>
        Each daily challenge is drawn from the date, always the same way, so everyone gets the same game. It changes at midnight
        Brasília time (UTC−3). There is no account or sign-up: your progress is saved only in your browser.
      </p>

      <h2>Where the data comes from</h2>
      <p>
        The database covers {players} pro players and {teams} teams, with team history, nationality, roles, Major titles, MVP
        awards and HLTV Top 20 appearances. The data comes from{" "}
        <a href="https://liquipedia.net/counterstrike/" target="_blank" rel="noopener noreferrer">Liquipedia</a>, under the CC
        BY-SA license, and current teams are updated weekly. Found a mistake? Write to the contact below.
      </p>

      <h2>Advertising</h2>
      <p>
        The games are free and paid for by ads, always labeled as &ldquo;Advertisement&rdquo;. Brands that want to reach people
        who play CS every day can use the same contact. Details about data and cookies are in the{" "}
        <Link href="/privacidade">privacy policy</Link>.
      </p>

      <h2>Disclaimer</h2>
      <p>
        CS Games is not affiliated with Valve, HLTV or Liquipedia. Counter-Strike and team names belong to their respective
        owners.
      </p>
    </>
  ),
  es: (
    <>
      <p>
        CS Games es un proyecto independiente, hecho en Brasil por fans de Counter-Strike, con mini juegos diarios sobre la
        escena profesional de CS2 y CS:GO. La idea es simple: un desafío rápido por día, igual para todos, para poner a prueba
        cuánto conoces a los pro players y compararte con tus amigos.
      </p>

      <h2>Los juegos</h2>
      <ul>
        <li><Link href="/bingo">CS Bingo</Link>: coloca pro players en un cartón 4x4 cruzando equipos, países, roles y logros.</li>
        <li><Link href="/jogador-misterioso">Jugador misterioso</Link>: descubre al jugador del día en 6 intentos.</li>
        <li><Link href="/career-path">Camino de carrera</Link>: adivina al jugador por su secuencia de equipos.</li>
        <li><Link href="/guess-name">Adivina el jugador</Link>: acierta el nombre real de 20 pro players.</li>
        <li><Link href="/bingo/multiplayer">Bingo multijugador</Link>: compite con amigos en el mismo cartón en tiempo real.</li>
      </ul>
      <p>
        También publicamos <Link href="/guides">guías de estrategia y listas de estadísticas</Link> de la escena.
      </p>

      <h2>Cómo se arman los desafíos</h2>
      <p>
        Cada desafío diario se sortea a partir de la fecha, siempre de la misma manera, así que todos reciben el mismo juego.
        Cambia a medianoche, hora de Brasilia (UTC−3). No hay cuenta ni registro: tu progreso se guarda solo en tu navegador.
      </p>

      <h2>De dónde salen los datos</h2>
      <p>
        La base tiene {players} pro players y {teams} equipos, con historial de equipos, nacionalidad, roles, títulos de Major,
        premios MVP y apariciones en el Top 20 de HLTV. Los datos vienen de{" "}
        <a href="https://liquipedia.net/counterstrike/" target="_blank" rel="noopener noreferrer">Liquipedia</a>, bajo la
        licencia CC BY-SA, y los equipos actuales se actualizan cada semana. ¿Encontraste un error? Escribe al contacto de abajo.
      </p>

      <h2>Publicidad</h2>
      <p>
        Los juegos son gratis y se financian con anuncios, siempre identificados como &ldquo;Publicidad&rdquo;. Las marcas que
        quieran llegar a quienes juegan CS todos los días pueden usar el mismo contacto. Los detalles sobre datos y cookies
        están en la <Link href="/privacidade">política de privacidad</Link>.
      </p>

      <h2>Aviso</h2>
      <p>
        CS Games no está afiliado a Valve, HLTV ni Liquipedia. Counter-Strike y los nombres de los equipos pertenecen a sus
        respectivos dueños.
      </p>
    </>
  ),
};

export default function AboutPage() {
  return (
    <LegalPage title={{ pt: "Sobre o CS Games", en: "About CS Games", es: "Acerca de CS Games" }} updatedAt="2026-10-29" content={content} />
  );
}
