# Document Data Migration Process - 2025/08/30

## 🎯 目標

page-componentに散らばっているダミーデータを`src/dummy-data`に統合し、定義済みinterfaceに合わせてデータ構造を統一する。

## 📋 標準手順（約15分/domain）

### Phase 1: データ構造の確認と変更

1. **Interface確認**: `src/dummy-data/document/interfaces/types.ts`で対象interfaceを確認
2. **既存データ読み込み**: `page-components/{domain}/home/{subdomain}/data/{file}.json`を確認
3. **データ変換**: 既存フィールド → interface要求フィールドにマッピング
4. **新ファイル作成**: `src/dummy-data/document/document-home-{subdomain}-data.json`として保存

### Phase 2: Config類の更新（lib/）

全configファイルを新interfaceに対応:

```typescript
// Before
import { OldInterface } from '../model';
export const CONFIG: Config<OldInterface>[] = [...]

// After
import { NewInterface } from '@/dummy-data/document';
export const CONFIG: Config<NewInterface>[] = [...]
```

**対象ファイル:**

- `{subdomain}TableConfig.tsx` - カラム定義とrender関数
- `{subdomain}FilterConfig.ts` - フィルター対象フィールド
- `{subdomain}SearchbarConfig.ts` - 検索対象フィールド
- `{subdomain}CsvConfig.ts` - CSV出力カラム

### Phase 3: Model層の整理

- **削除**: 不要な旧interface（例: `Delivery`）
- **保持**: UI操作用interface（例: `DeliveryColumnCallbacks`）
- **更新**: importを`@/dummy-data/document`に変更

### Phase 4: UI層の更新

**Container:**

```typescript
// Before
import { oldData } from '../data';
import { OldInterface } from '../model';
const [items, setItems] = useState<OldInterface[]>(oldData);

// After
import { newData, NewInterface } from '@/dummy-data/document';
const [items, setItems] = useState<NewInterface[]>(newData);
```

**主な変更点:**

- import文の更新
- 型定義の変更
- ID参照の変更（例: `delivery.id` → `delivery.delivery_id`）

### Phase 5: 最終整理

1. **Export追加**: `src/dummy-data/document/index.ts`に新データを追加
2. **旧フォルダ削除**: `page-components/{domain}/home/{subdomain}/data/`を削除

## 🔑 重要ポイント

### データマッピング例（Delivery）

```json
// 旧データ → 新データ
"id" → "delivery_id"
"name" → "delivery_number"
"project_name" → "delivery_details"
"delivery_destination" → "delivery_address"
"inspection_status" → "remarks"
"created_at" → "created_date"
"updated_at" → "modified_date"
```

### 共通の変更パターン

- **TableConfig**: render関数内の`item.id`を`item.{new_id_field}`に変更
- **Container**: 削除・更新ハンドラーでのID参照を変更
- **Dialog**: 表示名を旧フィールドから新フィールドに変更

## ⚠️ 注意事項

- UI操作用のCallback interfaceは残す
- 新interfaceにないフィールドは適切にマッピングまたは削除
- 全ファイル更新後、import文が正しく解決されることを確認

**想定作業時間**: 15分/subdomain（delivery, invoice, order, quotation, shipping）
