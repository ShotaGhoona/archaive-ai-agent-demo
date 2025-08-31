# 工程マスター設定 - 見積もり実装者向けガイド

## 概要

工程マスター設定は見積もり機能の基盤となる工程データを管理します。複数の工程を組み合わせることで図面の価格を自動計算できます。

## データ構造

```typescript
interface ProcessMaster {
  id: string;
  processName: string; // 工程名（例: プレス加工）
  processCategory: string; // 工程分類（加工、組立、検査など）
  customFormula: string; // 計算式（例: length * width * 100）
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

### 計算ロジック

最終価格 = **(計算式の結果) × チャージ**

- 計算式: 工程固有のコスト計算
- チャージ: 労務費の乗数（工程マスターのhourlyCharge）

### 計算例

```javascript
// 工程: プレス加工
customFormula: "length * width * 100"
hourlyCharge: 2000

// 図面データ: 長さ100mm, 幅50mm
結果 = (100 * 50 * 100) × 2000 = 1,000,000,000円
```

## 見積もり実装での活用方法

### 1. 工程選択

```typescript
// 工程マスター一覧から選択
const selectedProcesses = [
  { processId: '001', processName: 'プレス加工' },
  { processId: '002', processName: '溶接' },
];
```

### 2. 価格計算

```typescript
function calculateProcessCost(process: ProcessMaster, dimensions: DrawingData) {
  // 変数を実際の値に置換
  let formula = process.customFormula
    .replace(/length/g, dimensions.length.toString())
    .replace(/width/g, dimensions.width.toString())
    .replace(/height/g, dimensions.height.toString())
    .replace(/weight/g, dimensions.weight.toString());

  // 計算実行
  const baseResult = Function('"use strict"; return (' + formula + ')')();

  // チャージを乗算
  return Math.round(baseResult * process.hourlyCharge);
}
```

### 3. 複数工程の合計

```typescript
const totalCost = selectedProcesses.reduce((sum, process) => {
  return sum + calculateProcessCost(process, drawingData);
}, 0);
```

## 現在の実装状況

- ✅ 工程マスターUI（作成、表示、CSV出力）
- ✅ 計算式ビルダー（状態管理付き）
- ✅ サンプルデータ（`src/page-components/setting/process-master/data/processMaster.json`）
- ❌ APIエンドポイント（未実装）
- ❌ データベース連携（未実装）

## 今後の実装が必要な項目

1. **API層**: 工程マスターのCRUD操作
2. **データベース**: 工程マスターテーブル設計
3. **見積もり連携**: 工程選択と価格計算機能

## 注意事項

- 計算式は安全に実行するためFunction()を使用
- エラーハンドリングを必ず実装（不正な計算式対応）
- チャージは必ず乗算（加算ではない）
- 価格は四捨五入して整数に変換
