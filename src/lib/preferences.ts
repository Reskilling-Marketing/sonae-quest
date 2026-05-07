/**
 * ユーザー嗜好（文字サイズ・読み上げ）の管理
 *
 * - localStorage 単独（外部 API/同期 なし）
 * - body class でグローバルに反映
 * - Web Speech API でテキスト読み上げ（無料・登録不要、対応ブラウザのみ）
 */

export type FontScale = "normal" | "large" | "xlarge";

const KEY = "sonae-quest:prefs:v1";

export interface UserPrefs {
  fontScale: FontScale;
}

const DEFAULTS: UserPrefs = { fontScale: "normal" };

export function loadPrefs(): UserPrefs {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export function savePrefs(prefs: UserPrefs): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    /* quota or private mode */
  }
}

const SCALE_CLASSES: Record<FontScale, string> = {
  normal: "",
  large: "sq-fs-large",
  xlarge: "sq-fs-xlarge",
};

export function applyFontScale(scale: FontScale): void {
  if (typeof document === "undefined") return;
  Object.values(SCALE_CLASSES).forEach((c) => {
    if (c) document.body.classList.remove(c);
  });
  const cls = SCALE_CLASSES[scale];
  if (cls) document.body.classList.add(cls);
}

// =============================================================
// Speech (Web Speech API)
// =============================================================

export function isSpeechSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "speechSynthesis" in window;
}

export function speak(
  text: string,
  opts: { lang?: string; rate?: number } = {},
): boolean {
  if (!isSpeechSupported()) return false;
  try {
    const synth = window.speechSynthesis;
    if (synth.speaking) synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = opts.lang ?? "ja-JP";
    utter.rate = opts.rate ?? 1.0;
    synth.speak(utter);
    return true;
  } catch {
    return false;
  }
}

export function stopSpeaking(): void {
  if (!isSpeechSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
}
