/**
 * 緊急時連絡先・公式情報源リンク集
 *
 * すべて公式・無料の公開情報。サードパーティへのリンクのみで完結（バックエンド不要）
 */

export interface EmergencyContact {
  id: string;
  label: string;
  /** tel:/sms: なら直接かかる、https:// なら外部サイト */
  href: string;
  emoji: string;
  description: string;
  variant: "danger" | "warn" | "primary" | "secondary";
}

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: "tel-119",
    label: "119 — 救急・火災",
    href: "tel:119",
    emoji: "🚒",
    description: "ケガ・病気・火災のとき",
    variant: "danger",
  },
  {
    id: "tel-110",
    label: "110 — 警察",
    href: "tel:110",
    emoji: "🚓",
    description: "事件・事故・防犯",
    variant: "danger",
  },
  {
    id: "tel-171",
    label: "171 — 災害用伝言ダイヤル",
    href: "tel:171",
    emoji: "📞",
    description: "災害時の家族安否確認 (録音1 / 再生2)",
    variant: "warn",
  },
  {
    id: "web-171",
    label: "災害用伝言板 (Web 171)",
    href: "https://www.web171.jp/",
    emoji: "🌐",
    description: "171 のWeb版 (NTT 公式)",
    variant: "warn",
  },
  {
    id: "tel-118",
    label: "118 — 海上保安庁",
    href: "tel:118",
    emoji: "🌊",
    description: "海での事故・密航・密漁",
    variant: "warn",
  },
  {
    id: "tel-189",
    label: "189 — 児童相談所",
    href: "tel:189",
    emoji: "🧒",
    description: "子どもの SOS（24時間）",
    variant: "warn",
  },
];

export interface InfoSource {
  id: string;
  label: string;
  href: string;
  emoji: string;
  category: "気象" | "防災" | "地域" | "ペット・福祉";
  description: string;
}

export const INFO_SOURCES: InfoSource[] = [
  // === 気象・地震 ===
  {
    id: "jma-warning",
    label: "気象庁 防災情報",
    href: "https://www.jma.go.jp/bosai/",
    emoji: "🌀",
    category: "気象",
    description: "地震・津波・台風・大雨など全国の警報・注意報",
  },
  {
    id: "jma-earthquake",
    label: "気象庁 地震情報",
    href: "https://www.jma.go.jp/bosai/map.html#5/34.7/137.7/&elem=int&contents=earthquake_map",
    emoji: "🌐",
    category: "気象",
    description: "震度マップ / 直近の地震",
  },
  {
    id: "jma-tsunami",
    label: "気象庁 津波情報",
    href: "https://www.jma.go.jp/bosai/tsunami/",
    emoji: "🌊",
    category: "気象",
    description: "津波警報・注意報",
  },
  {
    id: "jma-volcano",
    label: "気象庁 火山情報",
    href: "https://www.jma.go.jp/bosai/volcano/",
    emoji: "🌋",
    category: "気象",
    description: "噴火警戒レベル",
  },

  // === 防災 ===
  {
    id: "naikaku-bosai",
    label: "内閣府 防災情報のページ",
    href: "https://www.bousai.go.jp/",
    emoji: "🛡️",
    category: "防災",
    description: "国の防災基本情報・各種ハンドブック",
  },
  {
    id: "shobocho",
    label: "総務省消防庁",
    href: "https://www.fdma.go.jp/",
    emoji: "🚨",
    category: "防災",
    description: "防災マニュアル・住宅用火災警報器",
  },
  {
    id: "kokumin-hogo",
    label: "国民保護ポータル",
    href: "https://www.kokuminhogo.go.jp/",
    emoji: "🇯🇵",
    category: "防災",
    description: "弾道ミサイル・武力攻撃時の行動",
  },
  {
    id: "hazardmap",
    label: "ハザードマップポータル",
    href: "https://disaportal.gsi.go.jp/",
    emoji: "🗺️",
    category: "防災",
    description: "国土地理院 / 自宅周辺のリスク確認",
  },

  // === 地域 ===
  {
    id: "osaka-bosai",
    label: "大阪市 防災情報",
    href: "https://www.city.osaka.lg.jp/kikikanrishitsu/",
    emoji: "🏙️",
    category: "地域",
    description: "大阪市の避難場所・防災マップ",
  },
  {
    id: "osaka-pref-bosai",
    label: "大阪府 防災情報",
    href: "https://www.pref.osaka.lg.jp/kikikanri/",
    emoji: "🏛️",
    category: "地域",
    description: "大阪府の防災・危機管理",
  },

  // === ペット・福祉 ===
  {
    id: "env-pet",
    label: "環境省 ペットの災害対策",
    href: "https://www.env.go.jp/nature/dobutsu/aigo/2_data/pamph/index.html",
    emoji: "🐕",
    category: "ペット・福祉",
    description: "同行避難ガイドライン",
  },
  {
    id: "kosei-fukushi",
    label: "厚生労働省 災害医療",
    href: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000128348.html",
    emoji: "🏥",
    category: "ペット・福祉",
    description: "災害医療・福祉避難所",
  },
];

export const INFO_CATEGORIES = [
  "気象",
  "防災",
  "地域",
  "ペット・福祉",
] as const;
