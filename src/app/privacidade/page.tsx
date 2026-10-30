import { LegalPage } from "@/components/legal/LegalPage";
import { pageSeo } from "@/data/pageSeo";
import { adsenseClient } from "@/lib/adsense";
import { localizedMetadata } from "@/lib/seo";

export const generateMetadata = () => localizedMetadata(pageSeo.privacy);

// Os textos sobre o Google só aparecem quando o AdSense está configurado (ver src/lib/adsense.ts).
const googleAds = Boolean(adsenseClient);
const partnerSitesUrl = "https://policies.google.com/technologies/partner-sites";
const adSettingsUrl = "https://adssettings.google.com";

const content = {
  pt: (
    <>
      <p>
        Esta política explica quais dados o CS Games usa e por quê, conforme a Lei Geral de Proteção de Dados (Lei
        13.709/2018).
      </p>

      <h2>O que guardamos</h2>
      <p>Você joga sem cadastro. Guardamos apenas no seu próprio navegador (armazenamento local):</p>
      <ul>
        <li>o andamento e o resultado dos desafios do dia (CS Bingo, Jogador misterioso, Adivinhe o jogador e Caminho de carreira);</li>
        <li>suas estatísticas e sequência de dias jogados;</li>
        <li>o idioma escolhido.</li>
      </ul>
      <p>
        Esses dados não são enviados para nossos servidores. Você pode apagá-los a qualquer momento limpando os dados do
        site no seu navegador.
      </p>

      <h2>Bingo multiplayer</h2>
      <p>
        No modo multiplayer, o apelido que você digita e o andamento da partida (casas preenchidas, pontos e vidas) são
        enviados em tempo real aos outros jogadores da sala pelo Supabase Realtime. Essas informações só circulam
        enquanto a sala está aberta e não ficam guardadas em banco de dados. Não use seu nome completo como apelido.
      </p>

      <h2>Métricas de audiência</h2>
      <p>
        Usamos o Vercel Web Analytics para contar visitas e entender quais páginas são mais usadas. Ele não usa
        cookies e não identifica você: registra de forma anônima e agregada a página visitada, o site de origem, o país,
        o tipo de dispositivo, o sistema e o navegador. Não há como ligar esses números a uma pessoa, e eles não são
        usados para publicidade.
      </p>

      <h2>Publicidade</h2>
      {googleAds ? (
        <>
          <p>
            O site exibe anúncios identificados como &ldquo;Publicidade&rdquo;. Alguns são vendidos diretamente a
            patrocinadores; os demais são servidos pelo Google AdSense. O Google e seus parceiros usam cookies e
            identificadores para exibir anúncios, medir resultados e evitar fraudes e, com o seu consentimento,
            personalizá-los com base nas suas visitas a este e a outros sites.
          </p>
          <p>
            Quem visita da Europa, do Reino Unido ou da Suíça vê uma mensagem para aceitar ou recusar. Em qualquer lugar,
            você pode desativar anúncios personalizados nas <a href={adSettingsUrl}>Configurações de anúncios do Google</a>.
            Veja <a href={partnerSitesUrl}>como o Google usa dados de sites parceiros</a>. Ao clicar em um anúncio, você vai
            para o site do anunciante, que tem sua própria política de privacidade.
          </p>
        </>
      ) : (
        <p>
          O site exibe anúncios de patrocinadores, identificados como &ldquo;Publicidade&rdquo;. Ao clicar em um anúncio,
          você vai para o site do anunciante, que tem sua própria política de privacidade. Não compartilhamos dados seus
          com anunciantes.
        </p>
      )}

      <h2>Mudanças</h2>
      <p>
        {googleAds
          ? "Se passarmos a usar contas de usuário, esta política será atualizada antes."
          : "Se passarmos a usar contas de usuário ou cookies, esta política será atualizada antes, e pediremos seu consentimento quando a lei exigir."}
      </p>

      <h2>Seus direitos</h2>
      <p>
        Você pode pedir informações sobre seus dados, correção ou exclusão. Como hoje os dados ficam só no seu navegador,
        você mesmo pode apagá-los.
      </p>
    </>
  ),
  en: (
    <>
      <p>
        This policy explains what data CS Games uses and why, in accordance with Brazil&apos;s General Data Protection
        Law (LGPD, Law 13.709/2018).
      </p>

      <h2>What we store</h2>
      <p>You play without signing up. We only store, in your own browser (local storage):</p>
      <ul>
        <li>the progress and result of the daily challenges (CS Bingo, Mystery player, Guess the player and Career path);</li>
        <li>your stats and streak of days played;</li>
        <li>your chosen language.</li>
      </ul>
      <p>
        This data is not sent to our servers. You can delete it at any time by clearing the site data in your browser.
      </p>

      <h2>Bingo multiplayer</h2>
      <p>
        In multiplayer mode, the nickname you type and your game progress (filled cells, points and lives) are sent in
        real time to the other players in the room through Supabase Realtime. This information only travels while the
        room is open and is not stored in any database. Don&apos;t use your full name as a nickname.
      </p>

      <h2>Audience metrics</h2>
      <p>
        We use Vercel Web Analytics to count visits and see which pages are used the most. It uses no cookies and does
        not identify you: it records, anonymously and in aggregate, the page visited, the referring site, country,
        device type, operating system and browser. These numbers cannot be tied to a person and are not used for
        advertising.
      </p>

      <h2>Advertising</h2>
      {googleAds ? (
        <>
          <p>
            The site shows ads labeled as &ldquo;Advertisement&rdquo;. Some are sold directly to sponsors; the rest are
            served by Google AdSense. Google and its partners use cookies and identifiers to show ads, measure results and
            prevent fraud and, with your consent, to personalize them based on your visits to this and other sites.
          </p>
          <p>
            Visitors from Europe, the UK or Switzerland see a message to accept or decline. Anywhere, you can turn off
            personalized ads in <a href={adSettingsUrl}>Google&apos;s Ad Settings</a>. See{" "}
            <a href={partnerSitesUrl}>how Google uses data from partner sites</a>. If you click an ad, you go to the
            advertiser&apos;s site, which has its own privacy policy.
          </p>
        </>
      ) : (
        <p>
          The site shows sponsor ads, labeled as &ldquo;Advertisement&rdquo;. If you click an ad, you go to the
          advertiser&apos;s site, which has its own privacy policy. We do not share your data with advertisers.
        </p>
      )}

      <h2>Changes</h2>
      <p>
        {googleAds
          ? "If we start using user accounts, this policy will be updated beforehand."
          : "If we start using user accounts or cookies, this policy will be updated beforehand, and we will ask for your consent where the law requires it."}
      </p>

      <h2>Your rights</h2>
      <p>
        You can request information about your data, its correction or deletion. Since the data currently stays only in
        your browser, you can delete it yourself.
      </p>
    </>
  ),
  es: (
    <>
      <p>
        Esta política explica qué datos usa CS Games y por qué, de acuerdo con la Ley General de Protección de Datos de
        Brasil (LGPD, Ley 13.709/2018).
      </p>

      <h2>Qué guardamos</h2>
      <p>Juegas sin registrarte. Solo guardamos en tu propio navegador (almacenamiento local):</p>
      <ul>
        <li>el progreso y el resultado de los desafíos del día (CS Bingo, Jugador misterioso, Adivina el jugador y Camino de carrera);</li>
        <li>tus estadísticas y racha de días jugados;</li>
        <li>el idioma elegido.</li>
      </ul>
      <p>
        Estos datos no se envían a nuestros servidores. Puedes borrarlos en cualquier momento limpiando los datos del sitio
        en tu navegador.
      </p>

      <h2>Bingo multijugador</h2>
      <p>
        En el modo multijugador, el apodo que escribes y el progreso de la partida (casillas llenas, puntos y vidas) se
        envían en tiempo real a los demás jugadores de la sala mediante Supabase Realtime. Esta información solo circula
        mientras la sala está abierta y no se guarda en ninguna base de datos. No uses tu nombre completo como apodo.
      </p>

      <h2>Métricas de audiencia</h2>
      <p>
        Usamos Vercel Web Analytics para contar visitas y saber qué páginas se usan más. No usa cookies y no te
        identifica: registra de forma anónima y agregada la página visitada, el sitio de origen, el país, el tipo de
        dispositivo, el sistema operativo y el navegador. Estos números no se pueden vincular a una persona y no se usan
        para publicidad.
      </p>

      <h2>Publicidad</h2>
      {googleAds ? (
        <>
          <p>
            El sitio muestra anuncios identificados como &ldquo;Publicidad&rdquo;. Algunos se venden directamente a
            patrocinadores; los demás los sirve Google AdSense. Google y sus socios usan cookies e identificadores para
            mostrar anuncios, medir resultados y evitar fraudes y, con tu consentimiento, personalizarlos según tus visitas
            a este y otros sitios.
          </p>
          <p>
            Quienes visitan desde Europa, el Reino Unido o Suiza ven un mensaje para aceptar o rechazar. En cualquier
            lugar, puedes desactivar los anuncios personalizados en la{" "}
            <a href={adSettingsUrl}>Configuración de anuncios de Google</a>. Mira{" "}
            <a href={partnerSitesUrl}>cómo usa Google los datos de sitios asociados</a>. Al hacer clic en un anuncio, vas
            al sitio del anunciante, que tiene su propia política de privacidad.
          </p>
        </>
      ) : (
        <p>
          El sitio muestra anuncios de patrocinadores, identificados como &ldquo;Publicidad&rdquo;. Al hacer clic en un
          anuncio, vas al sitio del anunciante, que tiene su propia política de privacidad. No compartimos tus datos con
          anunciantes.
        </p>
      )}

      <h2>Cambios</h2>
      <p>
        {googleAds
          ? "Si empezamos a usar cuentas de usuario, esta política se actualizará antes."
          : "Si empezamos a usar cuentas de usuario o cookies, esta política se actualizará antes y pediremos tu consentimiento cuando la ley lo exija."}
      </p>

      <h2>Tus derechos</h2>
      <p>
        Puedes solicitar información sobre tus datos, su corrección o eliminación. Como hoy los datos quedan solo en tu
        navegador, puedes borrarlos tú mismo.
      </p>
    </>
  ),
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title={{ pt: "Política de privacidade", en: "Privacy policy", es: "Política de privacidad" }}
      updatedAt="2026-10-28"
      content={content}
    />
  );
}
