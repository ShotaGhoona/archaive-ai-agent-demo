# ダミーデータ統合戦略 - 2025/08/30

## 🎯 目標
FSDアーキテクチャの各層に散らばっているダミーデータを`src/dummy-data`に統合し、コンポーネント分離時の依存関係問題を解決する。

## 🚨 現在の問題
- 各コンポーネントの`data/`ディレクトリにダミーデータが分散
- コンポーネント分離時に必要なデータが見つからない
- データとinterfaceが混在し、再利用性が低下

## 📋 実装戦略

### Phase 1: 現状分析
- [ ] 全層の`data/`ディレクトリを調査
- [ ] ダミーデータとinterface定義を特定
- [ ] 依存関係マッピング作成

### Phase 2: 統合構造設計
```
src/dummy-data/
├── blueprint/
│   ├── blueprint-home-data.json     # 図面一覧データ
│   └── interfaces/
│       └── types.ts                 # 図面関連型定義
├── customer/
│   └── interfaces/
├── document/
│   └── interfaces/
├── project/
│   └── interfaces/
├── setting/
│   └── interfaces/
├── interfaces/                      # 共通型定義
│   └── interfaces/
└── index.ts                        # エクスポート統制
```

**重要設計原則:**
- 各ドメインフォルダ直下にJSONファイルを配置（例: `blueprint-home-data.json`）
- 各ドメイン固有の型定義は `{domain}/interfaces/types.ts` に配置
- 共通型定義は `interfaces/` フォルダに配置
- 最上位の `index.ts` のみでエクスポート統制を実施

### Phase 3: データ移行
- [ ] 各ドメイン別にダミーデータ移動
- [ ] Interface定義をinterfaces/に統合
- [ ] 全コンポーネントのimport文更新

## 🎁 期待効果
- ✅ コンポーネント分離が容易に
- ✅ ダミーデータの一元管理
- ✅ 型定義の再利用性向上
- ✅ FSDアーキテクチャの純粋性保持

## ⚡ 今日の成果目標
1. 現状分析完了
2. 統合構造作成
3. 最低1つのドメインデータ移行完了