"use client";

import { gameGuides } from "@/data/gameGuides";
import type { GameId } from "@/data/gameGuides";
import { useLanguage } from "@/lib/language";

// "Como jogar" abaixo do jogo: quem joga vê ao rolar, e buscadores e IAs leem no HTML inicial
// (em português, o idioma do build). No navegador o texto acompanha o idioma escolhido.
export function GameGuide({ game }: { game: GameId }) {
  const guide = gameGuides[game][useLanguage()];

  return (
    <section className="mx-auto w-full max-w-3xl px-4 pb-10 pt-6" aria-labelledby={`guide-${game}`}>
      <div className="cs-cut space-y-4 border-t-2 border-cs-orange/60 bg-cs-surface/80 px-5 py-5 text-base font-semibold leading-7 text-cs-text/70 sm:px-7">
        <h2 id={`guide-${game}`} className="text-2xl font-bold uppercase tracking-wide text-cs-text">
          {guide.heading}
        </h2>
        <p>{guide.intro}</p>
        <ol className="list-decimal space-y-1 pl-5 marker:font-bold marker:text-cs-orange">
          {guide.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <h3 className="pt-2 text-lg font-bold uppercase tracking-wider text-cs-text">{guide.faqHeading}</h3>
        <dl className="space-y-3">
          {guide.faq.map((item) => (
            <div key={item.question}>
              <dt className="font-bold text-cs-text">{item.question}</dt>
              <dd>{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
