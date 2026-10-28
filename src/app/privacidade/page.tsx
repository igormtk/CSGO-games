import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Política de privacidade",
  alternates: { canonical: "/privacidade" },
};

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
        <li>o andamento e o resultado das partidas do dia (CS Bingo e Jogador misterioso);</li>
        <li>suas estatísticas e sequência de dias jogados;</li>
        <li>o idioma escolhido e o seu recorde no Adivinhe o jogador.</li>
      </ul>
      <p>
        Esses dados não são enviados para nossos servidores. Você pode apagá-los a qualquer momento limpando os dados do
        site no seu navegador.
      </p>

      <h2>Publicidade</h2>
      <p>
        O site exibe anúncios de patrocinadores, identificados como &ldquo;Publicidade&rdquo;. Ao clicar em um anúncio,
        você vai para o site do anunciante, que tem sua própria política de privacidade. Não compartilhamos dados seus com
        anunciantes.
      </p>

      <h2>Mudanças</h2>
      <p>
        Se passarmos a usar contas de usuário, métricas de audiência ou cookies, esta política será atualizada antes, e
        pediremos seu consentimento quando a lei exigir.
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
        <li>the progress and result of the daily games (CS Bingo and Mystery player);</li>
        <li>your stats and streak of days played;</li>
        <li>your chosen language and your Guess the player record.</li>
      </ul>
      <p>
        This data is not sent to our servers. You can delete it at any time by clearing the site data in your browser.
      </p>

      <h2>Advertising</h2>
      <p>
        The site shows sponsor ads, labeled as &ldquo;Advertisement&rdquo;. If you click an ad, you go to the
        advertiser&apos;s site, which has its own privacy policy. We do not share your data with advertisers.
      </p>

      <h2>Changes</h2>
      <p>
        If we start using user accounts, audience metrics or cookies, this policy will be updated beforehand, and we will
        ask for your consent where the law requires it.
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
        <li>el progreso y el resultado de las partidas del día (CS Bingo y Jugador misterioso);</li>
        <li>tus estadísticas y racha de días jugados;</li>
        <li>el idioma elegido y tu récord en Adivina el jugador.</li>
      </ul>
      <p>
        Estos datos no se envían a nuestros servidores. Puedes borrarlos en cualquier momento limpiando los datos del sitio
        en tu navegador.
      </p>

      <h2>Publicidad</h2>
      <p>
        El sitio muestra anuncios de patrocinadores, identificados como &ldquo;Publicidad&rdquo;. Al hacer clic en un
        anuncio, vas al sitio del anunciante, que tiene su propia política de privacidad. No compartimos tus datos con
        anunciantes.
      </p>

      <h2>Cambios</h2>
      <p>
        Si empezamos a usar cuentas de usuario, métricas de audiencia o cookies, esta política se actualizará antes y
        pediremos tu consentimiento cuando la ley lo exija.
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
