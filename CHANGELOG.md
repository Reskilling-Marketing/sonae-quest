# 変更履歴 — そなえクエスト

このファイルは [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に従います。
バージョニングは [SemVer](https://semver.org/lang/ja/) です。

## [Unreleased]

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
