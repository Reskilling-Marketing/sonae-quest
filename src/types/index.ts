export type CharacterGrowthType =
  | "yure" // 地震
  | "mizu" // 水害・備蓄
  | "hikari" // 停電
  | "kizuna" // 家族連絡
  | "michi"; // 避難経路

export type QuestCategory =
  | "5分でできる"
  | "家族でやる"
  | "子どもとやる"
  | "外に出て確認する"
  | "備蓄する"
  | "地震対策"
  | "水害対策"
  | "停電対策";

export type QuestDifficulty = 1 | 2 | 3;

export interface Quest {
  id: string;
  title: string;
  category: QuestCategory;
  targetAge: "全員" | "子ども" | "親" | "高齢者";
  durationMinutes: number;
  difficulty: QuestDifficulty;
  description: string;
  steps: string[];
  characterGrowthType: CharacterGrowthType;
  experience: number;
}

export type DiagnosisAnswer = "yes" | "unknown" | "no";

export type DiagnosisCategory =
  | "水・食料"
  | "家具・住居"
  | "連絡手段"
  | "避難場所"
  | "子ども・高齢者・ペット"
  | "情報収集";

export interface DiagnosisQuestion {
  id: string;
  category: DiagnosisCategory;
  question: string;
  hint?: string;
  weakAdvice: string;
  recommendedQuestIds: string[];
}

export type ReadinessLevel = "S" | "A" | "B" | "C" | "D" | "E";

export interface DiagnosisResult {
  score: number;
  maxScore: number;
  level: ReadinessLevel;
  strongCategories: DiagnosisCategory[];
  weakCategories: DiagnosisCategory[];
  topRecommendations: string[];
  completedAt: string;
}

export interface CharacterDef {
  type: CharacterGrowthType;
  name: string;
  emoji: string;
  role: string;
  description: string;
  color: string;
}

export interface CharacterState {
  type: CharacterGrowthType;
  experience: number;
  level: number;
}

export interface FamilyCard {
  meetingPlace: string;
  emergencyContacts: string;
  shelter: string;
  goBagLocation: string;
  medicalNotes: string;
  petInfo: string;
  messageToChild: string;
  contactRule: string;
  updatedAt: string;
}

export interface HandbookArticle {
  slug: string;
  title: string;
  emoji: string;
  summary: string;
  body: { heading: string; lines: string[] }[];
}

export interface AppState {
  diagnosis: DiagnosisResult | null;
  diagnosisAnswers: Record<string, DiagnosisAnswer>;
  completedQuestIds: string[];
  characters: Record<CharacterGrowthType, CharacterState>;
  familyCard: FamilyCard;
  firstVisitAt: string;
  stockChecks: Record<string, StockCheckState>;
  /** Pro キットへの興味表明（個人情報なし、LocalStorageのみ） */
  proInterests: Record<string, ProInterest>;
}

export interface ProInterest {
  /** Pro キット ID */
  kitId: string;
  /** 興味表明した時刻 */
  expressedAt: string;
  /** 早期登録希望か */
  earlyBird: boolean;
}

// =============================================================
// 避難所（カモガモ防災APPの「避難所」機能を吸収）
// =============================================================

export type DisasterType =
  | "earthquake" // 地震
  | "flood" // 水害・洪水
  | "tsunami" // 津波
  | "typhoon" // 台風
  | "landslide" // 土砂災害
  | "fire" // 大規模火災
  | "inland-flood" // 内水氾濫
  | "high-tide"; // 高潮

export interface Shelter {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  /** どの災害に対応している指定避難所か */
  supports: DisasterType[];
  /** 屋外/屋内/兼用 */
  category: "指定避難所" | "指定緊急避難場所" | "福祉避難所" | "広域避難場所";
  /** 任意のメモ（収容人数、車椅子対応など） */
  notes?: string;
}

// =============================================================
// 備蓄管理（カモガモ防災APPの「備蓄」機能を吸収）
// =============================================================

export type StockCategory =
  | "水・飲料"
  | "食料"
  | "医療・衛生"
  | "電源・情報"
  | "防寒・衣類"
  | "トイレ・生活";

export interface StockItem {
  id: string;
  name: string;
  category: StockCategory;
  /** 1人あたりの推奨数（×家族人数で計算） */
  perPersonPerDay?: number;
  /** 推奨日数（基本3日、ペット等で5日、可能なら7日） */
  recommendedDays: 3 | 5 | 7;
  hint?: string;
}

export type StockState = "have" | "partial" | "none";

export interface StockCheckState {
  state: StockState;
  expiryDate?: string; // YYYY-MM-DD
  note?: string;
  updatedAt: string;
}
