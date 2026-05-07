import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { useApp } from "@/hooks/useApp";
import {
  EMERGENCY_CONTACTS,
  INFO_CATEGORIES,
  INFO_SOURCES,
} from "@/data/emergency";
import { getCurrentPosition } from "@/lib/geo";

/**
 * 🆘 緊急アクション画面
 *  - 119 / 110 / 171 への直通ボタン
 *  - 画面ライト（白画面オーバーレイ）— 停電時の懐中電灯代わり
 *  - サイレン音 (Web Audio API、外部ファイルなし)
 *  - 現在地を家族カードのメモに自動追記
 *  - 災害情報の公式リンク集（気象庁・国民保護ポータル等）
 */
export function EmergencyPage() {
  const { state, updateFamilyCard } = useApp();
  const [flashlight, setFlashlight] = useState(false);
  const [sirenOn, setSirenOn] = useState(false);
  const [posMsg, setPosMsg] = useState<string>("");
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  // 画面ロックを取得（電池の保護のため iOS は不可、Android は対応）
  useEffect(() => {
    if (!flashlight && !sirenOn) return;
    let lock: WakeLockSentinel | null = null;
    type WakeLockNavigator = Navigator & {
      wakeLock?: { request: (t: string) => Promise<WakeLockSentinel> };
    };
    type WakeLockSentinel = { release: () => Promise<void> };
    const n = navigator as WakeLockNavigator;
    n.wakeLock
      ?.request("screen")
      .then((l) => (lock = l))
      .catch(() => undefined);
    return () => {
      lock?.release().catch(() => undefined);
    };
  }, [flashlight, sirenOn]);

  const startSiren = () => {
    if (sirenOn) return;
    try {
      const Ctx = (window.AudioContext ??
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext) as typeof AudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      // 800Hz <-> 400Hz を交互に（救急車風）
      let high = true;
      const swap = () => {
        if (!ctx) return;
        osc.frequency.setValueAtTime(high ? 400 : 800, ctx.currentTime);
        high = !high;
      };
      const intervalId = window.setInterval(swap, 500);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      audioCtxRef.current = ctx;
      oscRef.current = osc;
      setSirenOn(true);
      // 30秒で自動停止（聴覚保護）
      window.setTimeout(() => {
        window.clearInterval(intervalId);
        stopSiren();
      }, 30_000);
    } catch {
      /* not supported */
    }
  };

  const stopSiren = () => {
    try {
      oscRef.current?.stop();
      audioCtxRef.current?.close();
    } catch {
      /* already stopped */
    }
    oscRef.current = null;
    audioCtxRef.current = null;
    setSirenOn(false);
  };

  const recordLocation = async () => {
    setPosMsg("📍 現在地を取得中…");
    try {
      const pos = await getCurrentPosition();
      const note = `\n[${new Date().toLocaleString("ja-JP")}] SOSメモ: 緯度 ${pos.lat.toFixed(5)} 経度 ${pos.lng.toFixed(5)} (±${Math.round(pos.accuracy)}m)`;
      updateFamilyCard({
        medicalNotes: (state.familyCard.medicalNotes ?? "") + note,
      });
      setPosMsg("✅ 現在地を家族カードに保存しました");
    } catch (err) {
      const code = (
        err as GeolocationPositionError | (Error & { code?: number })
      ).code;
      setPosMsg(
        code === 1
          ? "❌ 位置情報が拒否されています"
          : "❌ 位置情報を取得できませんでした",
      );
    }
  };

  return (
    <Layout title="緊急時はここ" back="/">
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        いざというときの行動を、すぐ実行できる画面です。タップで電話発信・画面ライト・サイレンが動作します。
      </p>

      {/* 緊急電話 */}
      <section className="mt-4 space-y-2">
        {EMERGENCY_CONTACTS.filter((c) => c.variant === "danger").map((c) => (
          <a key={c.id} href={c.href} className="btn-sos bg-rose-600">
            <span className="text-2xl" aria-hidden>
              {c.emoji}
            </span>
            <span>{c.label}</span>
          </a>
        ))}
      </section>

      {/* 災害用伝言・SOSツール */}
      <section className="mt-4 space-y-2">
        <h2 className="text-lg-jp font-bold">📞 連絡・伝言</h2>
        {EMERGENCY_CONTACTS.filter((c) => c.variant === "warn").map((c) => (
          <a
            key={c.id}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="card flex items-center gap-3 transition active:scale-[0.99]"
          >
            <span className="text-2xl" aria-hidden>
              {c.emoji}
            </span>
            <div className="flex-1">
              <p className="text-base-jp font-bold leading-tight">{c.label}</p>
              <p className="text-xs-jp text-slate-700">{c.description}</p>
            </div>
            <span aria-hidden className="text-slate-400">
              →
            </span>
          </a>
        ))}
      </section>

      {/* SOS道具 */}
      <section className="mt-5 space-y-2">
        <h2 className="text-lg-jp font-bold">🛠 SOS 道具</h2>
        <button
          type="button"
          onClick={() => setFlashlight(true)}
          className="btn-sos bg-amber-500"
        >
          <span className="text-2xl" aria-hidden>
            🔦
          </span>
          <span>画面ライト（白画面）</span>
        </button>
        <button
          type="button"
          onClick={sirenOn ? stopSiren : startSiren}
          className={`btn-sos ${sirenOn ? "bg-slate-700" : "bg-orange-600"}`}
        >
          <span className="text-2xl" aria-hidden>
            {sirenOn ? "⏹" : "📢"}
          </span>
          <span>
            {sirenOn ? "サイレンを止める" : "サイレンを鳴らす（30秒）"}
          </span>
        </button>
        <button
          type="button"
          onClick={recordLocation}
          className="btn-sos bg-sonae-primary"
        >
          <span className="text-2xl" aria-hidden>
            📍
          </span>
          <span>現在地を家族カードに残す</span>
        </button>
        {posMsg && (
          <p
            role="status"
            aria-live="polite"
            className="text-center text-sm font-bold text-sonae-primary"
          >
            {posMsg}
          </p>
        )}
      </section>

      {/* 公式情報源 */}
      <section className="mt-6">
        <h2 className="mb-2 text-lg-jp font-bold">
          🌐 公式情報源（公式サイトに移動）
        </h2>
        <p className="mb-3 text-xs-jp text-slate-700">
          災害時はデマに注意。一次情報は <strong>公式サイト</strong>{" "}
          で必ず確認してください。
        </p>
        {INFO_CATEGORIES.map((cat) => (
          <div key={cat} className="mt-3">
            <p className="mb-1 text-xs-jp font-bold text-sonae-primary">
              {cat}
            </p>
            <ul className="space-y-1.5">
              {INFO_SOURCES.filter((s) => s.category === cat).map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card flex items-start gap-2 transition active:scale-[0.99]"
                  >
                    <span className="text-xl" aria-hidden>
                      {s.emoji}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-bold leading-tight">
                        {s.label}
                      </p>
                      <p className="text-xs-jp leading-relaxed text-slate-700">
                        {s.description}
                      </p>
                    </div>
                    <span aria-hidden className="text-slate-400">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* 画面ライト オーバーレイ */}
      {flashlight && (
        <div
          className="flashlight-overlay"
          role="dialog"
          aria-label="画面ライト"
          onClick={() => setFlashlight(false)}
        >
          <p className="text-base-jp font-bold text-slate-700">タップで戻る</p>
          <p className="mt-2 text-xs-jp text-slate-500">
            明るさは最大に設定してください
          </p>
        </div>
      )}
    </Layout>
  );
}
