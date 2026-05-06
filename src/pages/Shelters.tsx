import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { ShareButton } from "@/components/ShareButton";
import {
  DEFAULT_CENTER,
  DISASTER_LABELS,
  SHELTERS,
  distanceKm,
} from "@/data/shelters";
import { getCurrentPosition, type GeoPosition } from "@/lib/geo";
import type { DisasterType, Shelter } from "@/types";

// 地図 (~40KB) は必要時のみロード
const MapView = lazy(() =>
  import("@/components/MapView").then((m) => ({ default: m.MapView })),
);

const DISASTER_ORDER: DisasterType[] = [
  "earthquake",
  "flood",
  "tsunami",
  "typhoon",
  "landslide",
  "fire",
  "inland-flood",
  "high-tide",
];

export function SheltersPage() {
  const [activeDisaster, setActiveDisaster] =
    useState<DisasterType>("earthquake");
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [geoStatus, setGeoStatus] = useState<
    "unknown" | "fetching" | "granted" | "denied" | "error"
  >("unknown");
  const [showMap, setShowMap] = useState(false);

  const center = position
    ? { lat: position.lat, lng: position.lng }
    : DEFAULT_CENTER;

  const filtered = useMemo(() => {
    return SHELTERS.filter((s) => s.supports.includes(activeDisaster))
      .map((s) => ({ ...s, distance: distanceKm(center, s) }))
      .sort((a, b) => a.distance - b.distance);
  }, [activeDisaster, center]);

  const handleGetLocation = async () => {
    setGeoStatus("fetching");
    try {
      const pos = await getCurrentPosition();
      setPosition(pos);
      setGeoStatus("granted");
      setShowMap(true);
    } catch (err) {
      const code = (
        err as GeolocationPositionError | (Error & { code?: number })
      ).code;
      setGeoStatus(code === 1 ? "denied" : "error");
    }
  };

  // 初回マウント時に地図を遅延表示（ファースト描画は軽く）
  useEffect(() => {
    const t = window.setTimeout(() => setShowMap(true), 250);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <Layout title="避難所" back="/">
      <div className="mt-2 -mx-4 overflow-x-auto px-4">
        <div className="flex gap-2">
          {DISASTER_ORDER.map((d) => {
            const meta = DISASTER_LABELS[d];
            const active = d === activeDisaster;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setActiveDisaster(d)}
                className={`shrink-0 rounded-full px-3 py-2 text-xs-jp font-bold transition ${
                  active
                    ? "bg-sonae-primary text-white shadow-soft"
                    : "bg-white text-slate-700"
                }`}
              >
                {meta.emoji} {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      <section className="card mt-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs-jp font-bold text-slate-700">現在位置</p>
            <p className="text-base-jp font-bold leading-tight">
              {position ? "位置取得済" : "未取得（梅田駅周辺を表示中）"}
            </p>
            {position && (
              <p className="text-xs-jp text-slate-600">
                緯度 {position.lat.toFixed(4)} / 経度 {position.lng.toFixed(4)}{" "}
                ±{Math.round(position.accuracy)}m
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleGetLocation}
            className="btn-primary px-4 py-2 text-sm"
            disabled={geoStatus === "fetching"}
          >
            {geoStatus === "fetching" ? "取得中…" : "📍 現在地から探す"}
          </button>
        </div>
        {geoStatus === "denied" && (
          <p className="mt-2 text-xs-jp text-rose-700">
            位置情報の許可が拒否されています。ブラウザ設定から許可してください。
          </p>
        )}
        {geoStatus === "error" && (
          <p className="mt-2 text-xs-jp text-rose-700">
            位置情報を取得できませんでした。
          </p>
        )}
      </section>

      <section className="mt-3">
        {showMap ? (
          <Suspense
            fallback={
              <div className="flex h-72 items-center justify-center rounded-card border border-teal-100 bg-slate-50 text-sm text-slate-500">
                地図を読み込み中…
              </div>
            }
          >
            <MapView
              center={center}
              shelters={filtered}
              myPosition={position}
            />
          </Suspense>
        ) : (
          <button
            type="button"
            onClick={() => setShowMap(true)}
            className="flex h-72 w-full items-center justify-center rounded-card border border-teal-100 bg-slate-50 text-sm font-bold text-sonae-primary"
          >
            🗺️ タップして地図を表示
          </button>
        )}
      </section>

      <section className="card mt-3 border border-amber-200 bg-amber-50">
        <p className="text-sm leading-relaxed text-amber-900">
          📡 <strong>通信断絶対策</strong>:
          詳細な地図タイルが読めない時のために、
          <a
            href="./offline-map.svg"
            target="_blank"
            rel="noopener"
            className="underline font-bold"
          >
            全国概略マップ (SVG)
          </a>
          をアプリと一緒に保存しています。正確な確認は通信復旧後に公式情報で照合してください。
        </p>
      </section>

      <section className="mt-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs-jp font-bold text-sonae-primary">
              {DISASTER_LABELS[activeDisaster].label}対応
            </p>
            <h2 className="text-lg-jp font-bold">近い順の避難先</h2>
          </div>
          <span className="chip">公式</span>
        </div>

        {filtered.length === 0 ? (
          <p className="card mt-2 text-center text-sm text-slate-600">
            このカテゴリで近隣に登録された避難所がありません。
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {filtered.slice(0, 12).map((s) => (
              <li key={s.id}>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${s.lat}&mlon=${s.lng}&zoom=17`}
                  target="_blank"
                  rel="noopener"
                  className="card flex items-start gap-3 transition active:scale-[0.99]"
                >
                  <span className="text-2xl" aria-hidden>
                    🏫
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="chip">{s.category}</span>
                      <span className="chip-warn">
                        📏 約{s.distance.toFixed(2)}km
                      </span>
                    </div>
                    <p className="mt-1 text-base-jp font-bold leading-tight">
                      {s.name}
                    </p>
                    <p className="text-xs-jp text-slate-700">{s.address}</p>
                    {s.notes && (
                      <p className="mt-1 text-xs-jp text-slate-600">
                        💡 {s.notes}
                      </p>
                    )}
                  </div>
                  <span aria-hidden className="text-slate-400">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-5">
        <ShareButton
          text={`そなえクエストで近所の避難所を確認しました。${DISASTER_LABELS[activeDisaster].label}のときの避難先が ${filtered.length} 件、近い順で見られます👇`}
          url={
            typeof window !== "undefined"
              ? window.location.origin + window.location.pathname
              : undefined
          }
          label="LINEで家族に教える"
        />
      </section>

      <p className="mt-4 text-center text-xs-jp text-slate-600">
        📍 表示は MVP サンプル（大阪市中心部
        30件）。正確な指定避難所は市区町村公式サイトで確認してください。
      </p>
    </Layout>
  );
}
