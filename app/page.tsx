"use client";

import { useState, useEffect } from "react";
import { Toggle } from "@/components/ui/toggle";
import { BookOpen, Settings } from "lucide-react";
import { EditorMode } from "@/components/EditorMode";
import { QuizMode } from "@/components/QuizMode";

export type KeyValuePair = {
  id: string;
  key: string;
  value: string;
};

export type AnswerMode = "multiple-choice" | "all-values" | "manual";

export default function Home() {
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [pairs, setPairs] = useState<KeyValuePair[]>([
    { id: "1", key: "A", value: "Ля" },
    { id: "2", key: "C", value: "До" },
    { id: "3", key: "D", value: "Ре" },
    { id: "4", key: "E", value: "Ми" },
    { id: "5", key: "F", value: "Фа" },
    { id: "6", key: "G", value: "Соль" },
    { id: "7", key: "H", value: "Си" },
  ]);
  const [answerMode, setAnswerMode] = useState<AnswerMode>("multiple-choice");
  const [inverted, setInverted] = useState(false);

  useEffect(() => {
    const savedPairs = localStorage.getItem("flashcard-pairs");
    if (savedPairs) {
      setPairs(JSON.parse(savedPairs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("flashcard-pairs", JSON.stringify(pairs));
  }, [pairs]);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex justify-center mb-8">
          <div className="bg-card rounded-lg shadow-sm border p-1 flex gap-1">
            <Toggle
              pressed={!isQuizMode}
              onPressedChange={() => setIsQuizMode(false)}
              className="px-6 py-2 rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <Settings className="w-4 h-4 mr-2" />
              Редактор
            </Toggle>
            <Toggle
              pressed={isQuizMode}
              onPressedChange={() => setIsQuizMode(true)}
              className="px-6 py-2 rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Тест
            </Toggle>
          </div>
        </div>

        {!isQuizMode ? (
          <EditorMode pairs={pairs} setPairs={setPairs} />
        ) : (
          <QuizMode 
            pairs={pairs} 
            answerMode={answerMode}
            setAnswerMode={setAnswerMode}
            inverted={inverted}
            setInverted={setInverted}
          />
        )}
      </div>
    </main>
  );
}
