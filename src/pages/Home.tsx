import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useApp, ALL_CHARACTERS } from "@/hooks/useApp";
import { LevelBadge } from "@/components/LevelBadge";
import { CharacterCard } from "@/components/CharacterCard";
import { ShareButton } from "@/components/ShareButton";
import { QUESTS } from "@/data/quests";

function pickTodayQuest(completedIds: string[]) {
  const remaining = QUESTS.filter(
    (q) => !completedIds.includes(q.id) && q.durationMinutes <= 10,
  );
  if (remaining.length === 0)
    return QUESTS.find((q) => !completedIds.includes(q.id)) ?? QUESTS[0];
  // 日付ベースで決定（同日内は同じクエストを表示）
  const dayKey = new Date().toISOString().slice(0, 10);
  const seed = Array.from(dayKey).reduce((s, c) => s + c.charCodeAt(0), 0);
  return remaining[seed % remaining.length];
}

const DAILY_HEROS = [
  "5分の準備で、今夜の安心がひとつ増える。",
  "備えるって、家族の会話から始まる。",
  "1日1個。気づいた今日が、いちばんの始め時。",
  "小さな一歩が、家族の大きな安心になる。",
  "防災は、暮らしの一部にできる。",
  "怖がらないで、ちゃんと備えよう。",
  "今日の5分は、未来の家族への贈り物。",
];

function pickHero() {
  const day = new Date().getDay();
  return DAILY_HEROS[day % DAILY_HEROS.length];
}

