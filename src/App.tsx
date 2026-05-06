import { lazy, Suspense } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppProvider } from "@/hooks/useApp";

// 各ルートを動的 import：初期JSを最小化（QR来訪→初期表示の高速化）
const HomePage = lazy(() =>
  import("@/pages/Home").then((m) => ({ default: m.HomePage })),
);
const DiagnosisPage = lazy(() =>
  import("@/pages/Diagnosis").then((m) => ({ default: m.DiagnosisPage })),
);
const QuestsPage = lazy(() =>
  import("@/pages/Quests").then((m) => ({ default: m.QuestsPage })),
);
const CharactersPage = lazy(() =>
  import("@/pages/Characters").then((m) => ({ default: m.CharactersPage })),
);
const FamilyCardPage = lazy(() =>
  import("@/pages/FamilyCard").then((m) => ({ default: m.FamilyCardPage })),
);
const HandbookPage = lazy(() =>
  import("@/pages/Handbook").then((m) => ({ default: m.HandbookPage })),
);
const HandbookArticlePage = lazy(() =>
  import("@/pages/HandbookArticle").then((m) => ({
    default: m.HandbookArticlePage,
  })),
);
const SheltersPage = lazy(() =>
  import("@/pages/Shelters").then((m) => ({ default: m.SheltersPage })),
);
const StockPage = lazy(() =>
  import("@/pages/Stock").then((m) => ({ default: m.StockPage })),
);
const MorePage = lazy(() =>
  import("@/pages/More").then((m) => ({ default: m.MorePage })),
);

function RouteFallback() {
  return (
    <div
      className="flex min-h-dvh items-center justify-center text-sonae-primary"
      aria-busy="true"
    >
      <span className="animate-pulse text-base-jp font-bold">読み込み中…</span>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/diagnosis" element={<DiagnosisPage />} />
            <Route path="/quests" element={<QuestsPage />} />
            <Route path="/characters" element={<CharactersPage />} />
            <Route path="/family" element={<FamilyCardPage />} />
            <Route path="/handbook" element={<HandbookPage />} />
            <Route path="/handbook/:slug" element={<HandbookArticlePage />} />
            <Route path="/shelters" element={<SheltersPage />} />
            <Route path="/stock" element={<StockPage />} />
            <Route path="/more" element={<MorePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </AppProvider>
  );
}
