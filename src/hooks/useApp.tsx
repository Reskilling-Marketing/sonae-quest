import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type {
  AppState,
  CharacterGrowthType,
  CharacterState,
  DiagnosisAnswer,
  DiagnosisCategory,
  DiagnosisResult,
  FamilyCard,
  Quest,
  StockCheckState,
} from "@/types";
import {
  defaultAppState,
  loadState,
  resetState,
  saveState,
} from "@/lib/storage";
import { QUESTS } from "@/data/quests";
import { CHARACTERS, levelOf } from "@/data/characters";
import {
  DIAGNOSIS_QUESTIONS,
  SCORE_BY_ANSWER,
  determineLevel,
} from "@/data/diagnosis";

// =============================================================
// Reducer-based state management
//   - 純粋関数 reducer により state 更新を予測可能化
//   - action 駆動でセルフドキュメンティング
//   - dispatch は安定参照のため、Context value の useMemo が真に効く
//   - 将来 undo/redo 実装時の基盤
// =============================================================

type AppAction =
  | { type: "SET_ANSWER"; questionId: string; answer: DiagnosisAnswer }
  | {
      type: "SAVE_DIAGNOSIS";
      result: DiagnosisResult;
      answers: Record<string, DiagnosisAnswer>;
    }
  | { type: "RESET_DIAGNOSIS" }
  | { type: "TOGGLE_QUEST"; questId: string }
  | { type: "UPDATE_FAMILY_CARD"; patch: Partial<FamilyCard> }
  | {
      type: "UPDATE_STOCK_CHECK";
      itemId: string;
      patch: Partial<StockCheckState>;
    }
  | { type: "TOGGLE_PRO_INTEREST"; kitId: string; earlyBird: boolean }
  | { type: "RESET_ALL" };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_ANSWER":
      return {
        ...state,
        diagnosisAnswers: {
          ...state.diagnosisAnswers,
          [action.questionId]: action.answer,
        },
      };

    case "SAVE_DIAGNOSIS":
      return {
        ...state,
        diagnosis: action.result,
        diagnosisAnswers: action.answers,
      };

    case "RESET_DIAGNOSIS":
      return { ...state, diagnosis: null, diagnosisAnswers: {} };

    case "TOGGLE_QUEST": {
      const quest = QUESTS.find((q) => q.id === action.questId);
      if (!quest) return state;
      const completed = state.completedQuestIds.includes(action.questId);
      const nextCompleted = completed
        ? state.completedQuestIds.filter((id) => id !== action.questId)
        : [...state.completedQuestIds, action.questId];
      const charKey = quest.characterGrowthType;
      const prevChar: CharacterState = state.characters[charKey] ?? {
        type: charKey,
        experience: 0,
        level: 1,
      };
      const expDelta = completed ? -quest.experience : quest.experience;
      const nextExp = Math.max(0, prevChar.experience + expDelta);
      const nextChar: CharacterState = {
        ...prevChar,
        experience: nextExp,
        level: levelOf(nextExp),
      };
      return {
        ...state,
        completedQuestIds: nextCompleted,
        characters: { ...state.characters, [charKey]: nextChar },
      };
    }

    case "UPDATE_FAMILY_CARD":
      return {
        ...state,
        familyCard: {
          ...state.familyCard,
          ...action.patch,
          updatedAt: new Date().toISOString(),
        },
      };

    case "UPDATE_STOCK_CHECK": {
      const prev: StockCheckState = state.stockChecks[action.itemId] ?? {
        state: "none",
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        stockChecks: {
          ...state.stockChecks,
          [action.itemId]: {
            ...prev,
            ...action.patch,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    }

    case "TOGGLE_PRO_INTEREST": {
      const next = { ...state.proInterests };
      if (next[action.kitId]) {
        // 取り消し
        delete next[action.kitId];
      } else {
        next[action.kitId] = {
          kitId: action.kitId,
          expressedAt: new Date().toISOString(),
          earlyBird: action.earlyBird,
        };
      }
      return { ...state, proInterests: next };
    }

    case "RESET_ALL":
      return defaultAppState();

    default:
      return state;
  }
}

// =============================================================
// Pure helper: 診断結果計算（reducer から呼ぶため副作用なし）
// =============================================================

function computeDiagnosisResult(
  answers: Record<string, DiagnosisAnswer>,
): DiagnosisResult {
  const score = DIAGNOSIS_QUESTIONS.reduce(
    (sum, q) => sum + SCORE_BY_ANSWER[answers[q.id] ?? "unknown"],
    0,
  );
  const maxScore = DIAGNOSIS_QUESTIONS.length * 2;
  const level = determineLevel(score);

  const byCategoryScore = new Map<
    DiagnosisCategory,
    { gained: number; max: number }
  >();
  DIAGNOSIS_QUESTIONS.forEach((q) => {
    const a = answers[q.id] ?? "unknown";
    const entry = byCategoryScore.get(q.category) ?? { gained: 0, max: 0 };
    entry.gained += SCORE_BY_ANSWER[a];
    entry.max += 2;
    byCategoryScore.set(q.category, entry);
  });

  const ranked = Array.from(byCategoryScore.entries()).map(([category, v]) => ({
    category,
    ratio: v.gained / v.max,
  }));
  const strongCategories = ranked
    .filter((r) => r.ratio >= 0.75)
    .sort((a, b) => b.ratio - a.ratio)
    .map((r) => r.category);
  const weakCategories = ranked
    .filter((r) => r.ratio < 0.5)
    .sort((a, b) => a.ratio - b.ratio)
    .map((r) => r.category);

  const weakQuestionIds = new Set(
    DIAGNOSIS_QUESTIONS.filter(
      (q) => SCORE_BY_ANSWER[answers[q.id] ?? "unknown"] < 2,
    ).map((q) => q.id),
  );
  const recommendedSet = new Set<string>();
  DIAGNOSIS_QUESTIONS.forEach((q) => {
    if (weakQuestionIds.has(q.id)) {
      q.recommendedQuestIds.forEach((id) => recommendedSet.add(id));
    }
  });
  const topRecommendations = Array.from(recommendedSet).slice(0, 3);

  return {
    score,
    maxScore,
    level,
    strongCategories,
    weakCategories,
    topRecommendations,
    completedAt: new Date().toISOString(),
  };
}

// =============================================================
// Context API
// =============================================================

interface AppContextValue {
  state: AppState;
  saveDiagnosis: (answers: Record<string, DiagnosisAnswer>) => DiagnosisResult;
  setAnswer: (questionId: string, answer: DiagnosisAnswer) => void;
  resetDiagnosis: () => void;
  toggleQuest: (questId: string) => void;
  isQuestCompleted: (questId: string) => boolean;
  updateFamilyCard: (patch: Partial<FamilyCard>) => void;
  updateStockCheck: (itemId: string, patch: Partial<StockCheckState>) => void;
  toggleProInterest: (kitId: string, earlyBird?: boolean) => void;
  resetAll: () => void;
  computeRecommendedQuests: () => Quest[];
  characterStateOf: (type: CharacterGrowthType) => {
    experience: number;
    level: number;
  };
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, () =>
    typeof window !== "undefined" ? loadState() : defaultAppState(),
  );

  // localStorage は 300ms デバウンス（家族カード入力など毎打鍵書込みを防止）
  useEffect(() => {
    const id = window.setTimeout(() => saveState(state), 300);
    return () => window.clearTimeout(id);
  }, [state]);

  // dispatch は安定参照なので、これらコールバックも安定参照になる
  const setAnswer = useCallback(
    (questionId: string, answer: DiagnosisAnswer) => {
      dispatch({ type: "SET_ANSWER", questionId, answer });
    },
    [],
  );

  const saveDiagnosis = useCallback(
    (answers: Record<string, DiagnosisAnswer>) => {
      const result = computeDiagnosisResult(answers);
      dispatch({ type: "SAVE_DIAGNOSIS", result, answers });
      return result;
    },
    [],
  );

  const resetDiagnosis = useCallback(() => {
    dispatch({ type: "RESET_DIAGNOSIS" });
  }, []);

  const toggleQuest = useCallback((questId: string) => {
    dispatch({ type: "TOGGLE_QUEST", questId });
  }, []);

  const updateFamilyCard = useCallback((patch: Partial<FamilyCard>) => {
    dispatch({ type: "UPDATE_FAMILY_CARD", patch });
  }, []);

  const updateStockCheck = useCallback(
    (itemId: string, patch: Partial<StockCheckState>) => {
      dispatch({ type: "UPDATE_STOCK_CHECK", itemId, patch });
    },
    [],
  );

  const toggleProInterest = useCallback((kitId: string, earlyBird = true) => {
    dispatch({ type: "TOGGLE_PRO_INTEREST", kitId, earlyBird });
  }, []);

  const resetAll = useCallback(() => {
    resetState();
    dispatch({ type: "RESET_ALL" });
  }, []);

  // state 派生関数（state に依存）
  const isQuestCompleted = useCallback(
    (questId: string) => state.completedQuestIds.includes(questId),
    [state.completedQuestIds],
  );

  const computeRecommendedQuests = useCallback((): Quest[] => {
    const ids = state.diagnosis?.topRecommendations ?? [];
    const fromDiag = ids
      .map((id) => QUESTS.find((q) => q.id === id))
      .filter((q): q is Quest => Boolean(q));
    if (fromDiag.length >= 3) return fromDiag.slice(0, 3);
    const fallback = QUESTS.filter(
      (q) => q.durationMinutes <= 10 && !state.completedQuestIds.includes(q.id),
    ).slice(0, 3 - fromDiag.length);
    return [...fromDiag, ...fallback].slice(0, 3);
  }, [state.diagnosis, state.completedQuestIds]);

  const characterStateOf = useCallback(
    (type: CharacterGrowthType) => {
      const c = state.characters[type];
      if (!c) return { experience: 0, level: 1 };
      return { experience: c.experience, level: c.level };
    },
    [state.characters],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      saveDiagnosis,
      setAnswer,
      resetDiagnosis,
      toggleQuest,
      isQuestCompleted,
      updateFamilyCard,
      updateStockCheck,
      toggleProInterest,
      resetAll,
      computeRecommendedQuests,
      characterStateOf,
    }),
    [
      state,
      saveDiagnosis,
      setAnswer,
      resetDiagnosis,
      toggleQuest,
      isQuestCompleted,
      updateFamilyCard,
      updateStockCheck,
      toggleProInterest,
      resetAll,
      computeRecommendedQuests,
      characterStateOf,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export const ALL_CHARACTERS = CHARACTERS;
