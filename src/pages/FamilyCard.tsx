import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { ShareButton } from "@/components/ShareButton";
import { useApp } from "@/hooks/useApp";
import type { FamilyCard } from "@/types";

interface FieldDef {
  key: keyof FamilyCard;
  label: string;
  placeholder: string;
  hint?: string;
  multiline?: boolean;
}

const FIELDS: FieldDef[] = [
  {
    key: "meetingPlace",
    label: "家族の集合場所",
    placeholder: "例：自宅 → 〇〇公園 → △△小学校",
    hint: "近所と広域の2か所決めると安心",
  },
  {
    key: "emergencyContacts",
    label: "緊急連絡先",
    placeholder: "例：父 090-…\n母 080-…\n祖母 045-…",
    hint: "家族・親戚・かかりつけ医など",
    multiline: true,
  },
  {
    key: "shelter",
    label: "避難所",
    placeholder: "例：徒歩10分 △△小学校（広域避難場所：〇〇公園）",
  },
  {
    key: "goBagLocation",
    label: "持ち出し袋の場所",
    placeholder: "例：玄関のシューズボックス上",
  },
  {
    key: "medicalNotes",
    label: "薬・持病・アレルギー",
    placeholder: "例：父：高血圧の薬（朝1錠）\n娘：卵アレルギー",
    multiline: true,
  },
  {
    key: "petInfo",
    label: "ペット情報",
    placeholder: "例：柴犬（チョコ・5歳）/ ワクチン証明書はクラウド保存",
    multiline: true,
  },
  {
    key: "messageToChild",
    label: "子どもへの伝言",
    placeholder: "例：揺れたら机の下に隠れて、終わったら〇〇先生のところへ。",
    multiline: true,
  },
  {
    key: "contactRule",
    label: "災害時の連絡ルール",
    placeholder:
      "例：1) LINE家族グループ 2) 171（伝言ダイヤル） 3) 祖母宅へ電話",
    multiline: true,
  },
];

export function FamilyCardPage() {
  const { state, updateFamilyCard } = useApp();
  const [draft, setDraft] = useState<FamilyCard>(state.familyCard);
  const [autoSaved, setAutoSaved] = useState(false);

  const handleChange = (key: keyof FamilyCard, v: string) => {
    setDraft((prev) => ({ ...prev, [key]: v }));
  };

  // 入力中も 600ms デバウンスで自動保存（明示的な「保存」操作も併存）
  useEffect(() => {
    if (draft === state.familyCard) return;
    const id = window.setTimeout(() => {
      updateFamilyCard(draft);
      setAutoSaved(true);
      window.setTimeout(() => setAutoSaved(false), 1500);
    }, 600);
    return () => window.clearTimeout(id);
  }, [draft, state.familyCard, updateFamilyCard]);

  const handleSave = () => {
    updateFamilyCard(draft);
    setAutoSaved(true);
    window.setTimeout(() => setAutoSaved(false), 1500);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const shareText = [
    "【わが家の防災カード】",
    draft.meetingPlace && `集合場所: ${draft.meetingPlace}`,
    draft.shelter && `避難所: ${draft.shelter}`,
    draft.contactRule && `連絡ルール: ${draft.contactRule}`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <Layout title="家族カード" back="/">
      <section className="card mt-2 border-2 border-amber-300/60 bg-amber-50">
        <p className="text-sm leading-relaxed text-amber-900">
          🔒 ここに入力した内容は <strong>あなたの端末の中だけ</strong>{" "}
          に保存されます。サーバーには送信しません。
          <br />
          入力は任意。家族で必要な部分だけ書いてOKです。
        </p>
      </section>

      <section className="mt-4 space-y-4">
        {FIELDS.map((f) => (
          <div key={f.key} className="card">
            <label htmlFor={f.key} className="block text-base-jp font-bold">
              {f.label}
            </label>
            {f.hint && (
              <p className="mt-0.5 text-xs-jp text-slate-500">{f.hint}</p>
            )}
            {f.multiline ? (
              <textarea
                id={f.key}
                value={draft[f.key] ?? ""}
                onChange={(e) => handleChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                rows={3}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base leading-relaxed focus:border-sonae-primary focus:outline-none"
              />
            ) : (
              <input
                id={f.key}
                type="text"
                value={(draft[f.key] as string) ?? ""}
                onChange={(e) => handleChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base focus:border-sonae-primary focus:outline-none"
              />
            )}
          </div>
        ))}
      </section>

      <section className="sticky bottom-24 z-10 mt-5">
        <button
          type="button"
          onClick={handleSave}
          className="btn-primary w-full"
        >
          家族カードを保存する
        </button>
        <p
          role="status"
          aria-live="polite"
          className={`mt-2 text-center text-sm font-bold transition ${
            autoSaved ? "text-sonae-primary" : "text-slate-500"
          }`}
        >
          {autoSaved
            ? "✓ 保存OK。この端末だけに残ります。"
            : "入力中も自動保存しています"}
        </p>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" onClick={handlePrint} className="btn-secondary">
          🖨 印刷
        </button>
        <ShareButton
          text={shareText || "家族で防災カードを作っています。"}
          label="LINEで共有"
        />
      </section>

      {state.familyCard.updatedAt && (
        <p className="mt-3 text-center text-xs-jp text-slate-500">
          最終保存:{" "}
          {new Date(state.familyCard.updatedAt).toLocaleString("ja-JP")}
        </p>
      )}
    </Layout>
  );
}
