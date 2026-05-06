import type { ReadinessLevel } from "@/types";
import { LEVEL_DESCRIPTIONS } from "@/data/diagnosis";

interface LevelBadgeProps {
  level: ReadinessLevel;
  score?: number;
  maxScore?: number;
  size?: "sm" | "lg";
}

export function LevelBadge({
  level,
  score,
  maxScore,
  size = "sm",
}: LevelBadgeProps) {
  const meta = LEVEL_DESCRIPTIONS[level];
  const isLg = size === "lg";

  return (
    <div
      className={`inline-flex items-center gap-3 rounded-card px-4 py-3 ${meta.color}`}
    >
      <span
        aria-hidden
        className={`flex items-center justify-center rounded-full bg-white font-black text-sonae-primary ${
          isLg ? "h-16 w-16 text-4xl" : "h-10 w-10 text-xl"
        }`}
      >
        {level}
      </span>
      <div>
        <p className={`font-bold ${isLg ? "text-lg-jp" : "text-sm"}`}>
          防災レベル {level}
        </p>
        <p className={isLg ? "text-base-jp" : "text-xs-jp"}>{meta.label}</p>
        {typeof score === "number" && typeof maxScore === "number" && (
          <p className="text-xs-jp font-bold opacity-80">
            {score} / {maxScore}点
          </p>
        )}
      </div>
    </div>
  );
}
