import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { CharacterCard } from "@/components/CharacterCard";
import { ALL_CHARACTERS, useApp } from "@/hooks/useApp";
import { QUESTS } from "@/data/quests";

export function CharactersPage() {
  const { characterStateOf, isQuestCompleted } = useApp();

  return (
    <Layout title="なかまの成長" back="/">
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        クエストを達成すると、対応するなかまが経験値を得てレベルアップします。家族みんなで育てよう。
      </p>

      <section className="mt-4 space-y-3">
        {ALL_CHARACTERS.map((c) => {
          const state = characterStateOf(c.type);
          const relatedQuests = QUESTS.filter(
            (q) => q.characterGrowthType === c.type,
          );
          const doneCount = relatedQuests.filter((q) =>
            isQuestCompleted(q.id),
          ).length;

          return (
            <div key={c.type} className="space-y-2">
              <CharacterCard
                character={c}
                experience={state.experience}
                level={state.level}
              />
              <div className="card">
                <p className="mb-2 text-xs-jp font-bold text-slate-600">
                  {c.name}が育つクエスト ({doneCount} / {relatedQuests.length}{" "}
                  完了)
                </p>
                <ul className="space-y-1.5">
                  {relatedQuests.slice(0, 4).map((q) => {
                    const done = isQuestCompleted(q.id);
                    return (
                      <li key={q.id}>
                        <Link
                          to={`/quests#${q.id}`}
                          className="flex items-center gap-2 text-sm leading-relaxed text-slate-700"
                        >
                          <span aria-hidden>{done ? "✅" : "⬜"}</span>
                          <span
                            className={
                              done ? "line-through text-slate-400" : ""
                            }
                          >
                            {q.title}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                {relatedQuests.length > 4 && (
                  <Link
                    to="/quests"
                    className="mt-2 inline-block text-xs-jp font-bold text-sonae-primary"
                  >
                    すべて見る →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </Layout>
  );
}
