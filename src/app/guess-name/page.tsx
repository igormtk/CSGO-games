"use client";
import { useEffect } from "react";
import { Play } from "lucide-react";
import { useGame } from "./hooks/useGame";
import Informations from "./components/Informations";
import QuestionSection from "./components/QuestionSection";
import { useGameRecord } from "./hooks/useGameRecord";
import AlertModal from "./components/AlertModal";

export default function Home() {
  const { start, score,  question, modal, handleStartGame, handleAnswer } = useGame();
  
  // Hook to manage game record
  const { record, createRecord } = useGameRecord(score);

  // Update the record when the record changes
  useEffect(() => {
    createRecord();
  }, [score, createRecord]);

  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col items-center justify-center gap-6 px-4 py-6">
      {modal && <AlertModal />}
      <Informations score={score} lives={1} record={record} />
      {!start && (
        <button
          type="button"
          onClick={handleStartGame}
          className="cs-cut-sm inline-flex items-center gap-2 bg-cs-orange px-6 py-2.5 text-xl font-bold uppercase tracking-wider text-cs-bg transition hover:bg-[#ffb85a]"
        >
          <Play className="h-5 w-5 fill-current" /> Começar
        </button>
      )}
      {question && <QuestionSection question={question} handleAnswer={handleAnswer} />}
    </main>
  );
}
