"use client";
import { DefaultCard } from "@/components/cards/DefaultCard";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="flex flex-row space-x-8">
        <motion.div
          initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: 1, y: "0" }}
          transition={{ duration: 0.5 }}
        >
          <DefaultCard title="Bingo" description="Can you complete the Bingo card? (Coming up...)" linkTo="/bingo"/>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: 1, y: "0" }}
          transition={{ duration: 1 }}
        >
          <DefaultCard title="Guess the skin" description="Can you guess the players real names?" linkTo="/guess-name"/>
        </motion.div>
      </div>
    </main>
  );
}
