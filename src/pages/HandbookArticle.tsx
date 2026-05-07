import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ShareButton } from "@/components/ShareButton";
import { HANDBOOK } from "@/data/handbook";
import { isSpeechSupported, speak, stopSpeaking } from "@/lib/preferences";

export function HandbookArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = HANDBOOK.find((a) => a.slug === slug);
  const [reading, setReading] = useState(false);

  if (!article) {
    return (
      <Layout title="記事が見つかりません" back="/handbook">
        <div className="card mt-4 text-center">
          <p className="text-base-jp">記事が見つかりませんでした。</p>
          <Link to="/handbook" className="btn-primary mt-4 inline-flex">
            手帳トップへ
          </Link>
        </div>
      </Layout>
    );
  }

  const shareText = `【そなえクエスト 防災手帳】\n${article.emoji} ${article.title}\n${article.summary}`;

  const handleSpeak = () => {
    if (reading) {
      stopSpeaking();
      setReading(false);
      return;
    }
    const fullText = [
      article.title,
      article.summary,
      ...article.body.flatMap((s) => [s.heading, ...s.lines]),
    ].join("。");
    if (speak(fullText, { lang: "ja-JP" })) setReading(true);
    // 読み上げ終了をポーリングで検知（onend は安定しないブラウザがある）
    const id = window.setInterval(() => {
      if (typeof window !== "undefined" && !window.speechSynthesis.speaking) {
        setReading(false);
        window.clearInterval(id);
      }
    }, 600);
  };

  return (
    <Layout title={article.title} back="/handbook">
      <header className="mt-2">
        <p className="text-5xl" aria-hidden>
          {article.emoji}
        </p>
        <h1 className="mt-2 text-2xl-jp font-bold leading-tight">
          {article.title}
        </h1>
        <p className="mt-2 text-base-jp leading-relaxed text-slate-700">
          {article.summary}
        </p>
      </header>

      {isSpeechSupported() && (
        <button
          type="button"
          onClick={handleSpeak}
          aria-pressed={reading}
          className={`btn-secondary mt-3 w-full ${reading ? "border-rose-400 text-rose-700" : ""}`}
        >
          {reading ? "🔇 読み上げを止める" : "🔊 記事を読み上げる"}
        </button>
      )}

      <article className="mt-5 space-y-5">
        {article.body.map((section, idx) => (
          <section key={idx} className="card">
            <h2 className="text-lg-jp font-bold text-sonae-primary">
              {section.heading}
            </h2>
            <ul className="mt-2 space-y-2">
              {section.lines.map((line, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-base leading-relaxed text-slate-800"
                >
                  <span aria-hidden className="text-sonae-primary">
                    ・
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </article>

      <section className="mt-6">
        <ShareButton text={shareText} label="LINEで家族に教える" />
      </section>

      <section className="mt-4">
        <Link to="/handbook" className="btn-secondary w-full">
          ← 手帳トップへ
        </Link>
      </section>
    </Layout>
  );
}
