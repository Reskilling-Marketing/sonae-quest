import type { CharacterDef } from "@/types";

export const CHARACTERS: CharacterDef[] = [
  {
    type: "yure",
    name: "ゆれまもり",
    emoji: "🦔",
    role: "地震対策",
    description:
      "家具固定や落下物チェックが得意なハリネズミ。揺れに強い家を一緒に作ろう。",
    color: "bg-amber-50 border-amber-300",
  },
  {
    type: "mizu",
    name: "みずまもり",
    emoji: "🐢",
    role: "水害・備蓄",
    description:
      "水・食料の備蓄や、雨・川の備えが得意なカメ。コツコツ積み上げよう。",
    color: "bg-sky-50 border-sky-300",
  },
  {
    type: "hikari",
    name: "ひかりまもり",
    emoji: "🦊",
    role: "停電対策",
    description: "懐中電灯やモバイル電源、停電時の暮らしを照らすキツネ。",
    color: "bg-yellow-50 border-yellow-300",
  },
  {
    type: "kizuna",
    name: "きずなまもり",
    emoji: "🐰",
    role: "家族連絡",
    description:
      "家族の連絡方法・集合場所を一緒に決めるウサギ。きずなを強くする。",
    color: "bg-pink-50 border-pink-300",
  },
  {
    type: "michi",
    name: "みちまもり",
    emoji: "🐕",
    role: "避難経路",
    description: "避難経路や避難所の下見が大好きな犬。歩いて確かめよう。",
    color: "bg-emerald-50 border-emerald-300",
  },
];

export const EXP_PER_LEVEL = 50;

export function levelOf(exp: number): number {
  return Math.max(1, Math.floor(exp / EXP_PER_LEVEL) + 1);
}

export function expToNextLevel(exp: number): number {
  const currentLevel = levelOf(exp);
  return currentLevel * EXP_PER_LEVEL - exp;
}
