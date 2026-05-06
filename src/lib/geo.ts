/**
 * 現在地取得 + Leaflet 動的ローダ
 *
 * - Geolocation は HTTPS / localhost でのみ動作
 * - Leaflet は ~40KB なので route 単位で動的 import
 */

export type GeoPermission = "unknown" | "granted" | "denied" | "prompt";

export interface GeoPosition {
  lat: number;
  lng: number;
  accuracy: number;
  updatedAt: string;
}

export async function getGeoPermission(): Promise<GeoPermission> {
  if (typeof navigator === "undefined" || !("permissions" in navigator))
    return "unknown";
  try {
    const status = await navigator.permissions.query({
      name: "geolocation" as PermissionName,
    });
    return status.state as GeoPermission;
  } catch {
    return "unknown";
  }
}

export function getCurrentPosition(timeoutMs = 8000): Promise<GeoPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation API がこのブラウザで使えません"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          updatedAt: new Date().toISOString(),
        });
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 60_000 },
    );
  });
}
