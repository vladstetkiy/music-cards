"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Music } from "lucide-react";
import { KeyValuePair } from "@/app/page";

interface EditorModeProps {
  pairs: KeyValuePair[];
  setPairs: React.Dispatch<React.SetStateAction<KeyValuePair[]>>;
}

const presets = {
  notes: [
    { id: "preset1", key: "A", value: "Ля" },
    { id: "preset2", key: "B", value: "Си" },
    { id: "preset3", key: "C", value: "До" },
    { id: "preset4", key: "D", value: "Ре" },
    { id: "preset5", key: "E", value: "Ми" },
    { id: "preset6", key: "F", value: "Фа" },
    { id: "preset7", key: "G", value: "Соль" },
  ],
};

export function EditorMode({ pairs, setPairs }: EditorModeProps) {
  const addPair = () => {
    const newId = Date.now().toString();
    setPairs([...pairs, { id: newId, key: "", value: "" }]);
  };

  const updatePair = (id: string, field: "key" | "value", newValue: string) => {
    setPairs(
      pairs.map((pair) =>
        pair.id === id ? { ...pair, [field]: newValue } : pair
      )
    );
  };

  const deletePair = (id: string) => {
    setPairs(pairs.filter((pair) => pair.id !== id));
  };

  const loadPreset = () => {
    setPairs(presets.notes);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Пары ключ-значение</span>
              <Button onClick={addPair} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Добавить пару
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pairs.map((pair) => (
              <div key={pair.id} className="flex gap-2 items-center">
                <Input
                  placeholder="Ключ (например: A)"
                  value={pair.key}
                  onChange={(e) => updatePair(pair.id, "key", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Значение (например: Ля)"
                  value={pair.value}
                  onChange={(e) => updatePair(pair.id, "value", e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deletePair(pair.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {pairs.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                Нет пар. Добавьте первую пару или загрузите пресет
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Пресеты
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={loadPreset} variant="outline" className="w-full">
              Ноты (A-Ля, C-До, etc.)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
