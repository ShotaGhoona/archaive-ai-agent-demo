# ER図に基づくInterface/JSON修正戦略 - 2025/08/30

## 🎯 Step 2 目標

ER図を参照し、統合されたダミーデータのInterface定義とJSONファイルを実際のDB設計に合わせて修正する。

## ✅ Customer Domain完了済み実装手順

### 1. ER図ベースJSON構造設計

- ER図の`CUSTOMERS`テーブル構造を確認
- バックエンドAPI統合を想定したレスポンス構造を設計
- FK統合パターン：`customer_status_id` → `customer_status`, `in_charge` → `in_charge_name`
- カスタムアイテム構造：`{value, color, type}`形式で設計

### 2. Interface定義作成

- `src/dummy-data-er-fix/customer/interfaces/types.ts`作成
- `CustomerCustomItemValue`, `CustomerHomeDataInterface`定義
- 不要なinterfaceは削除（ContactData等）

### 3. サンプルJSON作成

- `src/dummy-data-er-fix/customer/customer-home-data.json`作成
- FK統合前後の比較用データ（id1: 生DB構造, id2〜: 統合後構造）
- カスタムアイテムにselect型サンプル追加

### 4. lib層修正

- `customerTableConfig.tsx`: カラム定義をER図ベースに修正
- `customerFilterConfig.ts`: フィルター項目をER図ベースに修正
- `customerSearchbarConfig.ts`: 検索対象フィールドを修正
- `customerCsvConfig.ts`: CSV出力カラムを修正

### 5. ui層修正

- `CustomerContainer.tsx`: import路を`@/dummy-data-er-fix/customer`に変更
- `CustomerTableView.tsx`: `Customer`型を`CustomerHomeDataInterface`に統一
- `CreateCustomerDialog.tsx`: フォームフィールドをER図ベースに修正、営業担当者フィールド追加
- `CustomerPageHeader.tsx`: 型定義とラベルを統一

## 📋 今後の実施タスク

### Blueprint Domain修正

1. **ER図確認**: Blueprint関連テーブル構造を把握
2. **JSON構造設計**: バックエンドレスポンス構造を想定
3. **Interface作成**: `src/dummy-data-er-fix/blueprint/interfaces/types.ts`
4. **サンプルJSON作成**: blueprint関連JSONファイル
5. **lib層修正**: テーブル・フィルター・検索・CSV設定
6. **ui層修正**: コンポーネントファイル
7. **model層修正**: 型定義ファイル

### Project Domain修正

同様の手順でProject Domain対応

### その他Domain修正

- Document Domain
- Setting Domain

## 🔑 確立した作業順序

各Domainで以下の順序で実施：

1. **ER図確認** → レスポンス構造設計
2. **Interface作成** → 型定義ファイル作成  
3. **JSON作成** → サンプルデータ作成
4. **lib修正** → 設定ファイル群修正
5. **ui修正** → コンポーネントファイル修正
6. **model修正** → 型定義ファイル修正

## 💡 学習済みパターン

- FK統合：`{field}_id` → `{field}_name` 形式
- カスタムアイテム：`{value, color, type}`構造
- 色指定制限：TABLE_COLORS定数の12色のみ使用可能（red, orange, yellow, green, blue, indigo, purple, pink, gray, slate, emerald, sky）
- 文字化け対策：英語コメントまたはコメント削除
- 不要interface削除：現在使用していないものは除去
- TableView設定：`inputType`指定時は専用セルコンポーネント（SelectTypeCell等）が自動適用されるため`render`は不要
- ネストオブジェクト対応：汎用ユーティリティ`getValue`/`setValue`を作成（`@/shared`からimport可能）
- オブジェクトパスユーティリティ：`frontend/src/shared/utility/object-path/object-path.ts`に配置、sharedでカプセル化済み