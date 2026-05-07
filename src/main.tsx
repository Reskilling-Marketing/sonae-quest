import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { PWAUpdatePrompt } from "./components/PWAUpdatePrompt";
import { applyFontScale, loadPrefs } from "./lib/preferences";
import "./index.css";

// 起動時に保存された文字サイズを適用
applyFontScale(loadPrefs().fontScale);

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("root element not found");

createRoot(rootEl).render(
  <StrictMode>
    <App />
    <PWAUpdatePrompt />
  </StrictMode>,
);
