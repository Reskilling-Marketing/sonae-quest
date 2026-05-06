import type {
  DiagnosisQuestion,
  DiagnosisAnswer,
  ReadinessLevel,
} from "@/types";

export const SCORE_BY_ANSWER: Record<DiagnosisAnswer, number> = {
  yes: 2,
  unknown: 1,
  no: 0,
};

export const DIAGNOSIS_QUESTIONS: DiagnosisQuestion[] = [
  {
    id: "q01",
    category: "水・食料",
    question: "家族の人数 × 3日分の水（1人1日3L）が家にありますか？",
    hint: "4人家族なら36L（2Lペット 18本）が目安",
    weakAdvice: "まずは2Lペット6本から。買い足すリズムを家族で決めましょう。",
    recommendedQuestIds: ["quest-water-3days", "quest-rolling-stock"],
  },
  {
    id: "q02",
    category: "水・食料",
    question: "常温で食べられる非常食を3日分以上ストックしていますか？",
    hint: "レトルト・缶詰・パン缶・栄養補助食品など",
    weakAdvice:
      "普段食べる缶詰やレトルトを少し多めに。ローリングストックが続けやすい。",
    recommendedQuestIds: ["quest-rolling-stock", "quest-food-3days"],
  },
  {
    id: "q03",
    category: "家具・住居",
    question: "寝室・子ども部屋の背の高い家具は固定されていますか？",
    hint: "L字金具・突っ張り棒・耐震マットなど",
    weakAdvice:
      "寝室から1つだけ固定するだけでも、命を守る確率がぐんと上がります。",
    recommendedQuestIds: ["quest-furniture-fix", "quest-bedroom-check"],
  },
  {
    id: "q04",
    category: "家具・住居",
    question:
      "寝ている場所の上や近くに、落ちてきたら危ないものはありませんか？",
    hint: "額・本・テレビ・照明など",
    weakAdvice:
      "頭上のものを「下ろす」「外す」「向きを変える」だけで十分です。",
    recommendedQuestIds: ["quest-bedroom-check", "quest-glass-film"],
  },
  {
    id: "q05",
    category: "連絡手段",
    question:
      "災害時に家族と連絡を取る方法（手段・優先順位）を決めていますか？",
    hint: "171・LINE・メール・SNSなど複数手段",
    weakAdvice:
      "電話は使えなくなる前提で、LINE+災害伝言ダイヤル(171)の2本立てが◎",
    recommendedQuestIds: ["quest-contact-rule", "quest-171-test"],
  },
  {
    id: "q06",
    category: "連絡手段",
    question: "災害用伝言ダイヤル（171）を一度でも使ったことがありますか？",
    hint: "毎月1日・15日や防災週間に体験利用できます",
    weakAdvice: "今度の体験日に家族で1回かけるだけでOK。3分で終わります。",
    recommendedQuestIds: ["quest-171-test"],
  },
  {
    id: "q07",
    category: "避難場所",
    question:
      "自宅から最寄りの避難所までのルートを実際に歩いたことがありますか？",
    hint: "昼と夜では見え方が違います",
    weakAdvice: "まずは昼の散歩がてら一度。子どもと歩くと記憶に残ります。",
    recommendedQuestIds: ["quest-walk-shelter", "quest-night-route"],
  },
  {
    id: "q08",
    category: "避難場所",
    question: "家族の集合場所（自宅以外）を決めていますか？",
    hint: "公園・親戚宅・コンビニなど",
    weakAdvice:
      "「自宅が無理ならここ」を1か所決めるだけで、再会率は大きく上がります。",
    recommendedQuestIds: ["quest-meeting-point"],
  },
  {
    id: "q09",
    category: "子ども・高齢者・ペット",
    question:
      "子ども・高齢者・ペット用の備え（ミルク・薬・フード等）を3日分以上用意していますか？",
    weakAdvice:
      "一般的な避難所では不足しがちな物。家族の特別なニーズは家庭で備えるのが基本。",
    recommendedQuestIds: ["quest-special-stock", "quest-pet-bag"],
  },
  {
    id: "q10",
    category: "子ども・高齢者・ペット",
    question: "子どもに、地震が起きたときの行動を教えていますか？",
    hint: "ダンゴムシのポーズ・机の下・大人の指示を待つ",
    weakAdvice: "5分の親子訓練で十分。クイズ形式にすると楽しく覚えてくれます。",
    recommendedQuestIds: ["quest-kids-drill", "quest-bousai-talk"],
  },
  {
    id: "q11",
    category: "情報収集",
    question: "住んでいる地域のハザードマップを見たことがありますか？",
    hint: "市区町村のサイトで無料公開されています",
    weakAdvice: "5分でOK。地震・水害・土砂のリスクを地図で確認しましょう。",
    recommendedQuestIds: ["quest-hazard-map"],
  },
  {
    id: "q12",
    category: "情報収集",
    question:
      "スマホの電池が切れた時のために、モバイルバッテリーや手回し充電器がありますか？",
    weakAdvice:
      "充電済みのモバイルバッテリーを玄関に1つ置くだけで安心感が違います。",
    recommendedQuestIds: ["quest-battery-check", "quest-blackout-night"],
  },
];

export function determineLevel(score: number): ReadinessLevel {
  if (score >= 22) return "S";
  if (score >= 18) return "A";
  if (score >= 14) return "B";
  if (score >= 9) return "C";
  if (score >= 4) return "D";
  return "E";
}

export const LEVEL_DESCRIPTIONS: Record<
  ReadinessLevel,
  { label: string; comment: string; color: string }
> = {
  S: {
    label: "頼れる防災リーダー",
    comment:
      "ご近所と共有したくなる防災力。仕上げの3項目で、さらに磨き込めます。",
    color: "text-emerald-700 bg-emerald-50",
  },
  A: {
    label: "しっかり備え組",
    comment:
      "ベースはバッチリ。家族訓練・避難ルートの実走で行動力に変えていきましょう。",
    color: "text-emerald-700 bg-emerald-50",
  },
  B: {
    label: "基本は押さえた組",
    comment:
      "備えはあるが、連絡や避難の決め事があいまい。今週3つ決めると一段上がります。",
    color: "text-amber-700 bg-amber-50",
  },
  C: {
    label: "これから上向き組",
    comment:
      "まずは「水・連絡・避難所」の3点セットを今月中に。1週間で景色が変わります。",
    color: "text-amber-700 bg-amber-50",
  },
  D: {
    label: "これから加速ゾーン",
    comment:
      "焦らず1日1個から。1週間で防災レベルがB以上に上がる行動を用意しました。",
    color: "text-rose-700 bg-rose-50",
  },
  E: {
    label: "これからスタート組",
    comment:
      "一番大事なのは「気づいた今」。今日、5分でできるクエストを1つ、一緒にやりましょう。",
    color: "text-rose-700 bg-rose-50",
  },
};
