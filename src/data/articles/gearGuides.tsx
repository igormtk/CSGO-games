import { AffiliateDisclosure, AmazonLink } from "@/components/content/AmazonLink";
import type { StrategyGuide } from "./strategyGuides";

// Guias de equipamento: texto próprio com links de afiliado da Amazon (src/data/gear.ts).
// Os produtos citados são exemplos de cada tipo, sem preço: preço muda e o programa da Amazon não
// permite mostrar valores copiados da loja.

export const gearGuides: StrategyGuide[] = [
  {
    slug: "cs2-gear-guide",
    gameHref: "/",
    kind: "gear",
    title: {
      pt: "Equipamento para CS2: como escolher mouse, mousepad, headset e monitor",
      en: "CS2 gear guide: how to choose a mouse, mousepad, headset and monitor",
      es: "Equipo para CS2: cómo elegir mouse, mousepad, auriculares y monitor",
    },
    intro: {
      pt: "O que realmente faz diferença no Counter-Strike, o que é só marketing e por onde começar se o orçamento é curto.",
      en: "What actually matters in Counter-Strike, what is just marketing and where to start on a tight budget.",
      es: "Qué importa de verdad en Counter-Strike, qué es solo marketing y por dónde empezar si el presupuesto es corto.",
    },
    cta: { pt: "Jogar os desafios de hoje", en: "Play today's challenges", es: "Jugar los desafíos de hoy" },
    content: {
      pt: (
        <>
          <AffiliateDisclosure language="pt" />
          <h2>Por onde começar</h2>
          <p>
            Se for trocar uma coisa só, troque o mouse ou o mousepad. No CS a mira depende de movimentos pequenos e repetidos,
            e é aí que um mouse ruim ou uma superfície gasta atrapalham. Monitor rápido vem depois, e headset caro é o último
            item da lista: um fone simples já mostra de onde vêm os passos.
          </p>

          <h2>Mouse: formato antes de ficha técnica</h2>
          <p>
            Qualquer sensor de mouse gamer atual é preciso o bastante para o CS. O que muda de verdade é o formato, que precisa
            caber na sua mão e no seu jeito de segurar (palma, garra ou ponta dos dedos), e o peso: mouses leves, abaixo de uns
            70 gramas, cansam menos em sensibilidade baixa, que é o padrão no competitivo.
          </p>
          <ul>
            <li>
              Leve e simétrico, para quase todo tipo de pegada: <AmazonLink product="logitech-g-pro-x-superlight-2" />.
            </li>
            <li>
              Ergonômico, para quem apoia a mão inteira: <AmazonLink product="razer-deathadder-v3" /> ou{" "}
              <AmazonLink product="zowie-ec2-c" />.
            </li>
          </ul>
          <p>
            Taxa de atualização de 1000 Hz já é suficiente; 4000 Hz ou mais ajuda pouco e gasta mais bateria. Sem fio deixou
            de ser problema: os modelos bons não têm atraso perceptível.
          </p>

          <h2>Mousepad: grande e de controle</h2>
          <p>
            Com sensibilidade baixa você move o braço, não só o pulso, então o mousepad precisa ser grande (pelo menos uns 45 cm
            de largura). Superfícies de tecido &ldquo;de controle&rdquo; freiam um pouco o mouse e ajudam a parar a mira no
            lugar; as &ldquo;de velocidade&rdquo; deslizam mais e combinam com quem gira muito. Na dúvida, comece pelo controle:{" "}
            <AmazonLink product="zowie-g-sr" /> ou <AmazonLink product="steelseries-qck-heavy" />. Troque o mousepad quando a
            área onde você mira mais começar a ficar lisa.
          </p>

          <h2>Headset: som estéreo e conforto</h2>
          <p>
            Para ouvir passos, o que importa é o som estéreo limpo e um fone que não aperte depois de três mapas. Som
            &ldquo;7.1&rdquo; virtual costuma mais atrapalhar do que ajudar no CS2, que já tem seu próprio processamento de
            áudio. Um modelo como o <AmazonLink product="hyperx-cloud-ii" /> resolve; se você já tem um fone bom de música,
            pode usá-lo com um microfone separado.
          </p>

          <h2>Monitor: taxa de atualização é o que conta</h2>
          <p>
            Sair de 60 Hz para 144 Hz é a maior melhora que um monitor pode dar. De 144 para 240 Hz a diferença ainda aparece em
            quem joga muito, desde que o computador consiga manter o FPS acima disso. Monitores de 24 polegadas são o padrão no
            competitivo porque você enxerga a tela toda sem mexer a cabeça. Um exemplo feito para isso é o{" "}
            <AmazonLink product="zowie-xl2546k" />.
          </p>

          <h2>Teclado: menor é melhor</h2>
          <p>
            Um teclado sem a parte numérica (o formato TKL ou menor) deixa mais espaço para o mouse. Teclados com acionamento
            ajustável, como o <AmazonLink product="steelseries-apex-pro-tkl" />, deixam a tecla responder com menos curso, o
            que ajuda na troca rápida de direção. É o último item a trocar: qualquer teclado mecânico funciona bem.
          </p>

          <h2>O que não faz diferença</h2>
          <ul>
            <li>DPI altíssimo: quase todos os profissionais jogam entre 400 e 1600 DPI.</li>
            <li>Iluminação RGB, botões extras e software cheio de efeitos.</li>
            <li>Comprar o mesmo modelo do seu jogador favorito: o que serve para a mão dele pode não servir para a sua.</li>
          </ul>
        </>
      ),
      en: (
        <>
          <AffiliateDisclosure language="en" />
          <h2>Where to start</h2>
          <p>
            If you only upgrade one thing, make it the mouse or the mousepad. Aim in CS comes from small, repeated movements,
            and that is where a bad mouse or a worn surface gets in the way. A fast monitor comes next, and an expensive headset
            is last on the list: a simple pair already tells you where footsteps come from.
          </p>

          <h2>Mouse: shape before specs</h2>
          <p>
            Any current gaming mouse sensor is accurate enough for CS. What really matters is the shape, which has to fit your
            hand and your grip (palm, claw or fingertip), and the weight: light mice, under about 70 grams, are less tiring at
            low sensitivity, which is the norm in competitive play.
          </p>
          <ul>
            <li>
              Light and symmetrical, for almost any grip: <AmazonLink product="logitech-g-pro-x-superlight-2" />.
            </li>
            <li>
              Ergonomic, for palm grip: <AmazonLink product="razer-deathadder-v3" /> or <AmazonLink product="zowie-ec2-c" />.
            </li>
          </ul>
          <p>
            A 1000 Hz polling rate is enough; 4000 Hz or more helps little and drains the battery. Wireless is no longer a
            problem: good models have no noticeable delay.
          </p>

          <h2>Mousepad: big and control-oriented</h2>
          <p>
            At low sensitivity you move your arm, not just your wrist, so the mousepad needs to be large (at least about 45 cm
            wide). &ldquo;Control&rdquo; cloth surfaces slow the mouse slightly and help you stop your crosshair on target;
            &ldquo;speed&rdquo; surfaces glide more and suit players who flick a lot. If unsure, start with control:{" "}
            <AmazonLink product="zowie-g-sr" /> or <AmazonLink product="steelseries-qck-heavy" />. Replace the mousepad once the
            area where you aim most starts getting smooth.
          </p>

          <h2>Headset: clean stereo and comfort</h2>
          <p>
            To hear footsteps, what matters is clean stereo sound and a headset that doesn&apos;t squeeze after three maps.
            Virtual &ldquo;7.1&rdquo; surround usually hurts more than it helps in CS2, which has its own audio processing. A
            model like the <AmazonLink product="hyperx-cloud-ii" /> does the job; if you already own good music headphones, you
            can use them with a separate microphone.
          </p>

          <h2>Monitor: refresh rate is what counts</h2>
          <p>
            Going from 60 Hz to 144 Hz is the biggest upgrade a monitor can give you. From 144 to 240 Hz the difference still
            shows for players who play a lot, as long as the PC can keep FPS above that. 24-inch monitors are the competitive
            standard because you see the whole screen without moving your head. One example built for this is the{" "}
            <AmazonLink product="zowie-xl2546k" />.
          </p>

          <h2>Keyboard: smaller is better</h2>
          <p>
            A keyboard without the number pad (tenkeyless or smaller) leaves more room for the mouse. Keyboards with adjustable
            actuation, like the <AmazonLink product="steelseries-apex-pro-tkl" />, register keys with less travel, which helps
            with quick direction changes. It&apos;s the last thing to upgrade: any mechanical keyboard works well.
          </p>

          <h2>What doesn&apos;t matter</h2>
          <ul>
            <li>Very high DPI: almost every pro plays between 400 and 1600 DPI.</li>
            <li>RGB lighting, extra buttons and software full of effects.</li>
            <li>Buying the same model as your favorite player: what fits his hand may not fit yours.</li>
          </ul>
        </>
      ),
      es: (
        <>
          <AffiliateDisclosure language="es" />
          <h2>Por dónde empezar</h2>
          <p>
            Si vas a cambiar una sola cosa, cambia el mouse o el mousepad. En CS la puntería depende de movimientos pequeños y
            repetidos, y ahí es donde un mouse malo o una superficie gastada molestan. El monitor rápido viene después, y los
            auriculares caros son lo último de la lista: unos simples ya te dicen de dónde vienen los pasos.
          </p>

          <h2>Mouse: forma antes que ficha técnica</h2>
          <p>
            Cualquier sensor de mouse gamer actual es lo bastante preciso para CS. Lo que cambia de verdad es la forma, que tiene
            que caber en tu mano y en tu agarre (palma, garra o punta de los dedos), y el peso: los mouses livianos, de menos de
            unos 70 gramos, cansan menos con sensibilidad baja, que es lo normal en competitivo.
          </p>
          <ul>
            <li>
              Liviano y simétrico, para casi cualquier agarre: <AmazonLink product="logitech-g-pro-x-superlight-2" />.
            </li>
            <li>
              Ergonómico, para agarre de palma: <AmazonLink product="razer-deathadder-v3" /> o <AmazonLink product="zowie-ec2-c" />.
            </li>
          </ul>
          <p>
            Una tasa de sondeo de 1000 Hz es suficiente; 4000 Hz o más ayuda poco y gasta más batería. Lo inalámbrico ya no es
            un problema: los buenos modelos no tienen retraso perceptible.
          </p>

          <h2>Mousepad: grande y de control</h2>
          <p>
            Con sensibilidad baja mueves el brazo, no solo la muñeca, así que el mousepad tiene que ser grande (al menos unos 45
            cm de ancho). Las superficies de tela &ldquo;de control&rdquo; frenan un poco el mouse y ayudan a detener la mira en
            el lugar; las &ldquo;de velocidad&rdquo; deslizan más y van bien con quien hace muchos flicks. Si dudas, empieza por
            control: <AmazonLink product="zowie-g-sr" /> o <AmazonLink product="steelseries-qck-heavy" />. Cambia el mousepad
            cuando la zona donde más apuntas empiece a quedar lisa.
          </p>

          <h2>Auriculares: estéreo limpio y comodidad</h2>
          <p>
            Para oír pasos, lo que importa es un estéreo limpio y unos auriculares que no aprieten después de tres mapas. El
            sonido &ldquo;7.1&rdquo; virtual suele estorbar más que ayudar en CS2, que ya tiene su propio procesamiento de audio.
            Un modelo como los <AmazonLink product="hyperx-cloud-ii" /> cumple; si ya tienes buenos auriculares de música,
            puedes usarlos con un micrófono aparte.
          </p>

          <h2>Monitor: lo que cuenta es la tasa de refresco</h2>
          <p>
            Pasar de 60 Hz a 144 Hz es la mayor mejora que puede darte un monitor. De 144 a 240 Hz la diferencia todavía se nota
            en quien juega mucho, siempre que el PC mantenga los FPS por encima. Los monitores de 24 pulgadas son el estándar en
            competitivo porque ves toda la pantalla sin mover la cabeza. Un ejemplo hecho para esto es el{" "}
            <AmazonLink product="zowie-xl2546k" />.
          </p>

          <h2>Teclado: cuanto más chico, mejor</h2>
          <p>
            Un teclado sin la parte numérica (formato TKL o menor) deja más espacio para el mouse. Los teclados con activación
            ajustable, como el <AmazonLink product="steelseries-apex-pro-tkl" />, responden con menos recorrido de tecla, lo que
            ayuda en los cambios rápidos de dirección. Es lo último que conviene cambiar: cualquier teclado mecánico funciona
            bien.
          </p>

          <h2>Lo que no hace diferencia</h2>
          <ul>
            <li>DPI altísimo: casi todos los profesionales juegan entre 400 y 1600 DPI.</li>
            <li>Iluminación RGB, botones extra y software lleno de efectos.</li>
            <li>Comprar el mismo modelo que tu jugador favorito: lo que le sirve a su mano puede no servirle a la tuya.</li>
          </ul>
        </>
      ),
    },
  },
];
