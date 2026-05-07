import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useApp } from "@/hooks/useApp";
import { FREE_PROMISE, PRO_KITS, PRO_PRIVACY_PROMISE } from "@/data/pro-kits";

/**
 * Pro 防災キット ショーケース
 *
 * MVP では「興味あり」を LocalStorage に記録するのみ。
 * メールアドレス・決済情報は一切収集しない（個人情報サーバー送信ゼロ）。
 * 実 API / 決済 / 早期登録フォームは CEO 承認後 Phase 2 で実装。
 */
export function ProPage() {
  const { state, toggleProInterest } = useApp();
  const [feedback, setFeedback] = useState<string>("");
  const interestedCount = Object.keys(state.proInterests).length;

  const fmt = (yen: number) => new Intl.NumberFormat("ja-JP").format(yen);

  const onToggle = (kitId: string, kitName: string) => {
    const wasInterested = !!state.proInterests[kitId];
    toggleProInterest(kitId, true);
    setFeedback(
      wasInterested
        ? `「${kitName}」の早期登録希望を取り消しました`
        : `「${kitName}」の早期登録を希望しました（端末内にのみ記録、サーバー送信なし）`,
    );
    window.setTimeout(() => setFeedback(""), 4000);
  };

  return (
    <Layout title="Pro 防災キット" back="/more">
      <section className="card mt-2 border-2 border-amber-300 bg-amber-50">
        <p className="text-sm leading-relaxed text-amber-900">
          🌟 <strong>もう一段、深く備える</strong> ための業種別キット。
          <br />
          AI 防災コーチが、家族構成・住居・地域に合わせて毎日アドバイスします。
        </p>
      </section>

      <section className="card mt-3 border border-emerald-200 bg-emerald-50">
        <p className="text-base-jp font-bold text-emerald-900">
          ✅ 永久無料の保証
        </p>
        <ul className="mt-2 space-y-1 text-sm text-emerald-900">
          {FREE_PROMISE.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>

      <section className="mt-5 space-y-3">
        {PRO_KITS.map((kit) => {
          const interested = !!state.proInterests[kit.id];
          const earlyPrice = kit.earlyBirdDiscount
            ? Math.round(kit.monthlyPrice * (1 - kit.earlyBirdDiscount / 100))
            : kit.monthlyPrice;

          return (
            <article key={kit.id} className={`card border-2 ${kit.tone}`}>
              <header className="flex items-start gap-3">
                <span className="text-4xl" aria-hidden>
                  {kit.emoji}
                </span>
                <div className="flex-1">
                  <p className="text-xs-jp font-bold opacity-70">
                    {kit.audience}
                  </p>
                  <h2 className="text-xl-jp font-bold leading-tight">
                    {kit.name}
                  </h2>
                </div>
              </header>

              <p className="mt-3 text-sm leading-relaxed">{kit.description}</p>

              <div className="mt-3 rounded-xl bg-white/60 p-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-xs-jp opacity-70">早期登録</p>
                    <p className="text-2xl-jp font-black">
                      ¥{fmt(earlyPrice)}
                      <span className="text-base-jp font-bold opacity-70">
                        /月
                      </span>
                    </p>
                  </div>
                  {kit.earlyBirdDiscount && (
                    <div className="text-right">
                      <p className="text-xs-jp opacity-70 line-through">
                        通常 ¥{fmt(kit.monthlyPrice)}/月
                      </p>
                      <span className="chip-warn">
                        {kit.earlyBirdDiscount}% OFF 永久
                      </span>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs-jp opacity-80">
                  AI 月{kit.aiRequestLimit}リクエストまで / 超過分は別途
                </p>
              </div>

              <div className="mt-3">
                <p className="text-xs-jp font-bold opacity-80">主な機能</p>
                <ul className="mt-1 space-y-1 text-sm">
                  {kit.highlights.map((h) => (
                    <li key={h} className="flex gap-1.5">
                      <span aria-hidden>・</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3">
                <p className="text-xs-jp font-bold opacity-80">
                  🤖 AI が出来ること
                </p>
                <ul className="mt-1 space-y-1 text-sm">
                  {kit.aiFeatures.map((f) => (
                    <li key={f} className="flex gap-1.5">
                      <span aria-hidden>🔮</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onToggle(kit.id, kit.name)}
                aria-pressed={interested}
                className={`mt-4 w-full rounded-full px-6 py-3 text-base-jp font-bold transition active:scale-[0.98] ${
                  interested
                    ? "border-2 border-current bg-white"
                    : "bg-sonae-primary text-white shadow-soft"
                }`}
                style={{ minHeight: 48 }}
              >
                {interested
                  ? "✓ 早期登録 希望中（取り消す）"
                  : "🌟 早期登録を希望する"}
              </button>
            </article>
          );
        })}
      </section>

      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className="safe-area-bottom fixed inset-x-0 bottom-20 z-30 mx-auto flex max-w-md justify-center px-4"
        >
          <p className="card border border-sonae-primary bg-white text-center text-sm font-bold text-sonae-primary">
            {feedback}
          </p>
        </div>
      )}

      <section className="card mt-6 border border-slate-200 bg-slate-50">
        <p className="text-base-jp font-bold">🔒 Pro でもプライバシー堅持</p>
        <ul className="mt-2 space-y-1 text-xs-jp text-slate-700">
          {PRO_PRIVACY_PROMISE.map((p) => (
            <li key={p}>・{p}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <p className="text-center text-xs-jp text-slate-700">
          🌟 興味表明: <strong>{interestedCount}</strong> キット
          <br />
          実サービス開始時は、本アプリ内でお知らせします。
          <br />
          メールアドレスは現時点で一切いただきません。
        </p>
      </section>
    </Layout>
  );
}
