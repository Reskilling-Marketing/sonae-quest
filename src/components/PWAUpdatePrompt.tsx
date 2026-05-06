import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

/**
 * Service Worker の新版検知 → ユーザーへ更新トースト表示
 *  - "更新する" を押すと skipWaiting → reload で最新版に
 *  - "あとで" を押すと閉じるだけ（次回起動時に再表示される）
 *  - オフライン準備完了時にも軽い通知を出す
 */
export function PWAUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      // 1時間に1回、新版チェック（タブ常駐時）
      if (registration) {
        setInterval(
          () => registration.update().catch(() => undefined),
          60 * 60 * 1000,
        );
      }
    },
  });

  const [showOffline, setShowOffline] = useState(false);
  useEffect(() => {
    if (!offlineReady) return;
    setShowOffline(true);
    const id = window.setTimeout(() => {
      setShowOffline(false);
      setOfflineReady(false);
    }, 4000);
    return () => window.clearTimeout(id);
  }, [offlineReady, setOfflineReady]);

  if (!needRefresh && !showOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="safe-area-bottom fixed inset-x-0 bottom-20 z-40 mx-auto flex max-w-md justify-center px-4"
    >
      {needRefresh ? (
        <div className="card flex w-full items-center justify-between gap-3 border-2 border-sonae-primary bg-white">
          <div>
            <p className="text-base-jp font-bold text-sonae-primary">
              新しい版があります
            </p>
            <p className="text-xs-jp text-slate-700">
              読み込み直すと最新になります。
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setNeedRefresh(false)}
              className="rounded-full px-3 py-2 text-xs-jp font-bold text-slate-500"
            >
              あとで
            </button>
            <button
              type="button"
              onClick={() => updateServiceWorker(true)}
              className="rounded-full bg-sonae-primary px-4 py-2 text-xs-jp font-bold text-white"
            >
              更新する
            </button>
          </div>
        </div>
      ) : (
        <div className="card w-full border border-teal-200 bg-teal-50 text-center">
          <p className="text-sm font-bold text-teal-900">
            📡 オフラインでも使えるようになりました
          </p>
        </div>
      )}
    </div>
  );
}
