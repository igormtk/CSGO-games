import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of use",
  alternates: { canonical: "/termos" },
};

const linkClass = "text-cs-orange underline";

const LiquipediaLink = () => (
  <a className={linkClass} href="https://liquipedia.net/counterstrike/" target="_blank" rel="noopener noreferrer">
    Liquipedia
  </a>
);

const LicenseLink = () => (
  <a className={linkClass} href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer">
    CC BY-SA 3.0
  </a>
);

const content = {
  pt: (
    <>
      <p>Ao usar o CS Games, você concorda com estes termos.</p>

      <h2>Uso do site</h2>
      <p>
        Os jogos são gratuitos e para entretenimento. Não garantimos que o site fique sempre no ar nem que os dados dos
        jogadores estejam sempre atualizados.
      </p>

      <h2>Dados dos jogadores</h2>
      <p>
        As informações sobre jogadores, times e técnicos vêm de fontes públicas, incluindo o <LiquipediaLink />, sob a
        licença <LicenseLink />. Encontrou um erro? Fale com a gente.
      </p>

      <h2>Marcas</h2>
      <p>
        O CS Games não é afiliado, patrocinado nem endossado pela Valve Corporation. Counter-Strike é marca registrada da
        Valve. Nomes e logos de times, assim como nomes de jogadores, pertencem aos seus donos e aparecem apenas para
        identificação, sem relação de parceria. Se você representa um time e quer que a logo seja removida, fale com a
        gente que tiramos do ar.
      </p>

      <h2>Anúncios</h2>
      <p>
        Os anúncios são de responsabilidade dos anunciantes. Produtos e serviços anunciados não são garantidos pelo CS
        Games.
      </p>
    </>
  ),
  en: (
    <>
      <p>By using CS Games, you agree to these terms.</p>

      <h2>Use of the site</h2>
      <p>
        The games are free and for entertainment. We do not guarantee that the site will always be available or that
        player data will always be up to date.
      </p>

      <h2>Player data</h2>
      <p>
        Information about players, teams and coaches comes from public sources, including <LiquipediaLink />, under the{" "}
        <LicenseLink /> license. Found a mistake? Let us know.
      </p>

      <h2>Trademarks</h2>
      <p>
        CS Games is not affiliated with, sponsored or endorsed by Valve Corporation. Counter-Strike is a registered
        trademark of Valve. Team names and logos, as well as player names, belong to their owners and are shown for
        identification only, with no partnership implied. If you represent a team and want its logo removed, contact us
        and we will take it down.
      </p>

      <h2>Advertising</h2>
      <p>
        Advertisers are responsible for their ads. Advertised products and services are not guaranteed by CS Games.
      </p>
    </>
  ),
  es: (
    <>
      <p>Al usar CS Games, aceptas estos términos.</p>

      <h2>Uso del sitio</h2>
      <p>
        Los juegos son gratuitos y de entretenimiento. No garantizamos que el sitio esté siempre disponible ni que los
        datos de los jugadores estén siempre actualizados.
      </p>

      <h2>Datos de los jugadores</h2>
      <p>
        La información sobre jugadores, equipos y entrenadores proviene de fuentes públicas, incluida <LiquipediaLink />,
        bajo la licencia <LicenseLink />. ¿Encontraste un error? Escríbenos.
      </p>

      <h2>Marcas</h2>
      <p>
        CS Games no está afiliado, patrocinado ni respaldado por Valve Corporation. Counter-Strike es una marca registrada
        de Valve. Los nombres y logos de los equipos, así como los nombres de los jugadores, pertenecen a sus dueños y se
        muestran solo para identificarlos, sin relación de patrocinio. Si representas a un equipo y quieres que retiremos
        su logo, contáctanos y lo quitaremos.
      </p>

      <h2>Anuncios</h2>
      <p>
        Los anuncios son responsabilidad de los anunciantes. CS Games no garantiza los productos ni servicios anunciados.
      </p>
    </>
  ),
};

export default function TermsPage() {
  return (
    <LegalPage
      title={{ pt: "Termos de uso", en: "Terms of use", es: "Términos de uso" }}
      updatedAt="2026-10-27"
      content={content}
    />
  );
}
