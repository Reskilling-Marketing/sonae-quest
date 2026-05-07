import { jsPDF } from "jspdf";
import type { AppState } from "@/types";
import { LEVEL_DESCRIPTIONS } from "@/data/diagnosis";
import { STOCK_ITEMS } from "@/data/stock";
import { QUESTS } from "@/data/quests";

/**
 * 「わが家の防災カード」PDF 生成
 *
 * - jsPDF で A4 縦に1枚、家族会議や冷蔵庫貼り出し用
 * - フォント: 標準フォント (helvetica) のみ → 日本語は内蔵不可
 *   そのため和文文字列はラスタライズ済みの SVG を貼るか、ベース64で外部フォント注入する必要がある
 *   今回は「画面そのまま print」にするため、`window.print()` 経由のリッチ印刷を主、PDF は要約版とする
 *
 * → 当ユーティリティは **A4 1枚の英数字+簡易レイアウト** のみ。
 *   日本語完全表示は印刷ダイアログ (window.print) で代替。
 */

export interface PDFOptions {
  state: AppState;
  familySize: number;
}

export function generateFamilyPDF({ state, familySize }: PDFOptions): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  // ===== ヘッダー (英数字のみで描画して文字化け回避) =====
  doc.setFillColor(15, 118, 110); // teal-700
  doc.rect(0, 0, 210, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Sonae Quest - Family Disaster Card", 14, 18);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleDateString("en-US")}`, 14, 25);

  let y = 42;
  doc.setTextColor(31, 41, 55); // slate-800

  // ===== 防災レベル (Readiness Level) =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Readiness Level", 14, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  if (state.diagnosis) {
    const meta = LEVEL_DESCRIPTIONS[state.diagnosis.level];
    doc.text(
      `Level: ${state.diagnosis.level}  /  Score: ${state.diagnosis.score} / ${state.diagnosis.maxScore}`,
      14,
      y,
    );
    y += 6;
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`(${meta.label})`, 14, y);
    y += 8;
    doc.setTextColor(31, 41, 55);
  } else {
    doc.text("Diagnosis not yet completed.", 14, y);
    y += 8;
  }

  // ===== Quest progress =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Quest Progress", 14, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(
    `Completed: ${state.completedQuestIds.length} / ${QUESTS.length}`,
    14,
    y,
  );
  y += 8;

  // ===== Stock coverage =====
  let stockHave = 0;
  let stockPartial = 0;
  STOCK_ITEMS.forEach((it) => {
    const s = state.stockChecks[it.id]?.state ?? "none";
    if (s === "have") stockHave += 1;
    else if (s === "partial") stockPartial += 1;
  });
  const stockScore = Math.round(
    ((stockHave + stockPartial * 0.5) / STOCK_ITEMS.length) * 100,
  );
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Stock Coverage", 14, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(
    `Family size: ${familySize}  /  Coverage: ${stockScore}%  (have ${stockHave} / partial ${stockPartial} / total ${STOCK_ITEMS.length})`,
    14,
    y,
  );
  y += 10;

  // ===== Family card =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Family Card", 14, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const fields: { label: string; value: string }[] = [
    { label: "Meeting Place", value: state.familyCard.meetingPlace },
    { label: "Emergency Contacts", value: state.familyCard.emergencyContacts },
    { label: "Shelter", value: state.familyCard.shelter },
    { label: "Go Bag Location", value: state.familyCard.goBagLocation },
    { label: "Medical Notes", value: state.familyCard.medicalNotes },
    { label: "Pet Info", value: state.familyCard.petInfo },
    { label: "Message to Child", value: state.familyCard.messageToChild },
    { label: "Contact Rule", value: state.familyCard.contactRule },
  ];
  fields.forEach((f) => {
    if (!f.value) return;
    doc.setFont("helvetica", "bold");
    doc.text(`${f.label}:`, 14, y);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(f.value || "-", 130);
    doc.text(lines, 60, y);
    y += Math.max(6, lines.length * 5);
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  // ===== Footer =====
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(
    "* Note: For full Japanese text, use the in-app print feature (More -> Print).",
    14,
    282,
  );
  doc.text(
    "Source: Sonae Quest (https://reskilling-marketing.github.io/sonae-quest/)",
    14,
    287,
  );

  return doc;
}

export function downloadFamilyPDF(opts: PDFOptions): void {
  const doc = generateFamilyPDF(opts);
  const date = new Date().toISOString().slice(0, 10);
  doc.save(`sonae-quest-family-card-${date}.pdf`);
}
