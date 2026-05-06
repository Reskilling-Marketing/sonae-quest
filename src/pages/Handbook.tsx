import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { HANDBOOK } from "@/data/handbook";

export function HandbookPage() {
  return (
    <Layout title="防災手帳" back="/">
      <section className="card mt-2 border border-teal-200 bg-teal-50">
        <p className="text-sm leading-relaxed text-teal-900">
          📡 オフラインでも読めます。電車・避難中・通信が不安定な時の頼りに。
        </p>
      </section>

      <ul className="mt-4 space-y-2">
        {HANDBOOK.map((article) => (
          <li key={article.slug}>
            <Link
              to={`/handbook/${article.slug}`}
              className="card flex items-center gap-3 transition active:scale-[0.99]"
            >
              <span className="text-3xl" aria-hidden>
                {article.emoji}
              </span>
              <div className="flex-1">
                <p className="text-base-jp font-bold leading-tight">
                  {article.title}
                </p>
                <p className="mt-0.5 text-xs-jp leading-relaxed text-slate-500">
                  {article.summary}
                </p>
              </div>
              <span aria-hidden className="text-slate-300">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-center text-xs-jp text-slate-500">
        記事はアプリと一緒に保存されます。
        <br />
        災害時に読みたい記事は事前に1回開いておくと安心です。
      </p>
    </Layout>
  );
}
