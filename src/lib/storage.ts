import type { AppState, CharacterGrowthType, FamilyCard } from "@/types";
import { CHARACTERS } from "@/data/characters";

export const STORAGE_KEY = "sonae-quest:v1";

export const EMPTY_FAMILY_CARD: FamilyCard = {
  meetingPlace: "",
  emergencyContacts: "",
  shelter: "",
  goBagLocation: "",
  medicalNotes: "",
  petInfo: "",
  messageToChild: "",
  contactRule: "",
  updatedAt: "",
};

export function defaultCharacterStates(): Record<
  CharacterGrowthType,
  { type: CharacterGrowthType; experience: number; level: number }
> {
  const out = {} as Record<
    CharacterGrowthType,
    { type: CharacterGrowthType; experience: number; level: number }
  >;
  for (const c of CHARACTERS) {
    out[c.type] = { type: c.type, experience: 0, level: 1 };
  }
  return out;
}

export function defaultAppState(): AppState {
  return {
    diagnosis: null,
    diagnosisAnswers: {},
    completedQuestIds: [],
    characters: defaultCharacterStates(),
    familyCard: { ...EMPTY_FAMILY_CARD },
    firstVisitAt: new Date().toISOString(),
    stockChecks: {},
    proInterests: {},
  };
}

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultAppState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAppState();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    const base = defaultAppState();
    return {
      ...base,
      ...parsed,
      diagnosisAnswers: parsed.diagnosisAnswers ?? {},
      completedQuestIds: parsed.completedQuestIds ?? [],
      characters: { ...base.characters, ...(parsed.characters ?? {}) },
      familyCard: { ...base.familyCard, ...(parsed.familyCard ?? {}) },
      stockChecks: parsed.stockChecks ?? {},
      proInterests: parsed.proInterests ?? {},
    };
  } catch (err) {
    console.warn("storage load failed", err);
    return defaultAppState();
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn("storage save failed", err);
  }
}

export function resetState(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
