import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useApp } from "@/hooks/useApp";

interface MoreItem {
  to: string;
  emoji: string;
  title: string;
  desc: string;
}

const ITEMS: MoreItem[] = [
  {
    to: "/diagnosis",
    emoji: "🛡️",
    title: "防災力診断",
    desc: "12問でわが家の防災レベルを測る",
  },
  {
    to: "/characters",
    emoji: "🐰",
    title: "なかまの成長",
    desc: "5体のキャラクターと一緒に育てる",
  },
  {
    to: "/family",
    emoji: "👨‍👩‍👧",
    title: "家族カード",
    desc: "集合場所・連絡先・避難所メモ（端末内のみ）",
  },
  {
    to: "/handbook",
    emoji: "📖",
    title: "防災手帳",
    desc: "9記事、オフラインで読める",
  },
];

const SHOPS: { name: string; url: string; tag: string }[] = [
  {
    name: "Amazon 防災用品",
    url: "https://www.amazon.co.jp/s?k=防災セット",
    tag: "備蓄",
  },
  {
    name: "楽天 防災グッズ",
    url: "https://search.rakuten.co.jp/search/mall/防災グッズ/",
    tag: "備蓄",
  },
  {
    name: "ホームセンターコーナン",
    url: "https://www.hc-kohnan.com/",
    tag: "店舗",
  },
  {
    name: "東急ハンズ 防災",
    url: "https://hands.net/category/disaster-prevention/",
    tag: "店舗",
  },
];

export function MorePage() {
  const { state, resetAll } = useApp();

  const handleReset = () => {
    if (typeof window === "undefined") return;
    if (
      window.confirm(
        "本当にすべてのデータを削除しますか？診断結果・クエスト進捗・家族カードがリセットされます。",
      )
    ) {
      resetAll();
      window.alert("削除しました");
    }
  };

  return (
    <Layout title="もっと" back="/">
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        防災診断、家族カード、防災手帳など、便利な機能の入り口です。
      </p>

      <section className="mt-4 space-y-2">
        {ITEMS.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            className="card flex items-center gap-3 transition active:scale-[0.99]"
          >
            <span className="text-3xl" aria-hidden>
              {it.emoji}
            </span>
            <div className="flex-1">
              <p className="text-base-jp font-bold leading-tight">{it.title}</p>
              <p className="text-xs-jp text-slate-700">{it.desc}</p>
            </div>
            <span aria-hidden className="text-slate-400">
              →
            </span>
          </Link>
        ))}
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-lg-jp font-bold">🛒 ショップ</h2>
        <p className="mb-2 text-xs-jp text-slate-700">
          防災用品の購入リンク集（外部サイト・公式販路へ移動します）。
        </p>
        <ul className="space-y-2">
          {SHOPS.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card flex items-center gap-3 transition active:scale-[0.99]"
              >
                <span className="text-2xl" aria-hidden>
                  🛍️
                </span>
                <div className="flex-1">
                  <p className="text-base-jp font-bold leading-tight">
                    {s.name}
                  </p>
                  <span className="chip mt-1">{s.tag}</span>
                </div>
                <span aria-hidden className="text-slate-400">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-lg-jp font-bold">⚙️ 設定 / プライバシー</h2>
        <div className="card space-y-3">
          <div>
            <p className="text-base-jp font-bold">データはどこに保存？</p>
            <p className="text-xs-jp text-slate-700">
              すべてのデータは <strong>あなたの端末（ブラウザ）</strong>{" "}
              内のみに保存されます。サーバー送信はありません。
            </p>
            <a
              href="https://github.com/Reskilling-Marketing/sonae-quest/blob/main/PRIVACY.md"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-xs-jp font-bold text-sonae-primary underline"
            >
              プライバシーポリシーを開く →
            </a>
          </div>
          <div>
            <p className="text-base-jp font-bold">初回訪問日</p>
            <p className="text-xs-jp text-slate-700">
              {state.firstVisitAt
                ? new Date(state.firstVisitAt).toLocaleDateString("ja-JP")
                : "—"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-xl border-2 border-rose-300 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700"
          >
            🗑 すべてのデータを削除する
          </button>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-lg-jp font-bold">📜 このアプリについて</h2>
        <div className="card text-sm leading-relaxed text-slate-700">
          <p>
            <strong>そなえクエスト</strong>{" "}
            は、平常時に家族の防災行動を増やすことを目的とした PWA です。
            維持費0円・端末内保存・オフライン対応で、誰でも・どこでも使えます。
          </p>
          <p className="mt-2">
            避難所検索・備蓄管理機能は、<strong>カモガモ防災APP</strong>
            （カルガモマスコットの防災Webアプリ）から着想を得てマージしました。
          </p>
          <p className="mt-2">提供: 株式会社リスキリング・マーケティング</p>
          <a
            href="https://github.com/Reskilling-Marketing/sonae-quest"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs-jp font-bold text-sonae-primary underline"
          >
            GitHub リポジトリ →
          </a>
        </div>
      </section>
    </Layout>
  );
}
