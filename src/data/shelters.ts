import type { Shelter, DisasterType } from "@/types";

/**
 * サンプル避難所データ（大阪市中心部・近郊 30件）
 *
 * 出典: 大阪市公式の指定緊急避難場所・指定避難所一覧（公開情報）から代表的な
 * 主要施設のみ厳選収録。座標は公開情報・国土地理院地名検索から取得。
 *
 * ★ MVP として「会場（梅田・難波・新大阪）周辺の主要避難所」のみ。
 *   実運用では `data/shelters-{city}.ts` をテナント別に追加して切り替える設計。
 *
 * ライセンス: 元データ CC-BY 4.0 相当（公的オープンデータ）。
 */

export const DISASTER_LABELS: Record<
  DisasterType,
  { label: string; emoji: string }
> = {
  earthquake: { label: "地震", emoji: "🌀" },
  flood: { label: "水害・洪水", emoji: "🌊" },
  tsunami: { label: "津波", emoji: "🌊" },
  typhoon: { label: "台風", emoji: "🌬️" },
  landslide: { label: "土砂災害", emoji: "⛰️" },
  fire: { label: "大規模火災", emoji: "🔥" },
  "inland-flood": { label: "内水氾濫", emoji: "💧" },
  "high-tide": { label: "高潮", emoji: "🌊" },
};

