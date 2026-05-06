export interface ShareInput {
  title?: string;
  text: string;
  url?: string;
}

export type ShareResult = "shared" | "copied" | "failed";

export async function shareOrCopy(input: ShareInput): Promise<ShareResult> {
  if (typeof window === "undefined") return "failed";
  const navAny = window.navigator as Navigator & {
    share?: (data: ShareInput) => Promise<void>;
    clipboard?: { writeText: (s: string) => Promise<void> };
  };

  if (typeof navAny.share === "function") {
    try {
      await navAny.share({
        title: input.title ?? "そなえクエスト",
        text: input.text,
        url: input.url,
      });
      return "shared";
    } catch (err) {
      const aborted = (err as DOMException)?.name === "AbortError";
      if (aborted) return "failed";
    }
  }

  const fullText = input.url ? `${input.text}\n${input.url}` : input.text;
  try {
    if (navAny.clipboard?.writeText) {
      await navAny.clipboard.writeText(fullText);
      return "copied";
    }
  } catch (err) {
    console.warn("clipboard failed", err);
  }
  return "failed";
}

export function buildLineShareUrl(text: string): string {
  const encoded = encodeURIComponent(text);
  return `https://line.me/R/msg/text/?${encoded}`;
}
