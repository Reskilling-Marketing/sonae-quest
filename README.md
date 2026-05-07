# そなえクエスト 🛡️

> **平常時に家族・子ども・地域・職場の防災行動が自然に増える PWA**
> 災害速報を見るアプリではなく、防災 *行動* を増やすアプリ。

- 維持費は **限りなく0円**（独自バックエンド・DB・有料API・独自プッシュ通知 すべて不使用）
- 個人情報はサーバーに送信せず **端末内 LocalStorage** のみ
- スマホファースト / オフライン対応 / アクセシビリティ配慮

---

## ✨ 主な機能

| # | 画面 | できること |
|---|---|---|
| 1 | **ホーム** | 今日のクエスト・防災レベル・なかまの成長・次の3アクション・LINE共有 |
| 2 | **防災力診断** | 12問・3択。SCORE 22+→S, 18+→A, 14+→B, 9+→C, 4+→D, 0-3→E |
| 3 | **クエスト一覧** | 30個。8カテゴリ × 難易度3段 × 所要時間別。完了で経験値 |
| 4 | **なかまの成長** | 5体のキャラ（ゆれ／みず／ひかり／きずな／みち）EXP・Lv |
| 5 | **家族カード** | 集合場所/連絡先/避難所/薬/ペット/伝言/連絡ルール (LocalStorage) |
| 6 | **防災手帳** | 9記事、オフラインで読める。地震・津波・水害・停電・避難所など |
| 7 | **共有** | 各画面に LINE 共有ボタン。Web Share API 優先、フォールバックでクリップボード |

---

## 🧱 技術スタック

| レイヤー | 採用 | 理由 |
|---|---|---|
| ビルド | **Vite 5** | 軽量・速い・静的成果物に最適 |
| UI | **React 18 + TypeScript** | 学習コスト低・採用者多い |
| ルーティング | **React Router v6 (HashRouter)** | サブパス配置・GitHub Pages でも動作 |
| スタイル | **Tailwind CSS v3** | 子ども・高齢者にも読める大きめタイポを宣言的に |
| PWA | **vite-plugin-pwa (Workbox)** | manifest+SW 自動生成・オフライン対応 |
| 永続化 | **LocalStorage** | ログイン不要・サーバーフリー |
| データ | **TS モジュール (静的)** | DB 不要・編集者が PR で増やせる |

依存パッケージは最小限。総バンドル **約 73KB (gzip)**。

---

## 🗂️ ディレクトリ構成

```
sonae-quest/
├── public/                      # PWA アイコン (SVG)
│   ├── icon-192.svg / icon-512.svg / favicon.svg
├── src/
│   ├── main.tsx                 # エントリ
│   ├── App.tsx                  # ルーティング
│   ├── index.css                # Tailwind + ベース
│   ├── types/index.ts           # 全型定義
│   ├── data/                    # ★ コンテンツはここを編集
│   │   ├── characters.ts        # 5体のなかま
│   │   ├── diagnosis.ts         # 12問・スコアリング・レベル定義
│   │   ├── quests.ts            # 30クエスト
│   │   └── handbook.ts          # 9記事の防災手帳
│   ├── lib/
│   │   ├── storage.ts           # LocalStorage I/O
│   │   └── share.ts             # Web Share API + LINE
│   ├── hooks/useApp.tsx         # AppContext (state集約)
│   ├── components/              # Layout / BottomNav / *Card / Share
│   └── pages/                   # 7画面
├── index.html
├── vite.config.ts               # PWA 設定
├── tailwind.config.js
└── package.json
```

---

## 🧮 データ構造（編集者向け）

### Quest (`src/data/quests.ts`)

```ts
{
  id: 'quest-water-3days',         // 一意 (LocalStorage キーにもなる)
  title: '家族3日分の水を数える',
  category: '備蓄する',             // 8 カテゴリのいずれか
  targetAge: '全員',                // '全員' | '子ども' | '親' | '高齢者'
  durationMinutes: 5,              // 所要分数（短いほどホームに出やすい）
  difficulty: 1,                   // 1=やさしい / 2=ふつう / 3=しっかり
  description: '今ある水を…',
  steps: ['手順1', '手順2'],
  characterGrowthType: 'mizu',     // どの仲間が経験値を得るか
  experience: 10                   // 完了で得る EXP
}
```

> **クエストを増やす:** `src/data/quests.ts` の配列に push するだけ。コードの修正は不要。

### DiagnosisQuestion (`src/data/diagnosis.ts`)

12問固定。`recommendedQuestIds` に弱点時に推薦するクエストを書く。
スコア閾値（S/A/B/C/D/E）の境界も同ファイルの `determineLevel` で調整可。

### Character (`src/data/characters.ts`)

5体の名前・絵文字・色テーマ。EXP_PER_LEVEL = 50。

### Handbook (`src/data/handbook.ts`)

9記事。各記事は `body: { heading, lines: string[] }[]` 構造。
1記事追加するだけで、自動的に `/handbook` 一覧と `/handbook/:slug` 詳細に出る。

---

## 🏃 ローカル開発

```bash
cd sonae-quest
npm install
npm run dev          # http://localhost:5173 (デフォルト)
npm run build        # dist/ に静的ファイル生成
npm run preview      # 本番ビルドをローカル確認
npm run lint         # tsc --noEmit (型チェックのみ)
npm run preflight    # デプロイ前6項目品質ゲート
npm run deploy       # 1コマンドで GH Pages へ更新
npm run qr <URL>     # QR コードSVG を public/qr.svg に生成
```

---

