# 材料マスター設定 - 実装ガイド

## 概要

材料マスター設定は見積もり機能で使用される材料の価格計算式を管理するシステムです。プロセスマスターと統一されたアーキテクチャで実装されており、シンプルな計算式ビルダーを提供します。

## データ構造

```typescript
interface MaterialMaster {
  id: string;
  materialName: string; // 材料名（例: SS400 板材）
  materialCategory: string; // 材料カテゴリ（鉄鋼、アルミニウム等）
  formula: string; // 計算式（例: length * width * 0.25）
  supplier: string; // 仕入れ先（例: 田中鋼材株式会社）
  remarks: string; // 備考
  updatedAt: string; // 更新日時
}
```

## 計算式システム

### 使用可能な変数

- `length`: 長さ (mm)
- `width`: 幅 (mm)
- `height`: 高さ (mm)
- `weight`: 重量 (kg)

### 計算方法

4つの計算方法から選択可能：

1. **面積ベース**: `length * width * 単価`
2. **体積ベース**: `length * width * height * 単価`
3. **重量ベース**: `weight * 単価`
4. **長さベース**: `length * 単価`

### 計算例

```javascript
// 材料: SS400 板材
formula: "length * width * 0.25"
// 図面データ: 長さ100mm, 幅50mm
結果 = 100 * 50 * 0.25 = 1,250円
```

## アーキテクチャ

### ファイル構造

```
src/page-components/setting/material-master/
├── lib/
│   ├── materialMasterColumns.tsx    # カラム定義とインターフェース
│   └── materialMasterCsvConfig.ts   # CSV出力設定
├── data/
│   └── materialMaster.json          # サンプルデータ
└── ui/
    ├── MaterialMasterContainer.tsx     # メインコンテナ
    ├── MaterialMasterPageHeader.tsx    # ページヘッダー
    ├── MaterialMasterTableView.tsx     # テーブルビュー
    └── CreateMaterialDialog.tsx        # 材料作成ダイアログ
```

### 主要コンポーネント

#### **MaterialMasterContainer**

```typescript
// useSearchbar hookによる統一された検索機能
const { searchTerm, setSearchTerm, filteredData } = useSearchbar(
  data,
  MATERIAL_MASTER_SEARCHBAR_CONFIG,
);

// ページネーション対応
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 20;
```

#### **MaterialMasterColumns**

```typescript
export const MATERIAL_MASTER_COLUMNS: DataTableColumn<MaterialMaster>[] = [
  {
    key: 'materialName',
    label: '材料名',
    width: 200,
    sortable: true,
    editable: true,
    inputType: 'text',
    render: (materialMaster, value) => (
      <span className="font-medium">{String(value)}</span>
    ),
  },
  // 他のカラム定義...
];
```

#### **CreateMaterialDialog**

シンプルな計算式ビルダー：

- 4つの計算方法から選択
- 単価入力
- 自動的な計算式生成
- リアルタイムプレビュー

## 見積もり連携での活用方法

### 1. 材料選択と価格計算

```typescript
function calculateMaterialCost(
  material: MaterialMaster,
  dimensions: DrawingData,
) {
  // 変数を実際の値に置換
  let formula = material.formula
    .replace(/length/g, dimensions.length.toString())
    .replace(/width/g, dimensions.width.toString())
    .replace(/height/g, dimensions.height.toString())
    .replace(/weight/g, dimensions.weight.toString());

  // 計算実行
  return Function('"use strict"; return (' + formula + ')')();
}
```

### 2. 複数材料の合計

```typescript
const totalMaterialCost = selectedMaterials.reduce((sum, material) => {
  return sum + calculateMaterialCost(material, drawingData);
}, 0);
```

## プロセスマスターとの違い

| 項目           | プロセスマスター      | 材料マスター         |
| -------------- | --------------------- | -------------------- |
| 計算式の複雑さ | 高（状態管理あり）    | 低（シンプル選択式） |
| 変数システム   | 自由な組み合わせ      | 4つの固定パターン    |
| テンプレート   | 5つのテンプレート     | なし                 |
| 最終計算       | (式の結果) × チャージ | 式の結果のみ         |

## 技術的特徴

### **統一されたアーキテクチャ**

- プロセスマスターと同じファイル構造
- BasicDataTable による一貫したテーブル機能
- useSearchbar hook による統一された検索
- 同じページネーション設定

### **型安全性**

```typescript
// 厳密な型定義
type ElementType = 'area' | 'volume' | 'weight' | 'length';
const CALCULATION_METHODS: {
  id: ElementType;
  label: string;
  formula: string;
}[];
```

### **エラーハンドリング**

- 計算式の安全な実行
- 不正な値の検証
- フォームバリデーション

## 現在の実装状況

- ✅ 材料マスターUI（作成、表示、CSV出力）
- ✅ シンプル計算式ビルダー
- ✅ リアルタイムプレビュー機能
- ✅ プロセスマスターとの統一アーキテクチャ
- ✅ サンプルデータ（5件の材料データ）
- ❌ APIエンドポイント（未実装）
- ❌ データベース連携（未実装）

## 今後の拡張予定

1. **API層の実装**: 材料マスターのCRUD操作
2. **データベース設計**: 材料マスターテーブル
3. **見積もり機能との連携**: 材料選択と価格計算
4. **仕入れ先管理**: 仕入れ先マスターとの連携

## 注意事項

- 計算式は安全に実行するためFunction()を使用
- エラーハンドリングを必ず実装
- 価格は四捨五入して整数に変換
- プロセスマスターと一貫したUI/UXを維持
