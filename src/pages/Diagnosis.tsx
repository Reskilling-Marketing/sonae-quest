import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { LevelBadge } from "@/components/LevelBadge";
import { ShareButton } from "@/components/ShareButton";
import { DIAGNOSIS_QUESTIONS, LEVEL_DESCRIPTIONS } from "@/data/diagnosis";
import { QUESTS } from "@/data/quests";
import { useApp } from "@/hooks/useApp";
import type { DiagnosisAnswer, DiagnosisResult } from "@/types";

const ANSWER_OPTIONS: {
  value: DiagnosisAnswer;
  label: string;
  emoji: string;
}[] = [
  { value: "yes", label: "はい", emoji: "⭕" },
  { value: "unknown", label: "わからない", emoji: "🤔" },
  { value: "no", label: "いいえ", emoji: "❌" },
];

export function DiagnosisPage() {
  const { state, saveDiagnosis, resetDiagnosis } = useApp();
  const [answers, setAnswers] = useState<Record<string, DiagnosisAnswer>>(
    state.diagnosisAnswers,
  );
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<DiagnosisResult | null>(state.diagnosis);

  const current = DIAGNOSIS_QUESTIONS[index];
  const total = DIAGNOSIS_QUESTIONS.length;
  const progress = Math.round(((index + 1) / total) * 100);
  const isLast = index === total - 1;

  const onPick = (value: DiagnosisAnswer) => {
    const next = { ...answers, [current.id]: value };
    setAnswers(next);
    if (isLast) {
      const r = saveDiagnosis(next);
      setResult(r);
    } else {
      setIndex((i) => i + 1);
    }
  };

  const onRetry = () => {
    setAnswers({});
    setIndex(0);
    setResult(null);
    resetDiagnosis();
  };

  if (result) {
    return <DiagnosisResultView result={result} onRetry={onRetry} />;
  }

  return (
    <Layout title="防災力診断" back="/">
      <div className="mt-2">
        <div className="flex items-center justify-between text-xs-jp font-bold text-slate-600">
          <span>
            {index + 1} / {total}問
          </span>
          <span>{progress}%</span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-sonae-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <article className="card mt-5">
        <p className="text-xs-jp font-bold text-sonae-primary">
          {current.category}
        </p>
        <h2 className="mt-1 text-xl-jp font-bold leading-snug">
          {current.question}
        </h2>
        {current.hint && (
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            💡 {current.hint}
          </p>
        )}
      </article>

      <div className="mt-5 grid grid-cols-1 gap-3">
        {ANSWER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onPick(opt.value)}
            className="card flex items-center gap-3 border-2 border-transparent text-left transition active:scale-[0.99] hover:border-sonae-primary"
          >
            <span className="text-3xl" aria-hidden>
              {opt.emoji}
            </span>
            <span className="text-lg-jp font-bold">{opt.label}</span>
          </button>
        ))}
      </div>

      {index > 0 && (
        <button
          type="button"
          onClick={() => setIndex((i) => i - 1)}
          className="mt-4 w-full text-sm font-bold text-slate-700"
        >
          ← 前の質問にもどる
        </button>
      )}
    </Layout>
  );
}

function DiagnosisResultView({
  result,
  onRetry,
}: {
  result: DiagnosisResult;
  onRetry: () => void;
}) {
  const meta = LEVEL_DESCRIPTIONS[result.level];
  const recommended = useMemo(
    () =>
      result.topRecommendations
        .map((id) => QUESTS.find((q) => q.id === id))
        .filter(Boolean) as typeof QUESTS,
    [result.topRecommendations],
  );

  const shareText = useMemo(() => {
    const top = recommended.map((q) => q.title).join("・");
    return `防災力テストやってみたら、家族で話すきっかけになった。今週は ${top || "気になるクエスト"} をやってみる予定。5分だから子どもとできます👇`;
  }, [recommended]);

  return (
    <Layout title="診断結果" back="/">
      <section className="mt-2 text-center">
        <LevelBadge
          level={result.level}
          score={result.score}
          maxScore={result.maxScore}
          size="lg"
        />
        <p className="mt-3 text-base-jp font-bold">{meta.label}</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-700">
          {meta.comment}
        </p>
      </section>

      {recommended.length > 0 && (
        <section className="mt-5">
          <p className="mb-2 text-center text-xs-jp font-bold text-slate-700">
            まずは今すぐ、この1つから
          </p>
          <Link
            to={`/quests#${recommended[0].id}`}
            className="card block border-2 border-sonae-accent bg-amber-50/50 transition active:scale-[0.99]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="chip-warn">
                ⏱ {recommended[0].durationMinutes}分
              </span>
              <span className="chip">{recommended[0].category}</span>
            </div>
            <h3 className="mt-2 text-xl-jp font-bold leading-tight">
              {recommended[0].title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">
              {recommended[0].description}
            </p>
            <p className="btn-accent mt-3 w-full">▶ このクエストを開く</p>
          </Link>
        </section>
      )}

      <section className="mt-5 grid grid-cols-2 gap-3">
        <div className="card">
          <p className="text-xs-jp font-bold text-emerald-700">💪 強み</p>
          {result.strongCategories.length === 0 ? (
            <p className="mt-1 text-sm text-slate-700">
              これから作っていきましょう
            </p>
          ) : (
            <ul className="mt-1 space-y-1 text-sm font-bold text-slate-700">
              {result.strongCategories.map((c) => (
                <li key={c}>・{c}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="card">
          <p className="text-xs-jp font-bold text-rose-700">🎯 のびしろ</p>
          {result.weakCategories.length === 0 ? (
            <p className="mt-1 text-sm text-slate-700">バランス良くカバー！</p>
          ) : (
            <ul className="mt-1 space-y-1 text-sm font-bold text-slate-700">
              {result.weakCategories.map((c) => (
                <li key={c}>・{c}</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="mt-5">
        <h2 className="mb-2 text-lg-jp font-bold">今週の3クエスト</h2>
        {recommended.length === 0 ? (
          <p className="card text-sm text-slate-700">
            完璧なスコアです！クエスト一覧から好きなものに挑戦してみましょう。
          </p>
        ) : (
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
                  <span aria-hidden className="text-slate-300">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="mt-5">
        <ShareButton text={shareText} label="LINEで結果を共有" />
      </section>

      <section className="mt-5 flex flex-col gap-2">
        <Link to="/quests" className="btn-primary">
          クエスト一覧へ
        </Link>
        <button type="button" onClick={onRetry} className="btn-secondary">
          防災レベルを測り直す
        </button>
      </section>
    </Layout>
  );
}
