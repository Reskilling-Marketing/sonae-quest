import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { QuestCard } from "@/components/QuestCard";
import { QUESTS, QUEST_CATEGORIES } from "@/data/quests";
import { useApp } from "@/hooks/useApp";
import type { QuestCategory } from "@/types";

const FILTERS: ("すべて" | QuestCategory)[] = ["すべて", ...QUEST_CATEGORIES];

export function QuestsPage() {
  const { state, toggleQuest, isQuestCompleted } = useApp();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("すべて");
  const [showDoneOnly, setShowDoneOnly] = useState(false);
  const location = useLocation();

  const targetId = location.hash ? location.hash.replace("#", "") : null;

  const filtered = useMemo(() => {
    let list = [...QUESTS];
    if (filter !== "すべて") list = list.filter((q) => q.category === filter);
    if (showDoneOnly) list = list.filter((q) => isQuestCompleted(q.id));
    return list;
  }, [filter, showDoneOnly, isQuestCompleted]);

  useEffect(() => {
    if (!targetId) return;
    const el = document.getElementById(`quest-${targetId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [targetId]);

  const doneCount = state.completedQuestIds.length;

  return (
    <Layout title="クエスト一覧" back="/">
      <section className="card mt-2 bg-gradient-to-br from-teal-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs-jp font-bold text-slate-600">
              完了したクエスト
            </p>
            <p className="text-2xl-jp font-bold text-sonae-primary">
              {doneCount}{" "}
              <span className="text-base-jp text-slate-500">
                / {QUESTS.length}
              </span>
            </p>
          </div>
          <span className="text-4xl" aria-hidden>
            🗺️
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-sonae-primary transition-all"
            style={{
              width: `${Math.round((doneCount / QUESTS.length) * 100)}%`,
            }}
          />
        </div>
      </section>

      <div className="mt-4 -mx-4 overflow-x-auto px-4">
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs-jp font-bold transition ${
                filter === f
                  ? "bg-sonae-primary text-white shadow-soft"
                  : "bg-white text-slate-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <label className="mt-3 flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={showDoneOnly}
          onChange={(e) => setShowDoneOnly(e.target.checked)}
          className="h-4 w-4 accent-sonae-primary"
        />
        完了済みだけを表示
      </label>

      <section className="mt-3 space-y-3">
        {filtered.length === 0 ? (
          <p className="card text-center text-sm text-slate-500">
            条件に合うクエストがありません
          </p>
        ) : (
          filtered.map((q) => (
            <div key={q.id} id={`quest-${q.id}`}>
              <QuestCard
                quest={q}
                completed={isQuestCompleted(q.id)}
                onToggle={toggleQuest}
                expandedDefault={targetId === q.id}
              />
            </div>
          ))
        )}
      </section>
    </Layout>
  );
}
