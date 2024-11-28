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
  
  // Utiliza o hook useGameRecord para gerenciar o record
  const { record, createRecord } = useGameRecord(score);

  // Atualiza o record quando o jogo acaba ou o score muda
  useEffect(() => {
    createRecord();
  }, [score, createRecord]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {modal && <AlertModal />}
      {/* Exibe o botão de Start Game se o jogo ainda não foi iniciado */}
      {!start && <Button onClick={handleStartGame} variant={'default'}>Start Game</Button>}

      {/* Exibe as informações do jogo */}
      <Informations score={score} lives={1} record={record} />

      {/* Exibe a pergunta se existir */}
      {question && (
        <div className="flex flex-col items-center">
          <QuestionSection question={question} handleAnswer={handleAnswer} />
        </div>
      )}
    </main>
  );
}
