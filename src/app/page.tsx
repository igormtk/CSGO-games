"use client";

import { DefaultCard } from "@/components/cards/DefaultCard";
import { motion } from "framer-motion";

const games = [
  {
    title: "CS Bingo Daily",
    description: "Complete a cartela diária cruzando times, nacionalidades, roles e conquistas de pro players.",
    linkTo: "/bingo",
  },
  {
    title: "Guess the name",
    description: "Can you guess the players real names?",
    linkTo: "/guess-name",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#090b10] px-4 py-12 text-slate-100 sm:px-8">
      <section className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-300">CS:GO Games</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
            Mini games para fãs de Counter-Strike
          </h1>
          <p className="text-lg leading-8 text-slate-300">
            O repositório agora tem um bingo diário inspirado em jogos de futebol, com um banco local de jogadores e times para validar as respostas.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
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
      </section>
    </main>
  );
}
