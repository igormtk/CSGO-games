"use client";

import { DefaultCard } from "@/components/cards/DefaultCard";
import { motion } from "framer-motion";
import { Grid3x3, UserSearch } from "lucide-react";
import { PartnerSpot } from "@/components/partners/PartnerSpot";
import { getPartnerFor } from "@/data/partners";

const games = [
  {
    title: "CS Bingo",
    description: "Encaixe os pro players na cartela do dia cruzando times, nacionalidades, funções e conquistas.",
    linkTo: "/bingo",
    icon: Grid3x3,
    tag: "Diário",
  },
  {
    title: "Adivinhe o jogador",
    description: "Você sabe o nome real dos pro players? Acerte o máximo que conseguir.",
    linkTo: "/guess-name",
    icon: UserSearch,
    tag: "Infinito",
  },
];

export default function Home() {
  const dateKey = new Date().toISOString().slice(0, 10);
  const partner = getPartnerFor("home", dateKey, Number(dateKey.replace(/-/g, "")));

  return (
    <main className="h-full">
      <section className="mx-auto flex min-h-full max-w-5xl flex-col justify-center gap-4 px-4 py-4 sm:gap-10 sm:py-6 short:gap-3 short:py-3">
        <div className="max-w-3xl space-y-2 sm:space-y-4 short:space-y-1">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-orange sm:text-sm sm:tracking-[0.35em]">Counter-Strike · Jogos diários</p>
          <h1 className="text-[2rem] font-bold uppercase leading-none tracking-wide sm:text-6xl short:text-4xl">
            Mini games para fãs de <span className="text-cs-orange">CS</span>
          </h1>
          <p className="text-base font-semibold leading-6 text-cs-text/65 sm:text-lg sm:leading-7 short:hidden">
            Teste o quanto você conhece a cena profissional. Um desafio novo todo dia.
          </p>
        </div>

        <div className="grid gap-3 sm:gap-6 md:grid-cols-2 short:grid-cols-2 short:gap-3">
          {games.map((game, index) => (
            <motion.div
              key={game.title}
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
            >
              <DefaultCard {...game} />
            </motion.div>
          ))}
        </div>

        {/* Só aparece em telas altas o bastante para não criar barra de rolagem. */}
        <div className="hidden [@media(min-height:720px)]:block">
          <PartnerSpot partner={partner} label="Publicidade" variant="banner" />
        </div>
      </section>
    </main>
  );
}
