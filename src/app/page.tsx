"use client";

import { DefaultCard } from "@/components/cards/DefaultCard";
import Link from "next/link";
import { motion } from "framer-motion";
import { Grid3x3, ScanFace, UserSearch } from "lucide-react";
import { PartnerSpot } from "@/components/partners/PartnerSpot";
import { getPartnerFor } from "@/data/partners";
import { useLanguage } from "@/lib/language";
import type { Language } from "@/lib/language";

const homeCopy: Record<
  Language,
  {
    eyebrow: string;
    titleStart: string;
    subtitle: string;
    games: Record<string, { title: string; description: string; tag: string }>;
    play: string;
    partnerLabel: string;
    privacy: string;
    terms: string;
    data: string;
    notAffiliated: string;
  }
> = {
  pt: {
    eyebrow: "Counter-Strike · Jogos diários",
    titleStart: "Mini games para fãs de",
    subtitle: "Teste o quanto você conhece a cena profissional. Um desafio novo todo dia.",
    games: {
      "/bingo": {
        title: "CS Bingo",
        description: "Encaixe os pro players na cartela do dia cruzando times, nacionalidades, funções e conquistas.",
        tag: "Diário",
      },
      "/jogador-misterioso": {
        title: "Jogador misterioso",
        description: "Descubra o pro player do dia em 6 palpites, seguindo as pistas de time, país, função e títulos.",
        tag: "Diário",
      },
      "/guess-name": {
        title: "Adivinhe o jogador",
        description: "Você sabe o nome real dos pro players? Acerte o máximo que conseguir.",
        tag: "Infinito",
      },
    },
    play: "Jogar",
    partnerLabel: "Publicidade",
    privacy: "Privacidade",
    terms: "Termos",
    data: "Dados",
    notAffiliated: "Não afiliado à Valve.",
  },
  en: {
    eyebrow: "Counter-Strike · Daily games",
    titleStart: "Mini games for",
    subtitle: "Test how well you know the pro scene. A new challenge every day.",
    games: {
      "/bingo": {
        title: "CS Bingo",
        description: "Fit pro players into today's board by matching teams, nationalities, roles and achievements.",
        tag: "Daily",
      },
      "/jogador-misterioso": {
        title: "Mystery player",
        description: "Find today's pro player in 6 guesses by following the team, country, role and title clues.",
        tag: "Daily",
      },
      "/guess-name": {
        title: "Guess the player",
        description: "Do you know the pro players' real names? Get as many right as you can.",
        tag: "Endless",
      },
    },
    play: "Play",
    partnerLabel: "Advertisement",
    privacy: "Privacy",
    terms: "Terms",
    data: "Data",
    notAffiliated: "Not affiliated with Valve.",
  },
  es: {
    eyebrow: "Counter-Strike · Juegos diarios",
    titleStart: "Mini juegos para fans de",
    subtitle: "Pon a prueba cuánto conoces la escena profesional. Un desafío nuevo cada día.",
    games: {
      "/bingo": {
        title: "CS Bingo",
        description: "Coloca a los pro players en el cartón del día cruzando equipos, nacionalidades, roles y logros.",
        tag: "Diario",
      },
      "/jogador-misterioso": {
        title: "Jugador misterioso",
        description: "Descubre al pro player del día en 6 intentos siguiendo las pistas de equipo, país, rol y títulos.",
        tag: "Diario",
      },
      "/guess-name": {
        title: "Adivina el jugador",
        description: "¿Sabes el nombre real de los pro players? Acierta todos los que puedas.",
        tag: "Infinito",
      },
    },
    play: "Jugar",
    partnerLabel: "Publicidad",
    privacy: "Privacidad",
    terms: "Términos",
    data: "Datos",
    notAffiliated: "Sin afiliación con Valve.",
  },
};

const games = [
  { linkTo: "/bingo", icon: Grid3x3 },
  { linkTo: "/jogador-misterioso", icon: ScanFace },
  { linkTo: "/guess-name", icon: UserSearch },
];

export default function Home() {
  const copy = homeCopy[useLanguage()];
  const dateKey = new Date().toISOString().slice(0, 10);
  const partner = getPartnerFor("home", dateKey, Number(dateKey.replace(/-/g, "")));

  return (
    <main className="h-full">
      <section className="mx-auto flex min-h-full max-w-5xl flex-col justify-center gap-4 px-4 py-4 sm:gap-10 sm:py-6 short:gap-3 short:py-3">
        <div className="max-w-3xl space-y-2 sm:space-y-4 short:space-y-1">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-orange sm:text-sm sm:tracking-[0.35em] short:hidden">{copy.eyebrow}</p>
          <h1 className="text-[2rem] font-bold uppercase leading-none tracking-wide sm:text-6xl short:text-4xl">
            {copy.titleStart} <span className="text-cs-orange">CS</span>
          </h1>
          <p className="text-base font-semibold leading-6 text-cs-text/65 sm:text-lg sm:leading-7 short:hidden [@media(max-height:680px)]:hidden">
            {copy.subtitle}
          </p>
        </div>

        <div className="grid gap-3 sm:gap-6 md:grid-cols-3 short:grid-cols-3 short:gap-3">
          {games.map((game, index) => (
            <motion.div
              key={game.linkTo}
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
            >
              <DefaultCard {...game} {...copy.games[game.linkTo]} cta={copy.play} />
            </motion.div>
          ))}
        </div>

        {/* Só aparece em telas altas o bastante para não criar barra de rolagem. */}
        <div className="hidden [@media(min-height:720px)]:block">
          <PartnerSpot partner={partner} label={copy.partnerLabel} variant="banner" />
        </div>

        <footer className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-cs-text/40">
          <Link href="/privacidade" className="transition hover:text-cs-orange">{copy.privacy}</Link>
          <Link href="/termos" className="transition hover:text-cs-orange">{copy.terms}</Link>
          <span>
            {copy.data}:{" "}
            <a href="https://liquipedia.net/counterstrike/" target="_blank" rel="noopener noreferrer" className="transition hover:text-cs-orange">
              Liquipedia
            </a>{" "}
            (CC BY-SA)
          </span>
          <span>{copy.notAffiliated}</span>
        </footer>
      </section>
    </main>
  );
}
