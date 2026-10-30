"use client";

import { DefaultCard } from "@/components/cards/DefaultCard";
import Link from "@/components/LocalLink";
import { motion } from "framer-motion";
import { ArrowUpDown, Grid3x3, LayoutGrid, Route, ScanFace, Shirt, Timer, UserSearch, Users } from "lucide-react";
import { PartnerSpot } from "@/components/partners/PartnerSpot";
import { getPartnerFor } from "@/data/partners";
import { useDocumentTitle, useLanguage } from "@/lib/language";
import type { Language } from "@/lib/language";

const homeCopy: Record<
  Language,
  {
    pageTitle: string;
    eyebrow: string;
    titleStart: string;
    subtitle: string;
    games: Record<string, { title: string; description: string; tag: string }>;
    play: string;
    partnerLabel: string;
    guides: string;
    archive: string;
    about: string;
    privacy: string;
    terms: string;
    data: string;
    notAffiliated: string;
  }
> = {
  pt: {
    pageTitle: "CS Games · Jogos diários de Counter-Strike",
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
        description: "20 pro players por dia e 10 segundos para cada um: você sabe o nome real deles?",
        tag: "Diário",
      },
      "/career-path": {
        title: "Caminho de carreira",
        description: "Os times de um pro player, em ordem: descubra de quem é a carreira em 6 palpites.",
        tag: "Diário",
      },
      "/lineup": {
        title: "Escalação",
        description: "Um time por dia: cite 5 pro players que já jogaram por ele, com até 3 erros.",
        tag: "Diário",
      },
      "/groups": {
        title: "Agrupe os 16",
        description: "16 pro players, 4 grupos escondidos: time, país, função ou feito em comum.",
        tag: "Diário",
      },
      "/60-seconds": {
        title: "60 segundos",
        description: "Um tema por dia: digite o máximo de pro players que se encaixam nele em um minuto.",
        tag: "Diário",
      },
      "/higher-or-lower": {
        title: "Mais ou menos",
        description: "Quem tem mais Majors, mais anos no Top 20 ou mais times? Acerte o máximo seguido.",
        tag: "Infinito",
      },
      "/bingo/multiplayer": {
        title: "Bingo multiplayer",
        description: "Crie uma sala, mande o código para os amigos e disputem a mesma cartela em tempo real.",
        tag: "Com amigos",
      },
    },
    play: "Jogar",
    partnerLabel: "Publicidade",
    guides: "Guias e estatísticas",
    archive: "Arquivo de desafios",
    about: "Sobre",
    privacy: "Privacidade",
    terms: "Termos",
    data: "Dados",
    notAffiliated: "Não afiliado à Valve.",
  },
  en: {
    pageTitle: "CS Games · Daily Counter-Strike games",
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
        description: "20 pro players a day and 10 seconds for each: do you know their real names?",
        tag: "Daily",
      },
      "/career-path": {
        title: "Career path",
        description: "A pro player's teams, in order: find out whose career it is in 6 guesses.",
        tag: "Daily",
      },
      "/lineup": {
        title: "Lineup",
        description: "One team a day: name 5 pro players who have played for it, with up to 3 misses.",
        tag: "Daily",
      },
      "/groups": {
        title: "Sort the 16",
        description: "16 pro players, 4 hidden groups: a shared team, country, role or achievement.",
        tag: "Daily",
      },
      "/60-seconds": {
        title: "60 seconds",
        description: "One theme a day: type as many matching pro players as you can in one minute.",
        tag: "Daily",
      },
      "/higher-or-lower": {
        title: "Higher or lower",
        description: "Who has more Majors, more Top 20 years or more teams? Get as many in a row as you can.",
        tag: "Endless",
      },
      "/bingo/multiplayer": {
        title: "Bingo multiplayer",
        description: "Create a room, send the code to your friends and race on the same board in real time.",
        tag: "With friends",
      },
    },
    play: "Play",
    partnerLabel: "Advertisement",
    guides: "Guides and stats",
    archive: "Challenge archive",
    about: "About",
    privacy: "Privacy",
    terms: "Terms",
    data: "Data",
    notAffiliated: "Not affiliated with Valve.",
  },
  es: {
    pageTitle: "CS Games · Juegos diarios de Counter-Strike",
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
        description: "20 pro players por día y 10 segundos para cada uno: ¿sabes su nombre real?",
        tag: "Diario",
      },
      "/career-path": {
        title: "Camino de carrera",
        description: "Los equipos de un pro player, en orden: descubre de quién es la carrera en 6 intentos.",
        tag: "Diario",
      },
      "/lineup": {
        title: "Alineación",
        description: "Un equipo por día: nombra 5 pro players que hayan jugado en él, con hasta 3 errores.",
        tag: "Diario",
      },
      "/groups": {
        title: "Agrupa los 16",
        description: "16 pro players, 4 grupos ocultos: equipo, país, rol o logro en común.",
        tag: "Diario",
      },
      "/60-seconds": {
        title: "60 segundos",
        description: "Un tema por día: escribe todos los pro players que encajan en él en un minuto.",
        tag: "Diario",
      },
      "/higher-or-lower": {
        title: "Más o menos",
        description: "¿Quién tiene más Majors, más años en el Top 20 o más equipos? Acierta todas las que puedas seguidas.",
        tag: "Infinito",
      },
      "/bingo/multiplayer": {
        title: "Bingo multijugador",
        description: "Crea una sala, envía el código a tus amigos y compitan en el mismo cartón en tiempo real.",
        tag: "Con amigos",
      },
    },
    play: "Jugar",
    partnerLabel: "Publicidad",
    guides: "Guías y estadísticas",
    archive: "Archivo de desafíos",
    about: "Acerca de",
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
  { linkTo: "/career-path", icon: Route },
  { linkTo: "/lineup", icon: Shirt },
  { linkTo: "/groups", icon: LayoutGrid },
  { linkTo: "/60-seconds", icon: Timer },
  { linkTo: "/higher-or-lower", icon: ArrowUpDown },
  { linkTo: "/bingo/multiplayer", icon: Users },
];

export default function Home() {
  const copy = homeCopy[useLanguage()];
  useDocumentTitle(copy.pageTitle);
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

        <div className="grid gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 short:grid-cols-3 short:gap-3">
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
          <Link href="/guides" className="transition hover:text-cs-orange">{copy.guides}</Link>
          <Link href="/archive" className="transition hover:text-cs-orange">{copy.archive}</Link>
          <Link href="/about" className="transition hover:text-cs-orange">{copy.about}</Link>
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