## 🚀 デプロイ — `npm run deploy` 一発

```bash
cd sonae-quest
npm run deploy
```

これだけで以下を全部やります（fail-fast）：
1. **Pre-flight** — TypeScript / build / PWA 成果物 / サイズ予算 / トラッキング漏洩 / シークレット混入
2. **main 同期** — 差分があれば commit & push
3. **gh-pages 更新** — worktree で取り出し → dist 入れ替え → push
4. **公開URL検証** — HTTP 200 + 最新 chunk が配信されているか確認
5. **handoff/LOG 追記** — デプロイイベントを自動記録

詳細・初回公開・他ホスト切替・トラブルシュートは [DEPLOY.md](DEPLOY.md) を参照。

---

## 📱 PWA としてインストール

公開後、スマホブラウザでサイトを開く →
- iOS Safari: 共有 → 「ホーム画面に追加」
- Android Chrome: メニュー → 「アプリをインストール」

ホーム画面に **🛡️ そなえクエスト** が追加され、オフラインでも起動できます。

---

## 🎪 防災マルシェなど **イベント会場での QR 導線**

### 推奨フロー（来場者が迷わない順番）

1. **A4 縦のポスター** に大きな QR コードと一行コピー
   - 例:「**📱 QR で5分の防災診断。家族でできる行動が3つわかります。**」
2. QR の遷移先は **本番URL のトップ** （例 `https://sonae.example.com/`）
   - ハッシュルーティングなので、QR が壊れても `/#/diagnosis` で診断直結も可能
3. 会場でスマホをかざす → ブラウザで開く → 即「診断を始める」CTA が見える
4. 診断結果画面で **LINE 共有ボタン** が出るので、そのまま家族に転送

### QR コードの作り方（無料）

- macOS / iOS: **ショートカット.app** > 「QRコード生成」
- Web: `https://api.qrserver.com/v1/create-qr-code/?data=<URL>&size=400x400` に URL を入れる（無料・登録不要）
- 印刷時は **300 DPI 以上**、最小一辺 3cm 以上で配置

### ブース運営のコツ

- ポスターと同じ QR を **配布チラシ・名刺・LINE 公式アカウントの友だち追加導線** にも貼る
- ブースのタブレットには事前にトップを開きっぱなしにしておくと **「触ってみてください」体験**ができる
- 「家族カード」を **印刷してお渡し**するなら、入力 → ブラウザ印刷（A4 縦）→ ハサミ二つ折り

---

## 🛣️ 拡張案（Phase 2 以降）

| 優先 | 機能 | 0円維持の可否 | 備考 |
|---|---|---|---|
| ★★★ | クエストの **完了通知 (ローカル通知)** | 0円 | iOS PWA はサポート薄い、Android はOK |
| ★★★ | 学校・自治体テンプレ ( `data/quests.ts` の差し替え) | 0円 | テナント別に静的サイトを別ホスト |
| ★★ | **多言語化** (i18n: 日本語+英語+やさしい日本語) | 0円 | JSON 辞書差し替え |
| ★★ | **防災マルシェモード** (会場限定 QR で診断ループ) | 0円 | URL パラメータ判定 |
| ★★ | **企業向けオンプレ配布** (USB/社内 LAN) | 0円 | 静的なので zip 配布可能 |
| ★ | **SNS シェア用 OG 画像** 自動生成 | 0円 | satori (静的生成) |
| ★ | **キャラの SVG イラスト化** | 0円 | 絵文字 → 自前 SVG |
| ★ | **音声読み上げ (Web Speech API)** | 0円 | 高齢者向け / 視覚障害対応 |
| △ | **家族間データ同期** | 月数百円〜 | Cloudflare D1 / Supabase free |
| △ | **GPT による診断アドバイス** | 従量課金 | プレミアム機能化 |
| △ | **位置情報×ハザードマップ統合** | API次第 | 国土地理院は無料 |

---

## 🧪 品質チェックリスト

- [x] 5分以内に診断が完了する（12問×平均15秒）
- [x] 10分以内に家族で1つ行動できる（5分以下クエストが豊富）
- [x] 初回ユーザーが迷わない（CTA 1画面1行動・Bottom Nav 5項目）
- [x] スマホで快適（375×812 検証済み）
- [x] バンドルサイズ 73KB gzip
- [x] LocalStorage完結 / 個人情報サーバー送信ゼロ
- [x] オフラインで防災手帳が読める（Service Worker キャッシュ）
- [x] アクセシビリティ: focus-visible, aria-label, セマンティックHTML
- [x] 子ども/高齢者: 大きい文字 (base 1.05rem)、色だけに依存しないチップ＋アイコン

---

## 🔐 プライバシー設計

- **送信ゼロ**: ユーザー入力（家族カード・診断結果・進捗）は LocalStorage のみ
- **トラッキングなし**: GA・解析タグなし。導入する場合も同意UIを別途実装してください
- **共有は明示**: LINE / Web Share は **ユーザー操作のみ** で起動

---

## 📄 ライセンス & クレジット

- 本コードは MIT 想定（社内利用は自由）
- キャラクターは絵文字（Apple/Google/Twemoji 等のフォントに依存）
- 防災情報は内閣府・気象庁・各自治体公開情報を参考に作成。最新情報は必ず公式を確認

---

## 🙋 改善・コンテンツ追加の窓口

- クエスト追加 → `src/data/quests.ts`
- 手帳記事追加 → `src/data/handbook.ts`
- 文言・色変更 → `tailwind.config.js` & `src/index.css`

PR / Issue は気軽に。
