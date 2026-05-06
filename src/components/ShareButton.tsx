import { useState } from "react";
import { buildLineShareUrl, shareOrCopy } from "@/lib/share";

interface ShareButtonProps {
  text: string;
  title?: string;
  url?: string;
  variant?: "primary" | "accent" | "secondary";
  fullWidth?: boolean;
  label?: string;
}

export function ShareButton({
  text,
  title,
  url,
  variant = "accent",
  fullWidth = true,
  label = "LINEで共有",
}: ShareButtonProps) {
  const [feedback, setFeedback] = useState<string>("");

  const onShare = async () => {
    const result = await shareOrCopy({ text, title, url });
    if (result === "shared") {
      setFeedback("共有しました");
    } else if (result === "copied") {
      setFeedback("クリップボードにコピーしました");
    } else {
      setFeedback("");
    }
    if (result === "failed") {
      const lineUrl = buildLineShareUrl(url ? `${text}\n${url}` : text);
      window.open(lineUrl, "_blank", "noopener");
    }
    setTimeout(() => setFeedback(""), 3000);
  };

  const cls =
    variant === "primary"
      ? "btn-primary"
      : variant === "secondary"
        ? "btn-secondary"
        : "btn-accent";

  return (
    <div className={fullWidth ? "w-full" : ""}>
      <button
        type="button"
        onClick={onShare}
        className={`${cls} ${fullWidth ? "w-full" : ""}`}
      >
        <span aria-hidden className="text-lg">
          📣
        </span>
        {label}
      </button>
      {feedback && (
        <p
          role="status"
          className="mt-2 text-center text-xs-jp text-sonae-primary"
        >
          {feedback}
        </p>
      )}
    </div>
  );
}
