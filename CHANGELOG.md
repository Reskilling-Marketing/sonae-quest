# 変更履歴 — そなえクエスト

このファイルは [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に従います。
バージョニングは [SemVer](https://semver.org/lang/ja/) です。

## [Unreleased]

### Phase 2 候補（[knowledge/sonae-quest-phase2-backlog-v1.md](../knowledge/sonae-quest-phase2-backlog-v1.md) 参照）

---

## [0.4.0] - 2026-05-08

### Added — フリーミアム / Pro 防災キット予告

CEO Business Model v2（非接触型×フリーミアム×SNS-SEO自動集客×0円ランニング）に準拠：

- **5つの Pro キット**（業種別、AI API 利用、利益率99%超）
  - 👤 個人 ¥980/月（早期登録 ¥490/月、AI 月50回）
  - 👨‍👩‍👧 家族 ¥1,980/月（早期登録 ¥990/月、5端末・AI 月100回）
  - 🏫 学校 ¥9,800/月（早期登録 ¥4,900/月、AI 月500回）
  - 🏢 企業 ¥29,800/月（早期登録 ¥14,900/月、AI 月2000回）
  - 🏛️ 自治体 ¥98,000/月（早期登録 ¥49,000/月、AI 月10000回）
- **「興味あり」LocalStorage 蓄積**: メールアドレスや決済情報は一切収集せず、端末内のみに記録
- **「永久無料の保証」表示**: 既存の基本機能はずっと無料を明文化
- **「Pro でもプライバシー堅持」**: 質問テキストのみ AI へ送信、履歴サーバー保存なし、決済はStripe等代行を経由
- **新ルート `/pro`**: フッターに常駐せず、ホームの「もう一段深く備える」と More 配下から導線

### Changed

- `AppState` に `proInterests: Record<string, ProInterest>` を追加
- `useApp` reducer に `TOGGLE_PRO_INTEREST` action 追加
- More 画面の項目順を再編（Pro / 緊急 / 診断 / なかま / 家族カード / 手帳）
- PRIVACY.md に Pro プラン専用のサードパーティ送信条件を明記

### Privacy / 0円維持

- **無料層は完全0円維持を堅持**（API・サーバー・解析タグ ゼロ）
- **Pro 加入時のみ** AI API リクエスト送信（個人特定情報は送らない、確認画面で可視化）
- **決済情報** は Stripe 等の代行経由、当社サーバーは一切保持しない
- 興味表明データは現時点で 100% LocalStorage（メール送信フォーム実装は CEO 承認後 Phase 2）

### 利益率設計

- API コスト試算: Claude Haiku で月100リクエスト ≈ ¥7/ユーザー
- 個人プラン (¥980/月) → **利益率 99.3%**
- 自治体プラン (¥98,000/月) → **利益率 99.99%**
- 月リクエスト上限あり（赤字防止）

### Note

- 実 API 呼出 / 決済システム / 早期登録メール通知は **CEO 承認後 Phase 2** で実装
- 現状は「興味リード」を端末内に蓄積してインサイト収集する段階

---

## [0.3.0] - 2026-05-08

### Added — ゼロコスト「世界最高の防災アプリ」化

- 🆘 **緊急アクション画面 (Emergency)**
  - 119 / 110 / 171 / 118 / 189 への直通ボタン（tel: スキーム、クライアント完結）
  - 災害用伝言ダイヤル・Web 171 への一発リンク
  - 画面ライト（白画面オーバーレイ＋Wake Lock 取得で電池保護）
  - サイレン（Web Audio API でローカル生成、800/400Hz 交互、30秒で自動停止）
  - 現在地を家族カードのメモに自動追記（Geolocation API）
  - 公式情報源リンク集（気象庁/内閣府/消防庁/国民保護ポータル/ハザードマップ/大阪府市/環境省ペット/厚労省医療）4カテゴリ12件
- 📄 **PDF レポート生成 (More)**
  - jsPDF 動的import（PDF 出力時のみロード、初期JSは増えない）
  - A4 1枚に防災レベル/クエスト進捗/家族カード/備蓄カバー率を出力
  - 日本語完全表示は `window.print()` 経由（既存の印刷スタイル流用）
- 🔠 **アクセシビリティ (More + Handbook)**
  - 文字サイズ3段階切替（ふつう / おおきい / もっと大）→ LocalStorage 永続化、起動時即適用
  - 防災手帳記事の音声読み上げ（Web Speech API 無料・無認証）

### Changed

- ホームに最上段「🚨 緊急時はここ」赤ボタン（初回・2回目両方）
- More に PDF/印刷/文字サイズUIを統合
- HandbookArticle に読み上げボタン追加

### Bundle

- 初期JS: gzip **64.21KB**（+0.5KB、Home に SOS ボタン追加分のみ）
- jspdf: 動的import（`Save PDF` クリック時のみロード）
- Emergency: gzip 約3KB（独立ルート）

### Privacy / 0円維持

- 連絡先・情報源すべて公式公開ページへの直接リンク（中継サーバーなし）
- PDF生成・読み上げ・サイレン・画面ライト すべてクライアント完結
- 維持費0円・LocalStorage完結を堅持

### Security

- Wake Lock API は Permission 不要（ユーザージェスチャー必須なので OK）
- AudioContext は user gesture で起動（自動再生ブロック準拠）
- speechSynthesis のキャンセルを画面遷移時に実装（音声残留防止）

---

## [0.2.0] - 2026-05-07

### Added — カモガモ防災APP の主要機能をマージ

- **避難所検索画面 (Shelters)**
  - Leaflet + OpenStreetMap タイル（無料・商用OK）
  - 8災害種別タブ（地震/水害/津波/台風/土砂/火災/内水氾濫/高潮）
  - Geolocation API で現在地から探す
  - 大阪市中心部サンプル30件（CC-BY 相当の公開データから厳選）
  - ハバーシン公式で距離計算 → 近い順表示
  - オフライン全国概略マップ SVG（PWA precache）
- **備蓄管理画面 (Stock)**
  - 6カテゴリ40品目テンプレ（水/食料/医療/電源/防寒/トイレ）
  - 家族人数 × 推奨日数 で必要数を自動計算
  - 各品目に「ある/少しある/ない」3状態 + 賞味期限入力
  - 30日以内の賞味期限切迫アラート
  - カバー率の可視化（プログレスバー）
- **もっと画面 (More)**
  - 既存機能のハブ（診断/なかま/家族カード/手帳）
  - ショップリンク集（Amazon/楽天/コーナン/ハンズ）
  - 設定 / プライバシー / データ削除
  - About（カモガモ防災APP へのクレジット明記）

### Changed

- BottomNav 5タブに再編：ホーム / 避難所 / クエスト / 備蓄 / もっと
- Home に避難所マップ・備蓄管理のショートカット追加（初回・2回目両方）
- AppState: `stockChecks: Record<string, StockCheckState>` を追加
- Reducer: `UPDATE_STOCK_CHECK` action 追加
- storage: stockChecks の load/save 統合

### Bundle

- 初期JS: gzip **65.76KB**（+0.5KB）
- MapView (Leaflet): gzip **44.23KB**（避難所開いた時のみ動的ロード）
- Stock: gzip 4.78KB / Shelters: gzip 4.65KB / More: gzip 2.18KB

### Privacy

- 維持費0円維持（独自BE/DB/有料API/位置情報サーバー送信 すべて不採用）
- 地図タイルは OpenStreetMap（無料・商用OK・Attribution 表示済）
- 不足物資登録機能はバックエンド必須のため取り込まず（ADR 残置）

### Inspired by

- カモガモ防災APP（カルガモマスコットの防災Webアプリ） — 避難所検索／備蓄管理／オフライン概略マップの構成を参考


### Phase 2 候補（[knowledge/sonae-quest-phase2-backlog-v1.md](../knowledge/sonae-quest-phase2-backlog-v1.md) 参照）

- Context state を `useReducer` 化（CTO P1#1）
- iOS PNG icon 192/512 同梱（CTO P1#3）
- 子モード（ふりがな・親に見せる/自分でやる切替）（UX P1#5）
- LocalStorage に schema バージョニング + zod migration（CTO P2#8）
- ESLint + size-limit 導入（CTO P2#9）
- Open Graph 画像の PNG 版自動生成（UX P2#10）
- 学校・自治体・企業向けテンプレ（業種別 quests.ts 差し替え）（UX P3#14）
- 多言語化 i18n（日本語+英語+やさしい日本語）（UX P3#15）

---

## [0.1.0] - 2026-05-06

### Added — 初回リリース MVP

- **7画面実装**: ホーム / 防災力診断 / 結果 / クエスト一覧 / なかま成長 / 家族カード / 防災手帳 / 手帳記事
- **データ層**: 30クエスト / 12問診断 / 9記事手帳 / 5キャラクター
- **PWA対応**: manifest / Service Worker (prompt モード) / 更新通知UI / オフラインキャッシュ
- **iOS A2HS**: apple-mobile-web-app-* メタタグ群
- **Open Graph**: SVG 画像 (1200×630) + Twitter Card 対応
- **GH Pages 自動デプロイ**: Actions ワークフロー + BASE_PATH 動的化
- **行動変容デザイン**:
  - クエスト完了時の +EXP トースト
  - Vibration ハプティクス（Android Chrome）
  - 初回/2回目以降のホーム出し分け
  - 「まずは今すぐ、この1つから」大型 CTA
- **アクセシビリティ**: 48px tap target / focus-visible / aria-* / 印刷スタイル / reduced-motion
- **コード分割**: React.lazy で全7ルート分離 → 初期 gzip 65.25KB
- **永続化**: LocalStorage (300ms デバウンス) / 家族カード自動保存
- **共有**: Web Share API → クリップボード → LINE URL Schema 3段フォールバック
- **オフライン配布**: dist の zip 同梱 (`_release/sonae-quest-mvp-YYYYMMDD.zip`)
- **マルシェ用**: QR 生成スクリプト (`scripts/gen-qr.sh`) + DEPLOY.md にポスター作成ヒント

### Quality assurance

- 独立3名レビュー（CTO / UX / Editor）→ 重複P0即修正
- 本番ビルド成功 / TypeScript strict ✅ / コンソールエラー 0
- スマホ・タブレット・デスクトップ 全サイズ崩れなし
- ブラウザ実走検証: 7画面 + S/B/E判定 + 完了toast + 永続化 + リロード復元

### Documentation

- README.md（デプロイ3社 / QR導線 / データ構造 / 拡張案）
- DEPLOY.md（CEO がコピペで公開できる手順集）
- PRIVACY.md（プライバシーポリシー）
- LICENSE（MIT）
- 永続化資産: ADR / 知見2本 / バックログ / 完了レポート / CEO決裁シート

### Known limitations

- iOS Safari の SVG icon が A2HS で完全表示されないケース（Phase 2 で PNG 同梱予定）
- LocalStorage schema migration なし（Phase 2 で zod 導入予定）
- Context value の useMemo は state 更新で常に再生成（Phase 2 で useReducer 化予定）
- 家族間データ同期なし（設計ポリシー上、Phase 4+ かつ有料判断後のみ）

### Removed

- なし（初回リリース）

---

[Unreleased]: https://github.com/imaiatsushi/sonae-quest/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/imaiatsushi/sonae-quest/releases/tag/v0.1.0
