"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyValuePair, AnswerMode } from "@/app/page";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Check, X, RefreshCw } from "lucide-react";

interface QuizModeProps {
  pairs: KeyValuePair[];
  answerMode: AnswerMode;
  setAnswerMode: React.Dispatch<React.SetStateAction<AnswerMode>>;
  inverted: boolean;
  setInverted: React.Dispatch<React.SetStateAction<boolean>>;
}

export function QuizMode({ pairs, answerMode, setAnswerMode, inverted, setInverted }: QuizModeProps) {
  const [currentPair, setCurrentPair] = useState<KeyValuePair | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<{ question: string; answer: string }>({ question: "", answer: "" });
  const [winStreak, setWinStreak] = useState(0);
  const [feedback, setFeedback] = useState<"success" | "error" | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const isInitialMount = useRef(true);

  const validPairs = pairs.filter((p) => p.key.trim() && p.value.trim());

  const manualInputRef = useRef<HTMLInputElement>(null);

  const generateQuestion = useCallback((pair: KeyValuePair, isInverted: boolean) => {
    if (isInverted) {
      return { question: pair.value, answer: pair.key };
    } else {
      return { question: pair.key, answer: pair.value };
    }
  }, []);

  const getRandomPair = useCallback(() => {
    if (validPairs.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * validPairs.length);
    return validPairs[randomIndex];
  }, [validPairs]);

  const generateOptions = useCallback(
    (correctAnswer: string) => {
      if (answerMode === "all-values") {
        if (inverted) {
          const allKeys = validPairs.map((p) => p.key);
          return [...new Set(allKeys)];
        } else {
          const allValues = validPairs.map((p) => p.value);
          return [...new Set(allValues)];
        }
      } else {
        let otherAnswers: string[];
        if (inverted) {
          otherAnswers = validPairs
            .filter((p) => p.key !== correctAnswer)
            .map((p) => p.key);
        } else {
          otherAnswers = validPairs
            .filter((p) => p.value !== correctAnswer)
            .map((p) => p.value);
        }
        const uniqueOthers = [...new Set(otherAnswers)];
        const shuffledOthers = uniqueOthers.sort(() => Math.random() - 0.5);
        const wrongOptions = shuffledOthers.slice(0, 2);
        const allOptions = [correctAnswer, ...wrongOptions];
        return allOptions.sort(() => Math.random() - 0.5);
      }
    },
    [validPairs, answerMode, inverted]
  );

  const nextQuestion = useCallback(() => {
    const newPair = getRandomPair();
    if (newPair) {
      setCurrentPair(newPair);
      const question = generateQuestion(newPair, inverted);
      setCurrentQuestion(question);
      if (answerMode !== "manual") {
        setOptions(generateOptions(question.answer));
      }
      setSelectedAnswer("");
      setManualInput("");
      setFeedback(null);
    }
  }, [getRandomPair, generateQuestion, inverted, answerMode, generateOptions]);

  const handleModeChange = useCallback((newMode: AnswerMode) => {
    setAnswerMode(newMode);
  }, [setAnswerMode, getRandomPair, generateQuestion, inverted, generateOptions]);

  const handleAnswer = (answer: string) => {
    if (!currentQuestion || feedback) return;

    const isCorrect = answer.toLowerCase() === currentQuestion.answer.toLowerCase();

    if (isCorrect) {
      setFeedback("success");
      setWinStreak((prev) => prev + 1);
      setTimeout(() => {
        nextQuestion();
      }, 800);
    } else {
      setFeedback("error");
      setWinStreak(0);
      setTimeout(() => {
        nextQuestion();
      }, 1500);
    }
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      handleAnswer(manualInput.trim());
    }
  };

  const handleInvertChange = useCallback((newInverted: boolean) => {
    setInverted(newInverted);
    const newPair = getRandomPair();
    if (newPair) {
      setCurrentPair(newPair);
      const question = generateQuestion(newPair, newInverted);
      setCurrentQuestion(question);
      if (answerMode !== "manual") {
        setOptions(generateOptions(question.answer));
      }
      setSelectedAnswer("");
      setManualInput("");
      setFeedback(null);
    }
  }, [setInverted, getRandomPair, generateQuestion, answerMode, generateOptions]);

  useEffect(() => {
    if (validPairs.length > 0 && !currentPair && isInitialMount.current) {
      isInitialMount.current = false;
      nextQuestion();
    }
  }, [validPairs, currentPair, nextQuestion]);

  useEffect(() => {
    nextQuestion();
  }, [answerMode, inverted]);

  useEffect(() => {
    if (answerMode === "manual" && !feedback) {
      manualInputRef.current?.focus();
    }
  }, [currentQuestion]);

  if (validPairs.length === 0) {
    return (
      <Card>
        <CardContent className="py-20 text-center">
          <p className="text-muted-foreground">
            Нет валидных пар. Добавьте пары в режиме редактора
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion.question) return null;

  return (
    <div className="flex flex-col items-center justify-start min-h-[70vh]">
      <Card className="mb-8 w-full md:w-fit">
        <CardContent className="pt-2 space-y-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label>Режим ответа</Label>
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-2">
              <Button
                variant={answerMode === "multiple-choice" ? "default" : "outline"}
                onClick={() => handleModeChange("multiple-choice")}
                size="lg"
              >
                3 варианта
              </Button>
              <Button
                variant={answerMode === "all-values" ? "default" : "outline"}
                onClick={() => handleModeChange("all-values")}
                size="lg"
              >
                Все значения
              </Button>
              <Button
                variant={answerMode === "manual" ? "default" : "outline"}
                onClick={() => handleModeChange("manual")}
                size="lg"
              >
                Ручной ввод
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <Label htmlFor="invert-mode" className="flex items-center gap-2 cursor-pointer">
              <RefreshCw className="w-4 h-4" />
              Инвертировать
            </Label>
            <Switch
              id="invert-mode"
              checked={inverted}
              onCheckedChange={handleInvertChange}
              className="scale-150"
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {inverted ? "Показывается значение, нужно ввести ключ" : "Показывается ключ, нужно ввести значение"}
          </p>
        </CardContent>
      </Card>

      <Card className="p-4 border-b-2 rounded-b-[20px] relative z-10">
        <CardContent className="flex justify-center text-xl">
          <span className="text-2xl font-bold text-green-600">{winStreak}</span>
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl rounded-t-[20px] -mt-2.5 relative z-0">
        <CardContent className="p-8">
          <div className="text-center">
            <h2 className="text-6xl md:text-8xl font-bold mb-8">
              {currentQuestion.question}
            </h2>

            {answerMode === "manual" ? (
              <div className="flex gap-2">
                <Input
                  ref={manualInputRef}
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleManualSubmit()}
                  placeholder="Введите ответ..."
                  className="text-lg"
                  disabled={!!feedback}
                />
                <Button onClick={handleManualSubmit} disabled={!!feedback}>
                  Ответить
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {options.map((option, idx) => (
                  <Button
                    key={idx}
                    onClick={() => {
                      setSelectedAnswer(option);
                      handleAnswer(option);
                    }}
                    disabled={!!feedback}
                    variant={
                      feedback === "success" && option === currentQuestion.answer
                        ? "default"
                        : feedback === "error" && option === currentQuestion.answer
                        ? "default"
                        : feedback === "error" && option === selectedAnswer
                        ? "destructive"
                        : "outline"
                    }
                    className="h-auto py-4 text-lg"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {feedback === "success" && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
          <Check className="w-32 h-32 text-green-500 animate-ping opacity-50" />
        </div>
      )}
      {feedback === "error" && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
          <X className="w-32 h-32 text-red-500 animate-pulse opacity-50" />
        </div>
      )}
    </div>
  );
}