export function HomePage() {
  const { state, computeRecommendedQuests, characterStateOf } = useApp();
  const todayQuest = pickTodayQuest(state.completedQuestIds);
  const recommended = computeRecommendedQuests();
  const totalDone = state.completedQuestIds.length;
  const isFirstTime = !state.diagnosis;

  // 初回ユーザー：診断CTAを最上段の主役に / 既存ユーザー：日常運用UIを優先
  if (isFirstTime) {
    return (
      <Layout>
        <Link
          to="/emergency"
          className="btn-sos mt-2 bg-rose-600"
          aria-label="緊急時はここをタップ"
        >
          <span className="text-2xl" aria-hidden>
            🚨
          </span>
          <span>緊急時はここ</span>
        </Link>
        <section className="card mt-2 bg-gradient-to-br from-sonae-primary to-teal-700 text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-xs-jp font-bold opacity-90">はじめまして</p>
              <h2 className="mt-1 text-2xl-jp font-bold leading-tight">
                5分で、わが家の
                <br />
                防災力がわかります
              </h2>
              <p className="mt-2 text-sm leading-relaxed opacity-95">
                12問の選択式。家族で今週やる3つも見えます。
              </p>
            </div>
            <span className="text-5xl" aria-hidden>
              🛡️
            </span>
          </div>
          <Link to="/diagnosis" className="btn-accent mt-4 w-full">
            ▶ 5分の防災診断を始める
          </Link>
        </section>

        <section className="mt-4">
          <p className="text-center text-sm font-bold text-slate-700">
            または、診断なしでまず触ってみる
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              to="/shelters"
              className="card flex flex-col items-center justify-center py-4 text-center"
            >
              <span className="text-3xl" aria-hidden>
                📍
              </span>
              <p className="mt-1 text-base-jp font-bold">避難所マップ</p>
              <p className="text-xs-jp text-slate-700">8災害種別 / 地図</p>
            </Link>
            <Link
              to="/stock"
              className="card flex flex-col items-center justify-center py-4 text-center"
            >
              <span className="text-3xl" aria-hidden>
                📦
              </span>
              <p className="mt-1 text-base-jp font-bold">備蓄管理</p>
              <p className="text-xs-jp text-slate-700">40品目チェック</p>
            </Link>
            <Link
              to="/quests"
              className="card flex flex-col items-center justify-center py-4 text-center"
            >
              <span className="text-3xl" aria-hidden>
                🗺️
              </span>
              <p className="mt-1 text-base-jp font-bold">クエスト一覧</p>
              <p className="text-xs-jp text-slate-700">30個から選ぶ</p>
            </Link>
            <Link
              to="/handbook"
              className="card flex flex-col items-center justify-center py-4 text-center"
            >
              <span className="text-3xl" aria-hidden>
                📖
              </span>
              <p className="mt-1 text-base-jp font-bold">防災手帳</p>
              <p className="text-xs-jp text-slate-700">9記事 / オフライン</p>
            </Link>
          </div>
        </section>

        <section className="mt-5">
          <h2 className="mb-2 text-lg-jp font-bold">こんなアプリです</h2>
          <ul className="card space-y-2 text-sm leading-relaxed text-slate-800">
            <li>✅ 怖がらせず、家族で行動が増える</li>
            <li>✅ 5分の診断 → 今週の3アクションが見える</li>
            <li>✅ 5体のなかまが、行動するたび育つ</li>
            <li>
              🔒 家族カードは <strong>あなたの端末だけ</strong> に保存
            </li>
          </ul>
        </section>

        <section className="mt-5">
          <ShareButton
            text="5分でわが家の防災レベルがわかるアプリ見つけた。子どもとできるクエストも30個👇"
            url={
              typeof window !== "undefined"
                ? window.location.origin + window.location.pathname
                : undefined
            }
            label="LINEで友達に教える"
          />
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <Link
        to="/emergency"
        className="btn-sos mt-2 bg-rose-600"
        aria-label="緊急時はここをタップ"
      >
        <span className="text-2xl" aria-hidden>
          🚨
        </span>
        <span>緊急時はここ</span>
      </Link>
      <section className="card mt-3 bg-gradient-to-br from-sonae-primary to-teal-700 text-white">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs-jp font-bold opacity-90">今日のひとこと</p>
            <h2 className="mt-1 text-xl-jp font-bold leading-tight">
              {pickHero()}
            </h2>
          </div>
          <span className="text-5xl" aria-hidden>
            🛡️
          </span>
        </div>
      </section>

      <section className="mt-4">
        <LevelBadge
          level={state.diagnosis!.level}
          score={state.diagnosis!.score}
          maxScore={state.diagnosis!.maxScore}
        />
        <Link
          to="/diagnosis"
          className="mt-2 inline-block text-xs-jp font-bold text-sonae-primary underline"
        >
          防災レベルを測り直す →
        </Link>
      </section>

      <section className="mt-5">
        <div className="mb-2 flex items-end justify-between">
          <h2 className="text-lg-jp font-bold">今日の防災クエスト</h2>
          <Link
            to="/quests"
            className="text-xs-jp font-bold text-sonae-primary"
          >
            一覧 →
          </Link>
        </div>
        <Link
          to={`/quests#${todayQuest.id}`}
          className="card block transition active:scale-[0.99]"
        >
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="chip">{todayQuest.category}</span>
            <span className="chip-warn">⏱ {todayQuest.durationMinutes}分</span>
          </div>
          <h3 className="mt-2 text-xl-jp font-bold leading-tight">
            {todayQuest.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">
            {todayQuest.description}
          </p>
          <p className="mt-3 text-right text-sm font-bold text-sonae-primary">
            クエストを開く →
          </p>
        </Link>
      </section>

      {recommended.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-2 text-lg-jp font-bold">次の3つから始めよう</h2>
          <ol className="space-y-2">
            {recommended.map((q, i) => (
              <li key={q.id}>
                <Link
                  to={`/quests#${q.id}`}
                  className="card flex items-center gap-3 transition active:scale-[0.99]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sonae-primary text-base font-bold text-white">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-base-jp font-bold leading-tight">
                      {q.title}
                    </p>
                    <p className="text-xs-jp text-slate-700">
                      ⏱ {q.durationMinutes}分 / {q.category}
                    </p>
                  </div>
                  <span aria-hidden className="text-slate-400">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="mt-5">
        <h2 className="mb-2 text-lg-jp font-bold">なかまの成長</h2>
        <div className="grid grid-cols-1 gap-2">
          {ALL_CHARACTERS.map((c) => {
            const s = characterStateOf(c.type);
            return (
              <CharacterCard
                key={c.type}
                character={c}
                experience={s.experience}
                level={s.level}
                compact
              />
            );
          })}
        </div>
        <Link
          to="/characters"
          className="mt-2 inline-block text-xs-jp font-bold text-sonae-primary"
        >
          詳しく見る →
        </Link>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-2">
        <Link
          to="/shelters"
          className="card flex flex-col items-center justify-center py-4 text-center"
        >
          <span className="text-3xl" aria-hidden>
            📍
          </span>
          <p className="mt-1 text-base-jp font-bold">避難所マップ</p>
          <p className="text-xs-jp text-slate-700">8災害種別 / 現在地から</p>
        </Link>
        <Link
          to="/stock"
          className="card flex flex-col items-center justify-center py-4 text-center"
        >
          <span className="text-3xl" aria-hidden>
            📦
          </span>
          <p className="mt-1 text-base-jp font-bold">備蓄管理</p>
          <p className="text-xs-jp text-slate-700">40品目 / 賞味期限</p>
        </Link>
        <Link
          to="/family"
          className="card flex flex-col items-center justify-center py-4 text-center"
        >
          <span className="text-3xl" aria-hidden>
            👨‍👩‍👧
          </span>
          <p className="mt-1 text-base-jp font-bold">家族カード</p>
        </Link>
        <Link
          to="/handbook"
          className="card flex flex-col items-center justify-center py-4 text-center"
        >
          <span className="text-3xl" aria-hidden>
            📖
          </span>
          <p className="mt-1 text-base-jp font-bold">防災手帳</p>
        </Link>
      </section>

      <section className="mt-5">
        <ShareButton
          text={`5分でわが家の防災レベルがわかるアプリ、家族で話すきっかけになりました。子どもとできるクエストも30個👇`}
          url={
            typeof window !== "undefined"
              ? window.location.origin + window.location.pathname
              : undefined
          }
          label="LINEで友達に教える"
        />
        <p className="mt-3 text-center text-xs-jp text-slate-700">
          完了したクエスト:{" "}
          <span className="font-bold text-sonae-primary">{totalDone}</span> /{" "}
          {QUESTS.length}
        </p>
      </section>
    </Layout>
  );
}
