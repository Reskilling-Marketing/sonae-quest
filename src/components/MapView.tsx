import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Shelter } from "@/types";

interface MapViewProps {
  center: { lat: number; lng: number };
  shelters: Shelter[];
  onSelect?: (s: Shelter) => void;
  myPosition?: { lat: number; lng: number } | null;
}

/**
 * Leaflet 地図ビュー
 *  - タイル: OpenStreetMap (無料、商用OK、Attribution 必須)
 *  - シェルターをマーカー表示、クリックで onSelect
 *  - 現在地は青円で表示
 *  - SSR には対応しない (Suspense + lazy で route 単位 import するため)
 */
export function MapView({
  center,
  shelters,
  onSelect,
  myPosition,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Layer[]>([]);
  const myMarkerRef = useRef<L.Layer | null>(null);

  // 初期化（マウント時に1回）
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [center.lat, center.lng],
      zoom: 14,
      zoomControl: true,
      attributionControl: true,
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // center が変わったら地図を再センタリング
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setView([center.lat, center.lng], mapRef.current.getZoom());
  }, [center.lat, center.lng]);

  // shelter マーカー更新
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // 既存マーカー除去
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    shelters.forEach((s) => {
      const icon = L.divIcon({
        html: `<div style="background:#0f766e;color:#fff;border-radius:9999px;padding:4px 8px;font-size:11px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,0.25);white-space:nowrap;">🏫 ${s.name.slice(0, 8)}</div>`,
        className: "sq-shelter-marker",
        iconSize: [120, 24],
        iconAnchor: [60, 12],
      });
      const m = L.marker([s.lat, s.lng], { icon }).addTo(map);
      m.on("click", () => onSelect?.(s));
      markersRef.current.push(m);
    });
  }, [shelters, onSelect]);

  // 現在地マーカー
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (myMarkerRef.current) {
      myMarkerRef.current.remove();
      myMarkerRef.current = null;
    }
    if (myPosition) {
      const circle = L.circleMarker([myPosition.lat, myPosition.lng], {
        radius: 10,
        color: "#1d4ed8",
        fillColor: "#3b82f6",
        fillOpacity: 0.7,
        weight: 3,
      }).addTo(map);
      myMarkerRef.current = circle;
    }
  }, [myPosition?.lat, myPosition?.lng]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={containerRef}
      className="h-72 w-full overflow-hidden rounded-card border border-teal-200 bg-slate-100"
      style={{ minHeight: "288px" }}
      role="application"
      aria-label="避難所マップ"
    />
  );
}

export default MapView;
