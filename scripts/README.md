# Scripts Directory

このディレクトリには、プロジェクトの自動化スクリプトが含まれています。

## 📁 構成

```
scripts/
├── auto-capsulate/          # 自動カプセル化システム
│   ├── index.ts            # メインエントリーポイント
│   ├── detector.ts         # 違反検知ロジック
│   ├── analyzer.ts         # パス解析・分析機能
│   ├── reporter.ts         # レポート生成機能
│   └── fixer.ts           # 自動修正機能
└── README.md              # このファイル
```

## 🚀 自動カプセル化システム

### 概要

TypeScriptプロジェクトのimport文を「スラッシュ数≤1」の原則に基づいて自動的に最適化するシステムです。

### 主な機能

- **🔍 違反検知**: 2個以上のスラッシュを含むimport文を検出
- **📊 詳細分析**: ディレクトリ構造とindex.tsの必要性を分析
- **🔧 自動修正**: 違反を自動的に修正し、最適なimportパスに変更
- **📁 index.ts生成**: 不足しているindex.tsファイルを自動生成
- **🛡️ 安全性確保**: Git状態チェック、自動バックアップ、TypeScript検証

### コマンド一覧

| コマンド | 説明 | 例 |
|---------|------|---|
| `npm run capsulate:check` | 違反をチェック（修正なし） | 日常的な品質確認 |
| `npm run capsulate:fix` | 自動修正を実行 | リファクタリング作業 |
| `npm run capsulate:fix -- --dry-run` | 修正内容をプレビュー | 変更前の確認 |
| `npm run capsulate:generate-index` | index.tsファイルを生成 | 構造整備 |
| `npm run capsulate:report` | 詳細レポートを出力 | 包括的な分析 |

### 使用例

#### 基本チェック
```bash
# プロジェクト全体の違反をチェック
npm run capsulate:check
```

#### 修正作業
```bash
# まずドライランで変更内容を確認
npm run capsulate:fix -- --dry-run

# 問題なければ実際に修正を実行
npm run capsulate:fix
```

#### 詳細分析
```bash
# 包括的なレポートを生成
npm run capsulate:report

# レポートをファイルに出力
npm run capsulate:report -- --output report.md --format markdown
```

### 高度なオプション

```bash
# 詳細ログ付きで実行
npm run capsulate:check -- --verbose

# 特定ディレクトリのみを対象
npm run capsulate:check -- --source-dir src/features

# JSONレポートを生成
npm run capsulate:report -- --format json --output violations.json
```

### 「スラッシュ数≤1」の原則

#### ✅ 理想的なimport状態
```typescript
// 他層への参照（絶対パス）
import { Button, Input } from '@/shared';

// 同層内の参照（相対パス、スラッシュ1個）
import { PreviewableFile } from '../model';
import { useFilePreview } from '../lib';
```

#### ❌ 違反パターン
```typescript
// スラッシュ2個以上 - 要修正
import { FileTypeInfo } from '../model/types';     // 2個
import { ChatMessage } from '../../shared/components/ChatMessage';  // 4個
```

### 安全性機能

1. **自動バックアップ**: 修正前に`.backups/`ディレクトリにプロジェクト全体をバックアップ
2. **Git状態チェック**: 作業ディレクトリがクリーンでない場合は警告
3. **TypeScript検証**: 修正後にコンパイルエラーがないことを確認
4. **段階的実行**: チェック → プレビュー → 修正の安全なワークフロー

### CI/CD統合

```yaml
# .github/workflows/import-validation.yml
name: Import Validation
on: [push, pull_request]

jobs:
  validate-imports:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Check import violations
        run: npm run capsulate:check
```

### 開発者向け情報

#### アーキテクチャ

- **detector.ts**: AST解析によるimport文の違反検知
- **analyzer.ts**: ディレクトリ構造分析とindex.ts生成戦略
- **reporter.ts**: 多形式レポート生成（コンソール/JSON/Markdown）
- **fixer.ts**: 安全な自動修正とファイル操作
- **index.ts**: CLI統合とワークフロー制御

#### 技術スタック

- **ts-morph**: TypeScript AST操作・解析
- **glob**: ファイル検索・パターンマッチング
- **chalk**: カラフルなコンソール出力
- **commander**: CLIインターフェース
- **fs-extra**: 高度なファイル操作

#### 拡張可能性

- カスタムルール設定
- プロジェクト固有パターンの追加
- メトリクス収集機能
- VS Code Extension統合

### トラブルシューティング

#### よくある問題

**Q: 修正後にTypeScriptエラーが発生する**
```bash
# 修正前に必要なindex.tsファイルを生成
npm run capsulate:generate-index

# その後修正を実行
npm run capsulate:fix
```

**Q: 大量の違反があって修正が不安**
```bash
# ドライランで変更内容を事前確認
npm run capsulate:fix -- --dry-run

# 少数ファイルで試験実行
npm run capsulate:fix -- --source-dir src/features/specific-feature
```

**Q: バックアップから復元したい**
```bash
# .backups/ディレクトリから手動復元
cp -r .backups/auto-capsulate-[timestamp]/src/* src/
```

### 貢献

新しいパターンの追加や機能改善の提案は、`docs/implementation-strategy/0822/11-auto-capsulation-plan.md`の実装計画書を参照してください。

---

**🎯 目標**: プロジェクト全体で「スラッシュ数≤1」を達成し、完全なカプセル化を実現