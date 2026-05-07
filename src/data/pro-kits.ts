/**
 * Pro 防災キット（フリーミアム上位プラン）
 *
 * Business Model v2（CEO Pivot 2026-05-07）に準拠：
 * - 非接触型 / フリーミアム / SNS-SEO自動集客 / 0円ランニング
 * - 利益率99%以上（API コストはClaude Haiku 月¥7想定 / 月リクエスト上限あり）
 *
 * 現状は MVP 予告のみ：
 * - 興味あり = LocalStorage にユーザーが「希望」を記録
 * - メールアドレス・決済情報は一切収集しない
 * - 実 API 呼出 / 決済システム / 早期登録フォームは CEO 承認後 Phase 2 で実装
 *
 * 個人情報サーバー送信ゼロ・維持費0円ポリシーを Pro 予告フェーズで堅持
 */

export interface ProKit {
  id: string;
  name: string;
  emoji: string;
  audience: string;
  /** 月額（円） */
  monthlyPrice: number;
  /** 早期登録割引（%） */
  earlyBirdDiscount?: number;
  /** 月のAIリクエスト上限 */
  aiRequestLimit: number;
  /** 主要機能（無料との差） */
  highlights: string[];
  /** AI で実現する機能 */
  aiFeatures: string[];
  /** 一行説明 */
  description: string;
  tone: string;
}

export const PRO_KITS: ProKit[] = [
  {
    id: "pro-individual",
    name: "個人プラン",
    emoji: "👤",
    audience: "ひとり暮らし・防災を深掘りしたい個人",
    monthlyPrice: 980,
    earlyBirdDiscount: 50,
    aiRequestLimit: 50,
    description:
      "AI 防災コーチがあなた専属で、住居・地域・体調に合わせた行動を毎日アドバイス。",
    highlights: [
      "AI 防災コーチに直接質問できる（月50回まで）",
      "あなたの住所・家族構成からハザードを文章で解説",
      "PDFレポート プレミアム版（多枚・カラー・年間訓練カレンダー）",
      "業種別クエスト全アクセス",
    ],
    aiFeatures: [
      "個別アドバイス: 「ペットと一緒に避難するには？」など対話",
      "シナリオ訓練: 「いま地震が起きた」インタラクティブ模擬",
      "リスク要約: 自宅周辺の危険を3行で",
    ],
    tone: "border-sky-300 bg-sky-50 text-sky-900",
  },
  {
    id: "pro-family",
    name: "家族プラン",
    emoji: "👨‍👩‍👧",
    audience: "子育て世帯・三世代同居・在宅介護家庭",
    monthlyPrice: 1980,
    earlyBirdDiscount: 50,
    aiRequestLimit: 100,
    description:
      "家族5人まで端末をリンク。子ども・高齢者・ペット別の専門アドバイスを AI が個別に。",
    highlights: [
      "5端末まで利用可能（家族会議の同期）",
      "子ども版・大人版・高齢者版のクエスト自動切替",
      "AI が家族構成からカスタムクエスト30個を毎月再生成",
      "「家族会議シート」PDF パック（年12回分）",
    ],
    aiFeatures: [
      "子どもへの防災教育: 5歳児にも届く語彙でAIが説明",
      "高齢者ケア: 介護度・持病に応じた避難計画を提案",
      "ペット同行避難: 種類・大きさ別の最適避難法",
    ],
    tone: "border-pink-300 bg-pink-50 text-pink-900",
  },
  {
    id: "pro-school",
    name: "学校プラン",
    emoji: "🏫",
    audience: "保育園・幼稚園・小中高（1校〜）",
    monthlyPrice: 9800,
    earlyBirdDiscount: 50,
    aiRequestLimit: 500,
    description:
      "全教職員＋保護者で使える防災教育プラットフォーム。年間訓練カレンダー連動。",
    highlights: [
      "全教職員・全保護者の端末で利用（人数無制限）",
      "学校防災ハンドブック準拠の30クエスト",
      "避難訓練シナリオ集・ロールプレイ台本",
      "保護者向け配布PDF・LINE案内テンプレ",
      "年間防災教育カレンダー（学習指導要領対応）",
    ],
    aiFeatures: [
      "学年別カリキュラム自動生成: 小1〜高3に最適化",
      "災害シナリオ訓練 AI ファシリテーター",
      "PTAアンケート文面の自動生成",
    ],
    tone: "border-emerald-300 bg-emerald-50 text-emerald-900",
  },
  {
    id: "pro-company",
    name: "企業プラン",
    emoji: "🏢",
    audience: "中小企業・スタートアップ（〜500名）",
    monthlyPrice: 29800,
    earlyBirdDiscount: 50,
    aiRequestLimit: 2000,
    description:
      "BCP（事業継続計画）と連動。在宅勤務・出張中の社員も含めた安否確認とトレーニング。",
    highlights: [
      "全社員端末で利用",
      "業種別BCP テンプレ（IT/小売/製造/医療）",
      "在宅勤務時の安否確認自動化（手動コピペ）",
      "管理職向け防災判断シミュレーター",
      "監督官庁向け実施報告書テンプレ",
    ],
    aiFeatures: [
      "BCP 文面の自動ドラフト",
      "災害時の事業継続判断 AI 相談",
      "従業員アンケート集計と要約",
    ],
    tone: "border-indigo-300 bg-indigo-50 text-indigo-900",
  },
  {
    id: "pro-municipality",
    name: "自治体プラン",
    emoji: "🏛️",
    audience: "市区町村・自治会・地域コミュニティ",
    monthlyPrice: 98000,
    earlyBirdDiscount: 50,
    aiRequestLimit: 10000,
    description:
      "市民配布用カスタム版を提供。ハザードマップ・避難所データ・配布物テンプレを地域オーダーメイド。",
    highlights: [
      "市町村ロゴ入りのカスタム版アプリ",
      "全避難所データの取り込み（GIS連携）",
      "市民向け配布チラシ・回覧板テンプレ",
      "防災マルシェ協賛枠",
      "地域別ハザードマップ統合表示",
    ],
    aiFeatures: [
      "高齢者向けシンプル版アドバイス自動生成",
      "外国人住民向け多言語自動翻訳",
      "災害時の市民問い合わせ FAQ AI",
    ],
    tone: "border-amber-300 bg-amber-50 text-amber-900",
  },
];

export const FREE_PROMISE = [
  "✅ 12問診断・30クエスト・防災手帳9記事は永久無料",
  "✅ 避難所マップ・備蓄管理・家族カードは永久無料",
  "✅ 緊急アクション・PDF出力・読み上げは永久無料",
  "✅ 個人情報のサーバー送信は今後もゼロ（Proでも）",
];

export const PRO_PRIVACY_PROMISE = [
  "Pro加入時のみ AI API（Anthropic / OpenAI 等）にリクエスト送信",
  "送信内容は質問テキストのみ。個人特定情報は送りません",
  "AI に送る前に確認画面で何を送るか可視化",
  "API 経由の質問履歴はサーバーには残しません",
  "決済は決済代行（Stripe 等）を経由、当社はカード情報を保持しません",
];
