#!/usr/bin/env bash
# scripts/deploy.sh
#
# そなえクエスト 1コマンドデプロイ（世界最高ワークフロー）
#
# やること（fail-fast で順次）:
#  1) preflight.sh で品質ゲート
#  2) main ブランチに変更があれば commit & push
#  3) gh-pages ブランチを git worktree で取り出し、dist の中身を置き換え
#  4) gh-pages に commit & push（GitHub Pages が自動配信）
#  5) 公開URL HTTP 200 検証 (最大30秒待機)
#  6) handoff/LOG.md にデプロイイベントを追記
#
# 前提:
#  - gh CLI 認証済み (gh auth status で OK のこと)
#  - workflow scope 不要 (gh-pages 直接 push 方式)
#  - main ブランチが既に origin に存在
#
# Usage:
#   bash scripts/deploy.sh [-m "<commit message>"]
#
# Exit: 0 = 公開URL 200 / 非0 = どこかで失敗（途中で abort、main は壊さない）

set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$(pwd)"
PUBLIC_URL="https://reskilling-marketing.github.io/sonae-quest/"
WORKTREE="/tmp/sq-gh-pages-deploy-$$"

MSG="${1:-Deploy: そなえクエスト ($(date +%Y-%m-%d-%H%M))}"
if [ "${1:-}" = "-m" ] && [ -n "${2:-}" ]; then MSG="$2"; fi

echo "🛡️  そなえクエスト Deploy"
echo "    URL: $PUBLIC_URL"
echo "    msg: $MSG"
echo ""

# ===== 0) 認証確認 =====
if ! gh auth status >/dev/null 2>&1; then
  echo "❌  gh CLI が未認証。 gh auth login を先に実行してください。"
  exit 1
fi

# ===== 1) preflight =====
echo "🚦 [1/6] Pre-flight 品質ゲート"
bash scripts/preflight.sh
echo ""

# ===== 2) main commit/push =====
echo "📝 [2/6] main ブランチの差分をコミット & push"
if git diff --quiet && git diff --cached --quiet; then
  echo "    変更なし（main へのコミットはスキップ）"
else
  git add -A
  git reset HEAD .github/workflows/deploy.yml 2>/dev/null || true  # workflow scope 制約のため除外
  if git diff --cached --quiet; then
    echo "    main へのコミット対象が結局なし（gh-pages のみ更新）"
  else
    git commit -m "$MSG

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>" >/dev/null
    git push >/dev/null
    echo "    ✅ main 更新済み"
  fi
fi
echo ""

# ===== 3) gh-pages worktree =====
echo "🌳 [3/6] gh-pages 用 worktree を作成"
trap 'cd "$ROOT"; git worktree remove --force "$WORKTREE" 2>/dev/null || true; rm -rf "$WORKTREE" 2>/dev/null || true' EXIT
git worktree add "$WORKTREE" gh-pages >/dev/null
echo "    ✅ $WORKTREE"
echo ""

# ===== 4) dist を inject して push =====
echo "📤 [4/6] dist を gh-pages に inject & push"
cd "$WORKTREE"
# .git だけ残して中身を全部消去
find . -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
cp -a "$ROOT/dist/." .
git add -A -f
if git diff --cached --quiet; then
  echo "    変更なし（gh-pages も既に最新）"
else
  git commit -m "Deploy: $MSG" >/dev/null
  git push >/dev/null
  echo "    ✅ gh-pages 更新済み"
fi
cd "$ROOT"
echo ""

# ===== 5) 公開URL 検証 =====
echo "🌐 [5/6] 公開URL 動作確認 (最大60秒待機)"
SUCCESS=0
for i in $(seq 1 12); do
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "$PUBLIC_URL" || echo "000")
  if [ "$HTTP_STATUS" = "200" ]; then
    # 最新版反映を確認するため index-XXX.js も叩く
    INDEX_JS=$(curl -s "$PUBLIC_URL" | grep -oE 'index-[A-Za-z0-9_-]+\.js' | head -1)
    if [ -n "$INDEX_JS" ]; then
      JS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "${PUBLIC_URL}assets/$INDEX_JS" || echo "000")
      if [ "$JS_STATUS" = "200" ]; then
        SUCCESS=1
        echo "    ✅ 公開URL HTTP 200 / index chunk: $INDEX_JS HTTP $JS_STATUS"
        break
      fi
    fi
  fi
  echo "    ... 待機 ($i/12) HTTP $HTTP_STATUS"
  sleep 5
done
if [ $SUCCESS -ne 1 ]; then
  echo "❌  60秒待っても公開URLが安定しない。GitHub Pages 側で再ビルド中の可能性。"
  echo "    手動確認: $PUBLIC_URL"
  exit 1
fi
echo ""

# ===== 6) handoff/LOG.md 更新 =====
LOG="/Users/imaiatsushi/チーム/handoff/LOG.md"
if [ -f "$LOG" ]; then
  echo "📒 [6/6] handoff/LOG.md にデプロイイベント追記"
  echo -e "$(date -u +%Y-%m-%dT%H:%M:%S+00:00)\tclaude\tDEPLOY\tT-011\tnpm run deploy 完了 / $MSG / $PUBLIC_URL" >> "$LOG"
  echo "    ✅ LOG 追記"
else
  echo "📒 [6/6] handoff/LOG.md なし（スキップ）"
fi
echo ""

echo "🎉 デプロイ完了"
echo ""
echo "    🌐 $PUBLIC_URL"
echo "    📅 $(date '+%Y-%m-%d %H:%M:%S')"
echo "    📝 $MSG"
echo ""
echo "次のステップ:"
echo "  - スマホで開いて A2HS 確認"
echo "  - 必要なら QR を再生成: bash scripts/gen-qr.sh $PUBLIC_URL"
