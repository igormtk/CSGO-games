"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
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
    <main className="flex min-h-screen flex-col items-center p-24">
      {modal && <AlertModal />}
      {!start && <Button onClick={handleStartGame} variant={'default'}>Start Game</Button>}
      <Informations score={score} lives={1} record={record} />
      {question && (
        <div className="flex flex-col items-center">
          <QuestionSection question={question} handleAnswer={handleAnswer} />
        </div>
      )}
    </main>
  );
}
