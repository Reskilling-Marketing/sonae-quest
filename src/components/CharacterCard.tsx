import type { CharacterDef } from "@/types";
import { EXP_PER_LEVEL } from "@/data/characters";

interface CharacterCardProps {
  character: CharacterDef;
  experience: number;
  level: number;
  compact?: boolean;
}

export function CharacterCard({
  character,
  experience,
  level,
  compact,
}: CharacterCardProps) {
  const expInLevel = experience % EXP_PER_LEVEL;
  const ratio = Math.min(100, Math.round((expInLevel / EXP_PER_LEVEL) * 100));

  if (compact) {
    return (
      <div
        className={`flex items-center gap-3 rounded-card border-2 ${character.color} p-3`}
      >
        <span className="text-3xl" aria-hidden>
          {character.emoji}
        </span>
        <div className="flex-1">
          <div className="flex items-baseline justify-between">
            <p className="text-base-jp font-bold">{character.name}</p>
            <p className="text-xs-jp font-bold text-slate-500">Lv.{level}</p>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-sonae-primary transition-all"
              style={{ width: `${ratio}%` }}
              aria-label={`経験値 ${expInLevel}/${EXP_PER_LEVEL}`}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className={`rounded-card border-2 ${character.color} p-5`}>
      <div className="flex items-start gap-4">
        <span className="text-5xl" aria-hidden>
          {character.emoji}
        </span>
        <div className="flex-1">
          <p className="text-xs-jp font-bold text-slate-500">
            {character.role}
          </p>
          <h3 className="text-xl-jp font-bold">{character.name}</h3>
          <p className="mt-1 text-base-jp font-bold text-sonae-primary">
            Lv.{level}
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">
        {character.description}
      </p>
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs-jp font-bold text-slate-600">
          <span>次のレベルまで</span>
          <span>
            {expInLevel} / {EXP_PER_LEVEL} EXP
          </span>
        </div>
        <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-sonae-primary transition-all"
            style={{ width: `${ratio}%` }}
          />
        </div>
      </div>
    </article>
  );
}
