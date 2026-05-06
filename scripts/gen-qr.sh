#!/usr/bin/env bash
# usage: bash scripts/gen-qr.sh <URL>
# 例: bash scripts/gen-qr.sh https://imaiatsushi.github.io/sonae-quest/
#
# - 公開先 URL を QR コード化して public/qr.svg に保存します
# - SVG なので拡大しても劣化なし。A4 ポスター・チラシ・名刺に貼り付け可
# - ネット必要 (npx で qrcode パッケージを取得します)

set -euo pipefail

URL="${1:-}"
if [ -z "$URL" ]; then
  echo "❌ URL が指定されていません"
  echo "usage: bash scripts/gen-qr.sh <URL>"
  exit 1
fi

OUT="public/qr.svg"
mkdir -p public

echo "🔄 QR コードを生成中: $URL"
npx --yes qrcode --type svg --error-correction-level H --output "$OUT" "$URL"

echo "✅ 生成完了: $OUT ($(wc -c < "$OUT" | tr -d ' ') bytes)"
echo ""
echo "📌 マルシェ用ポスター作成のヒント:"
echo "  - A4 縦 / 上半分: '5分でわが家の防災力がわかります🛡️'"
echo "  - A4 縦 / 下半分: QR コード（一辺 8cm 以上推奨）+ 'スマホでQRを読み取り'"
echo "  - 印刷は 300 DPI 以上で。SVG なのでサイズ自由"
