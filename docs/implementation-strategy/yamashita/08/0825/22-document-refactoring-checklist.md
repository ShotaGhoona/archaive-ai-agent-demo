# Document Home Refactoring - Implementation Checklist

## 完了済み ✅

- [x] **Widget層の作成**
  - [x] DocumentLayoutContainer実装
  - [x] DocumentTypeHeader実装（Link対応）
  - [x] LinkTabNavigation拡張
- [x] **Quotationモジュール完成**
  - [x] 型定義 (Quotation, QuotationColumnCallbacks)
  - [x] 設定ファイル (CSV, Filter, Searchbar, Table)
  - [x] UIコンポーネント (Container, PageHeader, TableView)
  - [x] Perfect Encapsulation
  - [x] App Router設定 (/document/quotation)

## 残りの必要作業

### 1. 他のドキュメントモジュール実装

- [ ] **Order モジュール**
  - [ ] 型定義とデータ構造分析
  - [ ] 設定ファイル群実装
  - [ ] UIコンポーネント実装
  - [ ] App Router設定 (/document/order)

- [ ] **Delivery モジュール**
  - [ ] 型定義とデータ構造分析
  - [ ] 設定ファイル群実装
  - [ ] UIコンポーネント実装
  - [ ] App Router設定 (/document/delivery)

- [ ] **Invoice モジュール**
  - [ ] 型定義とデータ構造分析
  - [ ] 設定ファイル群実装
  - [ ] UIコンポーネント実装
  - [ ] App Router設定 (/document/invoice)

- [ ] **Specification モジュール**
  - [ ] 型定義とデータ構造分析
  - [ ] 設定ファイル群実装
  - [ ] UIコンポーネント実装
  - [ ] App Router設定 (/document/specification)

- [ ] **Inspection モジュール**
  - [ ] 型定義とデータ構造分析
  - [ ] 設定ファイル群実装
  - [ ] UIコンポーネント実装
  - [ ] App Router設定 (/document/inspection)

### 2. 空ファイルの実装

- [ ] **空ファイルにexport {}追加**
  - [ ] delivery: lib, model, ui ファイル群
  - [ ] invoice: lib, model, ui ファイル群
  - [ ] specification: lib, model, ui ファイル群
  - [ ] inspection: lib, model, ui ファイル群
  - [ ] order: 残りのlib, model, uiファイル群

### 3. Legacy Code削除

- [ ] **古いMonolithic構造削除**
  - [ ] src/page-components/document/home/ui/DocumentHomeContainer.tsx
  - [ ] src/page-components/document/home/ui/DocumentPageHeader.tsx
  - [ ] src/page-components/document/home/ui/DocumentTableView.tsx
  - [ ] src/page-components/document/home/lib/ (既存の共通設定ファイル)
  - [ ] src/page-components/document/home/model/ (既存の共通型定義)

### 4. Navigation機能強化

- [ ] **DocumentTypeHeader改善**
  - [ ] アクティブタブの視覚的フィードバック強化
  - [ ] ブラウザの戻る/進むボタン対応

### 5. エラー解消とテスト

- [ ] **TypeScriptエラー解消**
  - [ ] 全モジュールの空ファイルをexport可能に修正
  - [ ] import/exportの整合性確認
- [ ] **動作テスト**
  - [ ] 各モジュールの表示確認
  - [ ] タブナビゲーション動作確認
  - [ ] 検索・フィルター機能確認
  - [ ] CSV出力機能確認
  - [ ] 削除機能確認

### 6. 最終確認

- [ ] **コード品質チェック**
  - [ ] npm run lint 通過
  - [ ] npm run typecheck 通過
  - [ ] Perfect Encapsulation原則遵守確認
- [ ] **機能確認**
  - [ ] 全ドキュメントタイプでの基本操作
  - [ ] パフォーマンステスト
  - [ ] レスポンシブデザイン確認

## 実装優先順位

### 高優先度

1. **Order モジュール**: quotationと同様のビジネス重要度
2. **空ファイル修正**: TypeScriptエラー解消
3. **Legacy Code削除**: 混乱回避

### 中優先度

4. **Invoice モジュール**: 会計関連で重要
5. **Delivery モジュール**: 物流管理
6. **動作テスト**: 品質保証

### 低優先度

7. **Specification/Inspection モジュール**: 技術文書系
8. **Navigation強化**: UX改善
9. **最終確認**: リリース前チェック

## 注意事項

- 各モジュール実装時はquotationモジュールをテンプレートとして活用
- Perfect Encapsulation原則を必ず遵守（シンプルなimport文）
- customer/homeパターンとの一貫性を保つ
- DocumentLayoutContainer使用時は`activeType`プロパティを正しく設定
