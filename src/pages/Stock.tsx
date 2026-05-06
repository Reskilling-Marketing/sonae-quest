import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { ShareButton } from "@/components/ShareButton";
import {
  STOCK_CATEGORIES,
  STOCK_CATEGORY_META,
  STOCK_ITEMS,
} from "@/data/stock";
import { useApp } from "@/hooks/useApp";
import type { StockCategory, StockState } from "@/types";

const STATE_META: Record<
  StockState,
  { label: string; emoji: string; tone: string }
> = {
  have: {
    label: "ある",
    emoji: "✅",
    tone: "border-emerald-400 bg-emerald-50 text-emerald-900",
  },
  partial: {
    label: "少しある",
    emoji: "🟡",
    tone: "border-amber-400 bg-amber-50 text-amber-900",
  },
  none: {
    label: "ない",
    emoji: "⬜",
    tone: "border-slate-300 bg-white text-slate-700",
  },
};

export function StockPage() {
  const { state, updateStockCheck } = useApp();
  const [activeCategory, setActiveCategory] = useState<
    StockCategory | "すべて"
  >("すべて");
  const [familySize, setFamilySize] = useState<number>(() => {
    const saved =
      typeof window !== "undefined"
        ? window.localStorage.getItem("sq-family-size")
        : null;
    return saved ? Number(saved) : 4;
  });

  const filteredItems = useMemo(() => {
    if (activeCategory === "すべて") return STOCK_ITEMS;
    return STOCK_ITEMS.filter((it) => it.category === activeCategory);
  }, [activeCategory]);

  const stats = useMemo(() => {
    const total = STOCK_ITEMS.length;
    let have = 0;
    let partial = 0;
    STOCK_ITEMS.forEach((it) => {
      const s = state.stockChecks[it.id]?.state ?? "none";
      if (s === "have") have += 1;
      else if (s === "partial") partial += 1;
    });
    const score = Math.round(((have + partial * 0.5) / total) * 100);
    return { total, have, partial, none: total - have - partial, score };
  }, [state.stockChecks]);

  // 賞味期限切迫アラート（30日以内）
  const expiringAlerts = useMemo(() => {
    const today = new Date();
    const threshold = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    return STOCK_ITEMS.flatMap((it) => {
      const check = state.stockChecks[it.id];
      if (!check?.expiryDate) return [];
      const exp = new Date(check.expiryDate);
      if (Number.isNaN(exp.getTime())) return [];
      if (exp <= threshold) {
        const days = Math.ceil(
          (exp.getTime() - today.getTime()) / (24 * 60 * 60 * 1000),
        );
        return [{ item: it, days, expiryDate: check.expiryDate }];
      }
      return [];
    }).sort((a, b) => a.days - b.days);
  }, [state.stockChecks]);

  const handleStateChange = (itemId: string, s: StockState) => {
    updateStockCheck(itemId, { state: s });
  };

  const handleExpiryChange = (itemId: string, date: string) => {
    updateStockCheck(itemId, { expiryDate: date || undefined });
  };

  const handleFamilySizeChange = (n: number) => {
    setFamilySize(n);
    if (typeof window !== "undefined")
      window.localStorage.setItem("sq-family-size", String(n));
  };

  return (
    <Layout title="備蓄管理" back="/">
      <section className="card mt-2 bg-gradient-to-br from-sonae-primary to-teal-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs-jp font-bold opacity-90">備蓄カバー率</p>
            <p className="text-3xl-jp font-black">
              {stats.score}
              <span className="text-base-jp font-bold opacity-90">%</span>
            </p>
            <p className="text-xs-jp opacity-90">
              ✅ {stats.have} / 🟡 {stats.partial} / ⬜ {stats.none}{" "}
              <span className="opacity-75">(全{stats.total}品目)</span>
            </p>
          </div>
          <span className="text-5xl" aria-hidden>
            📦
          </span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all"
            style={{ width: `${stats.score}%` }}
          />
        </div>
      </section>

      <section className="card mt-3">
        <label
          htmlFor="family-size"
          className="text-xs-jp font-bold text-slate-700"
        >
          家族の人数
        </label>
        <div className="mt-1 flex items-center gap-3">
          <input
            id="family-size"
            type="number"
            min={1}
            max={10}
            value={familySize}
            onChange={(e) =>
              handleFamilySizeChange(
                Math.max(1, Math.min(10, Number(e.target.value) || 1)),
              )
            }
            className="w-20 rounded-xl border border-slate-300 px-3 py-2 text-base focus:border-sonae-primary focus:outline-none"
          />
          <span className="text-sm text-slate-700">
            人 → 必要数を「家族数 × 推奨日数」で表示
          </span>
        </div>
      </section>

      {expiringAlerts.length > 0 && (
        <section className="card mt-3 border-2 border-amber-300 bg-amber-50">
          <p className="text-base-jp font-bold text-amber-900">
            ⏰ 賞味期限が近い ({expiringAlerts.length}件)
          </p>
          <ul className="mt-2 space-y-1 text-sm text-amber-900">
            {expiringAlerts.slice(0, 5).map((a) => (
              <li key={a.item.id}>
                ・{a.item.name}: <strong>{a.expiryDate}</strong>
                {a.days >= 0 ? `（あと${a.days}日）` : "（期限切れ）"}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-3 -mx-4 overflow-x-auto px-4">
        <div className="flex gap-2">
          {(["すべて", ...STOCK_CATEGORIES] as const).map((c) => {
            const active = c === activeCategory;
            const meta = c === "すべて" ? null : STOCK_CATEGORY_META[c];
            return (
              <button
                key={c}
                type="button"
                onClick={() => setActiveCategory(c)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs-jp font-bold transition ${
                  active
                    ? "bg-sonae-primary text-white shadow-soft"
                    : "bg-white text-slate-700"
                }`}
              >
                {meta ? `${meta.emoji} ${meta.label}` : c}
              </button>
            );
          })}
        </div>
      </div>

      <section className="mt-3 space-y-2">
        {filteredItems.map((item) => {
          const check = state.stockChecks[item.id];
          const currentState: StockState = check?.state ?? "none";
          const meta = STOCK_CATEGORY_META[item.category];
          const needTotal =
            item.perPersonPerDay != null
              ? item.perPersonPerDay * familySize * item.recommendedDays
              : null;

          return (
            <div key={item.id} className="card">
              <div className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden>
                  {meta.emoji}
                </span>
                <div className="flex-1">
                  <p className="text-base-jp font-bold leading-tight">
                    {item.name}
                  </p>
                  <p className="text-xs-jp text-slate-700">
                    {meta.label}
                    {needTotal != null && (
                      <>
                        {" "}
                        / 推奨 <strong>{needTotal}個</strong>（{familySize}人 ×{" "}
                        {item.recommendedDays}日）
                      </>
                    )}
                  </p>
                  {item.hint && (
                    <p className="mt-1 text-xs-jp text-slate-600">
                      💡 {item.hint}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {(Object.keys(STATE_META) as StockState[]).map((s) => {
                  const sm = STATE_META[s];
                  const active = currentState === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleStateChange(item.id, s)}
                      aria-pressed={active}
                      className={`rounded-xl border-2 px-2 py-2 text-xs-jp font-bold transition ${
                        active
                          ? sm.tone
                          : "border-slate-200 bg-slate-50 text-slate-500"
                      }`}
                    >
                      <span className="block text-lg leading-none">
                        {sm.emoji}
                      </span>
                      <span className="mt-1 block">{sm.label}</span>
                    </button>
                  );
                })}
              </div>

              {currentState !== "none" && (
                <div className="mt-3 flex items-center gap-2">
                  <label
                    htmlFor={`exp-${item.id}`}
                    className="text-xs-jp font-bold text-slate-700"
                  >
                    賞味期限
                  </label>
                  <input
                    id={`exp-${item.id}`}
                    type="date"
                    value={check?.expiryDate ?? ""}
                    onChange={(e) =>
                      handleExpiryChange(item.id, e.target.value)
                    }
                    className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-sm focus:border-sonae-primary focus:outline-none"
                  />
                </div>
              )}
            </div>
          );
        })}
      </section>

      <section className="mt-5">
        <ShareButton
          text={`そなえクエストで備蓄チェックしたら、わが家のカバー率は${stats.score}%でした。あなたの家もどう？👇`}
          url={
            typeof window !== "undefined"
              ? window.location.origin + window.location.pathname
              : undefined
          }
          label="LINEで結果を共有"
        />
      </section>

      <p className="mt-3 text-center text-xs-jp text-slate-600">
        🔒 入力した内容はあなたの端末だけに保存されます。
      </p>
    </Layout>
  );
}
