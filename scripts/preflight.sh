#!/usr/bin/env bash
# scripts/preflight.sh
#
# デプロイ前品質ゲート（世界最高ワークフロー — fail-fast）
#  1) TypeScript strict 検査
#  2) 本番ビルド
#  3) PWA 必須ファイル検証 (sw.js, manifest, icon)
#  4) gzip サイズ予算チェック (初期JS 80KB / MapView 60KB)
#  5) 外部ネットワーク参照の漏洩チェック (analytics/tracker)
#  6) シークレット混入チェック (gitleaks 風)
#
# Usage: bash scripts/preflight.sh
# Exit: 0 = OK, 非0 = 何か失敗

set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$(pwd)"

echo "🛡️  そなえクエスト Pre-flight Quality Gate"
echo "    cwd: $ROOT"
echo ""

# ===== 1) TypeScript strict =====
echo "🔍 [1/6] TypeScript strict 検査..."
npx tsc -p tsconfig.json --noEmit
echo "✅  型エラーなし"
echo ""

# ===== 2) Build =====
echo "🏗️  [2/6] 本番ビルド..."
npm run build > /tmp/sq-build.log 2>&1
echo "✅  ビルド完了"
echo ""

# ===== 3) PWA 必須ファイル =====
echo "📡 [3/6] PWA 成果物検証..."
REQUIRED_FILES=(
  "dist/index.html"
  "dist/sw.js"
  "dist/manifest.webmanifest"
  "dist/icon-192.svg"
  "dist/icon-512.svg"
  "dist/favicon.svg"
  "dist/og-image.svg"
  "dist/404.html"
  "dist/robots.txt"
  "dist/.nojekyll"
  "dist/offline-map.svg"
)
MISSING=0
for f in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$f" ]; then
    echo "❌  missing: $f"
    MISSING=$((MISSING + 1))
  fi
done
if [ $MISSING -gt 0 ]; then
  echo "❌  PWA 必須ファイル $MISSING 件 不足"
  exit 1
fi
echo "✅  PWA 成果物すべて揃い"
echo ""

# ===== 4) gzip サイズ予算 =====
echo "📦 [4/6] gzip サイズ予算チェック..."
INDEX_JS=$(ls -1 dist/assets/index-*.js 2>/dev/null | head -1)
MAP_JS=$(ls -1 dist/assets/MapView-*.js 2>/dev/null | head -1)
if [ -z "$INDEX_JS" ]; then
  echo "❌  initial JS chunk が見つかりません"
  exit 1
fi
INDEX_GZ=$(gzip -c -9 "$INDEX_JS" | wc -c | tr -d ' ')
MAP_GZ=0
if [ -n "$MAP_JS" ]; then
  MAP_GZ=$(gzip -c -9 "$MAP_JS" | wc -c | tr -d ' ')
fi

# 予算: initial 80KB / MapView 60KB (gzip)
INDEX_BUDGET=$((80 * 1024))
MAP_BUDGET=$((60 * 1024))

printf "    initial JS: %d B (gzip)  / 予算 %d B\n" "$INDEX_GZ" "$INDEX_BUDGET"
printf "    MapView JS: %d B (gzip)  / 予算 %d B\n" "$MAP_GZ" "$MAP_BUDGET"

if [ "$INDEX_GZ" -gt "$INDEX_BUDGET" ]; then
  echo "❌  initial JS が予算超過（QR来訪初期表示が重くなる）"
  exit 1
fi
if [ "$MAP_GZ" -gt "$MAP_BUDGET" ]; then
  echo "❌  MapView JS が予算超過"
  exit 1
fi
echo "✅  サイズ予算内"
echo ""

# ===== 5) トラッキング/解析タグの漏洩 =====
echo "🔒 [5/6] 解析タグ・トラッキングの漏洩チェック..."
LEAK=0
for pat in "google-analytics" "googletagmanager" "gtag(" "fbq(" "analytics.js" "sentry-cdn"; do
  if grep -lq "$pat" dist/assets/*.js 2>/dev/null; then
    echo "❌  漏洩: $pat"
    LEAK=$((LEAK + 1))
  fi
done
if [ $LEAK -gt 0 ]; then
  echo "❌  トラッキングタグが混入しています（プライバシー方針違反）"
  exit 1
fi
echo "✅  解析タグなし（プライバシー方針順守）"
echo ""

# ===== 6) シークレット混入 (簡易) =====
echo "🔐 [6/6] シークレット混入チェック..."
SECRET_LEAK=0
for pat in "sk_live_" "sk_test_" "AKIA[A-Z0-9]\{16\}" "github_pat_" "ghp_[A-Za-z0-9]\{36\}" "AIza[0-9A-Za-z_-]\{35\}"; do
  if grep -REq "$pat" dist/ 2>/dev/null; then
    echo "❌  シークレットらしき文字列: $pat"
    SECRET_LEAK=$((SECRET_LEAK + 1))
  fi
done
if [ $SECRET_LEAK -gt 0 ]; then
  echo "❌  シークレット混入の可能性あり"
  exit 1
fi
echo "✅  シークレット混入なし"
echo ""

# ===== サマリー =====
DIST_TOTAL=$(du -sh dist | cut -f1)
echo "🎉 Pre-flight ALL PASS"
echo ""
echo "    📦 dist サイズ: $DIST_TOTAL"
echo "    🗜️  initial gzip: $((INDEX_GZ / 1024)) KB"
echo "    🗺️  MapView gzip: $((MAP_GZ / 1024)) KB"
echo "    📡 PWA 成果物: 揃い"
echo "    🔒 プライバシー: トラッキング 0 / シークレット 0"
echo ""
echo "次は: bash scripts/deploy.sh で公開"
