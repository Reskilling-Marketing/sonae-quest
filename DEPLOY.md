# DEPLOY — そなえクエスト デプロイガイド

> **更新は1コマンド：** `npm run deploy`
>
> 公開URL: https://reskilling-marketing.github.io/sonae-quest/

---

## ⚡ 1コマンドで更新（既に公開済の場合）

```bash
cd /Users/imaiatsushi/チーム/sonae-quest
npm run deploy
```

これだけで以下を全部やります：

| ステップ | 内容 |
|---|---|
| 1. preflight | TypeScript / build / PWA 成果物 / サイズ予算 / トラッキングタグ漏洩 / シークレット混入の **6項目品質ゲート** |
| 2. main | 変更があれば commit & push |
| 3. gh-pages worktree | `/tmp/sq-gh-pages-deploy-*` に取り出し |
| 4. dist 更新 | gh-pages の中身を最新 dist に置き換えて push |
| 5. URL 検証 | 60秒以内に `https://reskilling-marketing.github.io/sonae-quest/` が HTTP 200 + 最新 chunk を配信しているか確認 |
| 6. handoff/LOG | 自動でデプロイイベントを追記 |

**fail-fast**: どのステップでも失敗したら abort。main は壊れません。

---

## 🆕 初回公開（リポジトリ未作成）

```bash
cd /Users/imaiatsushi/チーム/sonae-quest

# 1. Git 初期化
git init && git add . && git commit -m "Initial release"

# 2. GitHub にリポジトリ作成 + push
gh repo create sonae-quest --public --source . --push

# 3. gh-pages ブランチを作って dist を置く
npm run build
git worktree add /tmp/sq-init gh-pages 2>/dev/null || git switch --orphan gh-pages
# (worktree なら) cd /tmp/sq-init && cp -a ../../dist/. .
git add -A -f && git commit -m "Initial deploy" && git push -u origin gh-pages

# 4. Pages 設定を gh-pages ブランチに
gh api -X POST repos/$(gh api user --jq .login)/sonae-quest/pages \
  -f 'source[branch]=gh-pages' -f 'source[path]=/'
```

---

## 🛠 個別コマンド

```bash
npm run preflight   # 品質ゲートだけ走らせる（push しない）
npm run build       # 本番ビルドだけ
npm run dev         # ローカル開発サーバー
npm run preview     # 本番ビルドをローカル確認
npm run qr <URL>    # QR コードSVG を public/qr.svg に生成
```

---

## 📦 dist のオフライン配布

```bash
cd /Users/imaiatsushi/チーム/sonae-quest
npm run build
mkdir -p _release
cd dist && zip -rq "../_release/sonae-quest-$(date +%Y%m%d).zip" .
# → _release/sonae-quest-YYYYMMDD.zip （USB / メール / 社内LAN 配布可）
```

`index.html` を任意フォルダで開けば動作（PWA キャッシュ機能は `file://` では動かないが、アプリ自体は動く）。

ローカル配信:
```bash
cd <解凍先> && python3 -m http.server 8080
# → http://localhost:8080/
```

---

## 🌐 別ホスティングへの切替

| ホスト | 設定 | 備考 |
|---|---|---|
| **GitHub Pages** | 既設定済（推奨） | `npm run deploy` で完結 |
| **Cloudflare Pages** | Build: `npm run build` / Output: `dist` / Node 20 | `gh-pages` ブランチではなく main 直 |
| **Vercel** | `npx vercel --prod` | 自動検出、Output `dist` |

---

## ⚠ トラブルシュート

| 症状 | 対策 |
|---|---|
| `preflight` が「サイズ予算超過」 | 直近の commit で重い依存を入れたか確認、不要なら revert |
| `gh-pages` ブランチが存在しないエラー | 「初回公開」手順 3 を実行 |
| 公開URLが反映されない | 1〜2分待つ。それでもダメなら `gh api repos/.../pages` で status: building を確認 |
| iOS で A2HS が普通のブラウザ風 | キャッシュクリア → 再追加 |
| 古い版がしつこく出る | DevTools → Application → Service Workers → Unregister |

---

## 🔁 GitHub Actions 自動化（任意）

`gh auth refresh -s workflow` を1回実行 → workflow scope 取得 → 以下の workflow を有効化：

```yaml
# .github/workflows/deploy.yml （workflow scope 取得後に push 可能）
name: Deploy to GitHub Pages
on: { push: { branches: [main] }, workflow_dispatch: }
permissions: { contents: read, pages: write, id-token: write }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run preflight
        env: { BASE_PATH: /sonae-quest/ }
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: '${{ steps.d.outputs.page_url }}' }
    steps:
      - id: d
        uses: actions/deploy-pages@v4
```

これで `git push` だけで自動デプロイ。