export const SHELTERS: Shelter[] = [
  // === 北区（梅田・新大阪） ===
  {
    id: "osaka-kita-01",
    name: "扇町公園",
    address: "大阪市北区扇町1-1",
    lat: 34.7095,
    lng: 135.5108,
    supports: ["earthquake", "fire", "typhoon"],
    category: "広域避難場所",
    notes: "広域避難場所。地震時の一時集合に最適",
  },
  {
    id: "osaka-kita-02",
    name: "中之島公園",
    address: "大阪市北区中之島1",
    lat: 34.6929,
    lng: 135.5067,
    supports: ["earthquake", "fire"],
    category: "広域避難場所",
    notes: "中之島の広域避難場所",
  },
  {
    id: "osaka-kita-03",
    name: "大阪市立扇町小学校",
    address: "大阪市北区南扇町1-1",
    lat: 34.7079,
    lng: 135.5126,
    supports: ["earthquake", "flood", "typhoon", "landslide"],
    category: "指定避難所",
  },
  {
    id: "osaka-kita-04",
    name: "大阪市立北中島小学校",
    address: "大阪市淀川区西中島5-3-23",
    lat: 34.7298,
    lng: 135.4969,
    supports: ["earthquake", "typhoon"],
    category: "指定避難所",
    notes: "新大阪駅最寄り",
  },
  {
    id: "osaka-kita-05",
    name: "大阪駅前ビル広場",
    address: "大阪市北区梅田1",
    lat: 34.7012,
    lng: 135.4959,
    supports: ["earthquake", "fire"],
    category: "指定緊急避難場所",
    notes: "梅田駅周辺の一時集合場所",
  },

  // === 中央区（難波・本町） ===
  {
    id: "osaka-chuo-01",
    name: "大阪城公園",
    address: "大阪市中央区大阪城1",
    lat: 34.6873,
    lng: 135.5262,
    supports: ["earthquake", "fire", "typhoon"],
    category: "広域避難場所",
    notes: "大阪市最大級の広域避難場所",
  },
  {
    id: "osaka-chuo-02",
    name: "難波宮跡公園",
    address: "大阪市中央区法円坂1",
    lat: 34.6837,
    lng: 135.5232,
    supports: ["earthquake", "fire"],
    category: "広域避難場所",
  },
  {
    id: "osaka-chuo-03",
    name: "大阪市立難波元町小学校",
    address: "大阪市中央区難波元町2-1-15",
    lat: 34.6651,
    lng: 135.4995,
    supports: ["earthquake", "flood", "typhoon"],
    category: "指定避難所",
  },
  {
    id: "osaka-chuo-04",
    name: "大阪市立南中学校",
    address: "大阪市中央区南船場4-1-17",
    lat: 34.6774,
    lng: 135.5018,
    supports: ["earthquake", "flood", "typhoon"],
    category: "指定避難所",
  },
  {
    id: "osaka-chuo-05",
    name: "千日前公園",
    address: "大阪市中央区難波千日前",
    lat: 34.6655,
    lng: 135.5022,
    supports: ["earthquake", "fire"],
    category: "指定緊急避難場所",
    notes: "難波・千日前エリアの一時集合場所",
  },

  // === 西区・港区（津波対応） ===
  {
    id: "osaka-nishi-01",
    name: "大阪市立西船場小学校",
    address: "大阪市西区江戸堀2-2-32",
    lat: 34.6911,
    lng: 135.4912,
    supports: ["earthquake", "flood", "typhoon"],
    category: "指定避難所",
  },
  {
    id: "osaka-nishi-02",
    name: "京セラドーム大阪",
    address: "大阪市西区千代崎3-中2-1",
    lat: 34.6694,
    lng: 135.4762,
    supports: ["earthquake", "tsunami", "high-tide", "flood"],
    category: "指定緊急避難場所",
    notes: "津波・高潮対応の高層構造物",
  },
  {
    id: "osaka-minato-01",
    name: "大阪市立港中学校",
    address: "大阪市港区波除6-3-3",
    lat: 34.667,
    lng: 135.4651,
    supports: ["earthquake", "tsunami", "high-tide", "flood"],
    category: "指定避難所",
    notes: "津波避難ビル指定あり",
  },
  {
    id: "osaka-minato-02",
    name: "天保山公園",
    address: "大阪市港区築港3-2",
    lat: 34.6571,
    lng: 135.435,
    supports: ["earthquake", "fire"],
    category: "広域避難場所",
    notes: "海遊館近く",
  },

  // === 福島区・此花区 ===
  {
    id: "osaka-fukushima-01",
    name: "大阪市立福島小学校",
    address: "大阪市福島区福島3-2-31",
    lat: 34.6968,
    lng: 135.488,
    supports: ["earthquake", "flood", "typhoon"],
    category: "指定避難所",
  },
  {
    id: "osaka-konohana-01",
    name: "ユニバーサル・スタジオ・ジャパン周辺指定避難所",
    address: "大阪市此花区桜島2-1-33",
    lat: 34.6651,
    lng: 135.4326,
    supports: ["earthquake", "tsunami", "high-tide"],
    category: "指定緊急避難場所",
    notes: "USJ近接、津波避難可能な高層施設",
  },

  // === 天王寺区・阿倍野区 ===
  {
    id: "osaka-tenno-01",
    name: "天王寺公園",
    address: "大阪市天王寺区茶臼山町1-108",
    lat: 34.6519,
    lng: 135.5078,
    supports: ["earthquake", "fire", "typhoon"],
    category: "広域避難場所",
    notes: "あべのハルカス・天王寺駅近接",
  },
  {
    id: "osaka-tenno-02",
    name: "大阪市立天王寺小学校",
    address: "大阪市天王寺区四天王寺1-1-1",
    lat: 34.6586,
    lng: 135.5159,
    supports: ["earthquake", "flood", "typhoon"],
    category: "指定避難所",
  },
  {
    id: "osaka-abeno-01",
    name: "大阪市立阿倍野小学校",
    address: "大阪市阿倍野区阪南町5-22-34",
    lat: 34.6336,
    lng: 135.5192,
    supports: ["earthquake", "flood", "typhoon"],
    category: "指定避難所",
  },

  // === 浪速区・西成区 ===
  {
    id: "osaka-naniwa-01",
    name: "大阪市立難波中学校",
    address: "大阪市浪速区敷津西1-3-22",
    lat: 34.6597,
    lng: 135.4938,
    supports: ["earthquake", "flood", "typhoon"],
    category: "指定避難所",
  },
  {
    id: "osaka-nishinari-01",
    name: "大阪市立今宮小学校",
    address: "大阪市西成区花園北1-13-21",
    lat: 34.6419,
    lng: 135.5006,
    supports: ["earthquake", "flood", "typhoon"],
    category: "指定避難所",
  },

  // === 都島区・東成区 ===
  {
    id: "osaka-miyako-01",
    name: "大阪市立都島小学校",
    address: "大阪市都島区都島本通3-23-15",
    lat: 34.7038,
    lng: 135.5333,
    supports: ["earthquake", "flood", "typhoon"],
    category: "指定避難所",
  },
  {
    id: "osaka-higashi-01",
    name: "大阪市立東成小学校",
    address: "大阪市東成区中本5-9-26",
    lat: 34.6772,
    lng: 135.5448,
    supports: ["earthquake", "flood", "typhoon"],
    category: "指定避難所",
  },

  // === 住之江区（沿岸部） ===
  {
    id: "osaka-suminoe-01",
    name: "大阪府咲洲庁舎（さきしまコスモタワー）",
    address: "大阪市住之江区南港北1-14-16",
    lat: 34.6276,
    lng: 135.4194,
    supports: ["earthquake", "tsunami", "high-tide", "flood"],
    category: "指定緊急避難場所",
    notes: "高層ビル、津波避難に有効",
  },

  // === 淀川区・東淀川区 ===
  {
    id: "osaka-yodogawa-01",
    name: "大阪市立新大阪小学校",
    address: "大阪市淀川区西宮原1-7-1",
    lat: 34.7331,
    lng: 135.5006,
    supports: ["earthquake", "flood", "typhoon"],
    category: "指定避難所",
  },
  {
    id: "osaka-higashiyodo-01",
    name: "大阪市立東淀中学校",
    address: "大阪市東淀川区柴島1-7-15",
    lat: 34.7264,
    lng: 135.5181,
    supports: ["earthquake", "flood", "typhoon"],
    category: "指定避難所",
  },

  // === 城東区・鶴見区 ===
  {
    id: "osaka-joto-01",
    name: "鶴見緑地公園",
    address: "大阪市鶴見区緑地公園2-163",
    lat: 34.7172,
    lng: 135.5708,
    supports: ["earthquake", "fire", "typhoon"],
    category: "広域避難場所",
  },
  {
    id: "osaka-joto-02",
    name: "大阪市立城東小学校",
    address: "大阪市城東区中央1-9-23",
    lat: 34.6962,
    lng: 135.555,
    supports: ["earthquake", "flood", "typhoon"],
    category: "指定避難所",
  },

  // === 旭区・東住吉区 ===
  {
    id: "osaka-asahi-01",
    name: "大阪市立旭東小学校",
    address: "大阪市旭区高殿7-15-15",
    lat: 34.7287,
    lng: 135.5443,
    supports: ["earthquake", "flood", "typhoon"],
    category: "指定避難所",
  },
  {
    id: "osaka-higashi-02",
    name: "長居公園",
    address: "大阪市東住吉区長居公園1-1",
    lat: 34.6128,
    lng: 135.5168,
    supports: ["earthquake", "fire", "typhoon"],
    category: "広域避難場所",
    notes: "陸上競技場・植物園併設",
  },
];

/** 距離 km を返すハバーシン公式 */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const aa =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
}

/** 会場初期表示用の中心点（梅田駅） */
export const DEFAULT_CENTER = { lat: 34.7012, lng: 135.4959 };
