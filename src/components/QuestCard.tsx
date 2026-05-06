import { useState } from "react";
import type { Quest } from "@/types";
import { CHARACTERS } from "@/data/characters";

interface QuestCardProps {
  quest: Quest;
  completed: boolean;
  onToggle: (id: string) => void;
  expandedDefault?: boolean;
}

const DIFFICULTY_LABEL: Record<1 | 2 | 3, string> = {
  1: "やさしい",
  2: "ふつう",
  3: "しっかり",
};

export function QuestCard({
  quest,
  completed,
  onToggle,
  expandedDefault = false,
}: QuestCardProps) {
  const character = CHARACTERS.find(
    (c) => c.type === quest.characterGrowthType,
  );
  const [showCelebration, setShowCelebration] = useState(false);

  const handleToggle = () => {
    const wasCompleted = completed;
    onToggle(quest.id);
    if (!wasCompleted) {
      setShowCelebration(true);
      window.setTimeout(() => setShowCelebration(false), 2200);
      // 即時報酬の体感強化（Android Chrome 等のみ動作、iOS は無視・エラーなし）
      try {
        navigator.vibrate?.([12, 28, 18]);
      } catch {
        /* not supported */
      }
    }
  };

  return (
    <details
      open={expandedDefault || completed}
      className={`group card relative transition ${
        completed
          ? "border-2 border-sonae-primary bg-teal-50/40"
          : "border border-transparent"
      }`}
    >
      <summary className="flex cursor-pointer list-none items-start gap-3">
        <div
          className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base font-bold ${
            completed
              ? "bg-sonae-primary text-white"
              : "border-2 border-slate-300 bg-white text-slate-400"
          }`}
          aria-hidden
        >
          {completed ? "✓" : ""}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="chip">{quest.category}</span>
            <span className="chip-warn">⏱ {quest.durationMinutes}分</span>
            <span className="chip">{DIFFICULTY_LABEL[quest.difficulty]}</span>
          </div>
          <h3 className="mt-1.5 text-lg-jp font-bold leading-tight">
            {quest.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">
            {quest.description}
          </p>
        </div>
        <span
          aria-hidden
          className="ml-1 mt-1 text-xl text-slate-400 transition group-open:rotate-180"
        >
          ▾
        </span>
      </summary>

      <div className="mt-4 border-t border-teal-100 pt-3">
        <p className="mb-2 text-xs-jp font-bold text-slate-700">手順</p>
        <ol className="space-y-1.5">
          {quest.steps.map((step, i) => (
            <li
              key={i}
              className="flex gap-2 text-sm leading-relaxed text-slate-800"
            >
              <span className="font-bold text-sonae-primary">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-4 flex items-center justify-between gap-3">
          {character && (
            <div className="flex items-center gap-1 text-xs-jp text-slate-700">
              <span aria-hidden>{character.emoji}</span>
              <span>
                {character.name}が +{quest.experience} EXP
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={handleToggle}
            className={completed ? "btn-secondary" : "btn-primary"}
            aria-pressed={completed}
          >
            {completed ? "取り消す" : "完了する"}
          </button>
        </div>
      </div>

      {showCelebration && character && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute inset-x-0 -top-2 z-10 flex justify-center"
        >
          <div className="animate-[fadeup_2s_ease-out_forwards] rounded-full bg-sonae-primary px-4 py-2 text-sm-jp font-bold text-white shadow-soft">
            {character.emoji} {character.name} +{quest.experience}{" "}
            EXP！おつかれさま
          </div>
        </div>
      )}
    </details>
  );
}
