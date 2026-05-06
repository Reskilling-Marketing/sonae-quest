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
}
