# DEPLOY — そなえクエスト 即時公開ガイド

> CEO は **このページのコマンドをコピペ** するだけで公開できます。
> 推奨は **GitHub Pages**（コスト0 / Actions 設定済 / 90秒で公開）。

---

## A) GitHub Pages（推奨・3コマンド）

### 前提
- ローカルに `gh` (GitHub CLI) がインストール済（`brew install gh`）
- `gh auth login` 済

### 公開手順

```bash
cd /Users/imaiatsushi/チーム/sonae-quest

# 1. Git 初期化（初回のみ）
git init && git add . && git commit -m "Initial release: そなえクエスト MVP"

# 2. GitHub にリポジトリ作成 + push（パブリック）
gh repo create sonae-quest --public --source . --push

# 3. Pages 設定を有効化（Actions 経由）
gh api -X POST repos/imaiatsushi/sonae-quest/pages -f build_type=workflow
```

**所要時間**: 90秒〜2分（Actions のビルド完了待ち）

**公開URL**: `https://imaiatsushi.github.io/sonae-quest/`

### 後で更新したいとき
```bash
git add . && git commit -m "<変更内容>" && git push
# → 自動でビルドされ、最大2分で反映
```

---

## B) Cloudflare Pages（CDN速い・独自ドメイン無料SSL）

### Web UI
1. https://dash.cloudflare.com/ → Workers & Pages → Create → **Pages** → Connect to Git
2. Build command: `npm run build`
3. Output directory: `dist`
4. Node version: `20`
5. Save and Deploy

**公開URL**: `https://sonae-quest.pages.dev/`（自動生成）

### 独自ドメインを当てる
- Cloudflare ダッシュボードでドメイン追加 → ネームサーバ移管 → Pages の Custom Domain で紐付け

---

## C) Vercel（CLI 1コマンド）

```bash
cd /Users/imaiatsushi/チーム/sonae-quest
npm i -g vercel  # 初回のみ
vercel --prod    # 初回はプロジェクト名を聞かれる
```

**公開URL**: `https://sonae-quest.vercel.app/`

---

## D) USB / メール / 社内LAN 配布（オフライン）

```bash
# 既に同梱済み
ls /Users/imaiatsushi/チーム/sonae-quest/_release/
# → sonae-quest-mvp-YYYYMMDD.zip (約105KB)
```

zip を解凍して任意のフォルダに置き、`index.html` をブラウザで開けば動作します。
（Service Worker は `file://` プロトコルでは動かないため、PWA 機能（オフラインキャッシュ・更新通知）は無効化されますが、アプリ自体は動きます）

簡易ローカルサーバで配信したい場合:
```bash
cd <解凍先>
python3 -m http.server 8080
# → http://localhost:8080/
```

---

## 公開後にやること

### 1. マルシェ用 QR コード生成（任意）

```bash
cd /Users/imaiatsushi/チーム/sonae-quest
bash scripts/gen-qr.sh https://imaiatsushi.github.io/sonae-quest/
# → public/qr.svg が生成される（A4 ポスター・チラシに貼り付け可）
```

### 2. SNS 共有（テンプレ）

LINE / X / Facebook 用テキスト（コピペ可）:
```
5分でわが家の防災レベルがわかる無料PWAを作りました。
12問の診断+30の防災クエスト+5体のなかま。維持費0円・端末内保存。
👇
https://imaiatsushi.github.io/sonae-quest/
```

### 3. CEO チェックリスト（公開直後）

- [ ] スマホで開いて、ホーム画面に追加 → アプリのように起動できる
- [ ] 12問診断 → 結果画面で「今すぐ1つ」CTA が表示される
- [ ] LINE で家族 1 人に送ってみる
- [ ] 防災手帳をオフライン（機内モード）で開けるか確認

---

## トラブルシュート

| 症状 | 対策 |
|---|---|
| GH Pages で 404 | Settings → Pages → Source が "GitHub Actions" になっているか確認 |
| サブパスで CSS/JS が壊れる | `.github/workflows/deploy.yml` の `BASE_PATH` 設定を確認 |
| iOS で A2HS しても普通のブラウザ風 | 一度キャッシュクリア → 再アクセス → 再追加 |
| 旧版がしつこく出る | DevTools → Application → Service Workers → Unregister |
