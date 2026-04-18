"use client";

import { useState, useEffect } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
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
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedPairs = localStorage.getItem("flashcard-pairs");
    if (savedPairs) {
      setPairs(JSON.parse(savedPairs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("flashcard-pairs", JSON.stringify(pairs));
  }, [pairs]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && systemDark);
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col-reverse gap-3 items-center mb-8">
          <div className="w-12"></div>
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
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4" />
            <Switch checked={isDark} onCheckedChange={toggleTheme} />
            <Moon className="w-4 h-4" />
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
