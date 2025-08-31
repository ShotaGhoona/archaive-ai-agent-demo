# ダミーデータ統合戦略 - 2025/08/30

## 🎯 目標

FSDアーキテクチャの各層に散らばっているダミーデータを`src/dummy-data`に統合し、コンポーネント分離時の依存関係問題を解決する。

## 🚨 解決した問題

- 各コンポーネントの`data/`ディレクトリにダミーデータが分散 → ✅ 解決
- コンポーネント分離時に必要なデータが見つからない → ✅ 解決
- データとinterfaceが混在し、再利用性が低下 → ✅ 解決

## 📋 確定した実装戦略

### ✅ Phase 1: 現状分析完了

- 全層の`data/`ディレクトリを調査完了
- ダミーデータとinterface定義を特定完了
- Customer domain移行で学習完了

### ✅ Phase 2: 最終構造設計

```
src/dummy-data/
├── customer/
│   ├── customer-home-data.json        # 顧客一覧データ
│   ├── customer-contact-data.json     # 顧客連絡先データ
│   ├── interfaces/
│   │   └── types.ts                   # Customer関連型定義
│   └── index.ts                       # ドメイン内カプセル化
├── blueprint/
│   ├── {blueprint-xxx-data}.json
│   ├── interfaces/
│   └── index.ts
├── project/
├── document/
└── setting/
```

### 🔑 確定した設計原則

#### データとInterface分離

- **移行対象**: ダミーデータの型定義（例: `Customer` → `CustomerHomeDataInterface`）
- **残存対象**: UI操作の型定義（例: `CustomerColumnCallbacks`）

#### カプセル化戦略

- **各ドメイン**: `{domain}/index.ts`でカプセル化実施
- **最上位**: `src/dummy-data/index.ts`は**不要**
- **export形式**: `export type {}`を明示的に使用（isolatedModules対応）

#### ファイル命名規則

- JSONファイル: `{domain}-{page}-data.json`（例: `customer-home-data.json`）
- Interface名: `{Domain}{Page}DataInterface`（例: `CustomerHomeDataInterface`）

### ✅ Phase 3: Customer Domain移行完了

**移行作業:**

1. ダミーデータ移動: `customer.json` → `customer-home-data.json`, `contact.json` → `customer-contact-data.json`
2. Interface移行: `Customer`, `Contact` → `CustomerHomeDataInterface`, `CustomerContactDataInterface`
3. UI型定義維持: `CustomerColumnCallbacks`, `ContactColumnCallbacks`は元の位置に残存
4. Import文更新: 全関連ファイルで`@/dummy-data/customer`から取得
5. 不要ディレクトリ削除: `data/`フォルダ完全削除

## 🎁 実証された効果

- ✅ データ一元管理実現（customer domain）
- ✅ UI型定義とデータ型定義の明確分離
- ✅ バックエンド統合時のクリーン削除準備完了
- ✅ コンポーネント再利用性向上

## 📈 今後の展開

1. ✅ Customer Domain移行完了
2. 🔄 Blueprint Domain移行（次のターゲット）
3. 🔄 Project Domain移行
4. 🔄 Document Domain移行
5. 🔄 Setting Domain移行
