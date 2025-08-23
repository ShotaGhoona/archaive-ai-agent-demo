# 自動カプセル化システム実装計画書

## 概要

import文の「/」の数を基準とした自動カプセル化システムの実装計画。
完全なカプセル化状態では、相対importのスラッシュ数は1個以下になるという原則に基づく。

## 背景・課題

### 現状の問題
- 手動でのimport最適化は時間がかかる
- `../model/types` → `../model` のような最適化を見落としやすい
- 新規開発時にカプセル化ルールが守られない
- カプセル化の完成度を測定する客観的指標がない

### 目標状態
```typescript
// ✅ 理想的なimport状態
import { Button, Input } from '@/shared';           // 他層: スラッシュ1個
import { PreviewableFile } from '../model';        // 自層: スラッシュ1個
```

## 実装戦略

### Phase 1: 検知システム (1-2日)

#### 1.1 違反検知ロジック
```typescript
// 検知対象パターン
"../model/types"           // スラッシュ2個 → 要修正
"../../shared/ui/Button"   // スラッシュ3個 → 要修正
"./components/deep/Item"   // スラッシュ3個 → 要修正

// 正常パターン
"../model"                 // スラッシュ1個 → OK
"@/shared"                 // 絶対パス → OK
"react"                    // 外部パッケージ → OK
```

#### 1.2 技術スタック
- **ts-morph**: TypeScript AST操作・解析
- **glob**: ファイル検索・パターンマッチング
- **fs-extra**: ファイル操作・IO処理

#### 1.3 実装ファイル構成
```
scripts/
├── auto-capsulate/
│   ├── index.ts              # メインエントリーポイント
│   ├── detector.ts           # 違反検知ロジック
│   ├── analyzer.ts           # パス解析・分類
│   └── reporter.ts           # レポート生成
└── package.json              # 依存関係追加
```

### Phase 2: 自動修正システム (2-3日)

#### 2.1 index.ts自動生成
```typescript
// 自動生成ロジック例
async createIndexFile(dirPath: string) {
  const files = fs.readdirSync(dirPath);
  const exports = [];
  
  for (const file of files) {
    if (file.endsWith('.ts') && file !== 'index.ts') {
      const fileName = file.replace('.ts', '');
      
      // named export検知
      const namedExports = extractNamedExports(file);
      if (namedExports.length > 0) {
        exports.push(`export { ${namedExports.join(', ')} } from './${fileName}';`);
      } else {
        exports.push(`export * from './${fileName}';`);
      }
    }
  }
  
  const indexContent = exports.join('\n');
  fs.writeFileSync(path.join(dirPath, 'index.ts'), indexContent);
}
```

#### 2.2 import文自動修正
```typescript
// パス最適化ロジック
fixImportPath(violation: ImportViolation) {
  const { file, import: importDecl, path: originalPath } = violation;
  
  // "../model/types" → "../model"
  if (originalPath.endsWith('/types')) {
    const optimizedPath = originalPath.replace('/types', '');
    importDecl.setModuleSpecifier(optimizedPath);
  }
  
  // "../../shared/shadcnui" → "@/shared"
  if (originalPath.includes('../../shared/shadcnui')) {
    importDecl.setModuleSpecifier('@/shared');
  }
}
```

### Phase 3: 継続的監視システム (1日)

#### 3.1 CI/CD統合
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
      - name: Fail if violations found
        run: exit $?
```

#### 3.2 VS Code統合
```json
// .vscode/tasks.json
{
  "tasks": [
    {
      "label": "Fix Import Violations",
      "type": "shell",
      "command": "npm run capsulate:fix",
      "group": "build",
      "presentation": {
        "reveal": "always"
      }
    }
  ]
}
```

## 技術実装詳細

### コアアルゴリズム

#### 1. 違反検知アルゴリズム
```typescript
interface ImportViolation {
  file: string;           // ファイルパス
  importDecl: ImportDeclaration;  // import文のAST
  originalPath: string;   // 元のimportパス
  slashCount: number;     // スラッシュの数
  suggestedPath: string;  // 推奨修正パス
  severity: 'error' | 'warning';
}

class ViolationDetector {
  detect(sourceFiles: SourceFile[]): ImportViolation[] {
    const violations: ImportViolation[] = [];
    
    for (const file of sourceFiles) {
      const imports = file.getImportDeclarations();
      
      for (const imp of imports) {
        const path = imp.getModuleSpecifierValue();
        
        // 相対パスのみチェック
        if (this.isRelativePath(path)) {
          const slashCount = this.countSlashes(path);
          
          if (slashCount >= 2) {
            violations.push({
              file: file.getFilePath(),
              importDecl: imp,
              originalPath: path,
              slashCount,
              suggestedPath: this.generateSuggestion(path),
              severity: slashCount >= 3 ? 'error' : 'warning'
            });
          }
        }
      }
    }
    
    return violations;
  }
}
```

#### 2. index.ts生成アルゴリズム
```typescript
class IndexGenerator {
  async generateIndex(dirPath: string): Promise<string> {
    const files = await fs.readdir(dirPath);
    const tsFiles = files.filter(f => f.endsWith('.ts') && f !== 'index.ts');
    
    const exports = await Promise.all(
      tsFiles.map(async file => {
        const exports = await this.extractExports(path.join(dirPath, file));
        return this.generateExportStatement(file, exports);
      })
    );
    
    return exports.join('\n');
  }
  
  private async extractExports(filePath: string): Promise<ExportInfo[]> {
    const sourceFile = this.project.addSourceFileAtPath(filePath);
    const exports: ExportInfo[] = [];
    
    // export function/class/interface/type の検知
    sourceFile.getExportedDeclarations().forEach((declarations, name) => {
      exports.push({ name, type: this.getExportType(declarations[0]) });
    });
    
    return exports;
  }
}
```

### パッケージ構成

```json
{
  "name": "@project/auto-capsulator",
  "dependencies": {
    "ts-morph": "^20.0.0",
    "glob": "^10.3.0",
    "fs-extra": "^11.0.0",
    "chalk": "^4.1.2",
    "commander": "^11.0.0"
  },
  "scripts": {
    "capsulate:check": "node dist/scripts/auto-capsulate.js --check",
    "capsulate:fix": "node dist/scripts/auto-capsulate.js --fix",
    "capsulate:generate-index": "node dist/scripts/auto-capsulate.js --generate-index",
    "capsulate:report": "node dist/scripts/auto-capsulate.js --report"
  }
}
```

## 実行フロー

### 1. チェックモード
```bash
npm run capsulate:check
```
**出力例:**
```
🔍 Import Violations Found:

📁 src/features/file-preview/ui/PreviewViewer.tsx
  ❌ Line 10: "../model/types" (2 slashes) → Suggested: "../model"
  ❌ Line 12: "./components/deep/Item" (3 slashes) → Suggested: "../ui"

📁 src/features/comparison-modal/lib/field-components.tsx
  ⚠️  Line 4: "../model/types" (2 slashes) → Suggested: "../model"

📊 Summary:
  - Total files scanned: 127
  - Files with violations: 3
  - Total violations: 4
  - Errors: 2, Warnings: 2
```

### 2. 修正モード
```bash
npm run capsulate:fix
```
**実行フロー:**
1. 違反を検知
2. 必要なindex.tsファイルを生成/更新
3. import文を自動修正
4. TypeScriptコンパイルチェック
5. 結果レポート表示

## リスク管理

### 潜在的リスク

#### 1. 破壊的変更リスク
- **対策**: 変更前の自動バックアップ
- **対策**: Git作業ディレクトリのクリーン状態チェック
- **対策**: 段階的実行（チェック→生成→修正）

#### 2. 型エラーリスク
- **対策**: 修正後の自動TypeScriptコンパイル
- **対策**: テストスイートの自動実行
- **対策**: ロールバック機能

#### 3. パフォーマンスリスク
- **対策**: 大規模プロジェクト向け並列処理
- **対策**: インクリメンタル処理（変更ファイルのみ）

### 安全性確保

#### 1. Dry Runモード
```typescript
interface RunOptions {
  dryRun: boolean;        // 実際の変更なしでプレビュー
  verbose: boolean;       // 詳細ログ出力
  backup: boolean;        // 変更前バックアップ作成
}
```

#### 2. 変更前検証
```typescript
async validateBeforeFix() {
  // Git作業ディレクトリチェック
  if (!this.isGitClean()) {
    throw new Error('Git working directory is not clean');
  }
  
  // TypeScriptコンパイルチェック
  if (!await this.typeCheck()) {
    throw new Error('TypeScript compilation failed');
  }
  
  // テスト実行
  if (!await this.runTests()) {
    throw new Error('Tests failed');
  }
}
```

## スケジュール

### Week 1: Phase 1実装
- **Day 1-2**: 基本検知システム
  - AST解析ロジック
  - 違反パターン検知
  - 基本レポート機能

### Week 2: Phase 2実装  
- **Day 3-4**: 自動修正システム
  - index.ts自動生成
  - import文修正ロジック
  - 安全性チェック機能
- **Day 5**: テスト・デバッグ

### Week 3: Phase 3実装
- **Day 6**: CI/CD統合
- **Day 7**: ドキュメント・最終調整

## 成功指標

### 定量的指標
- **違反検知精度**: 95%以上
- **自動修正成功率**: 90%以上  
- **実行時間**: 大規模プロジェクト（1000ファイル）で5分以内
- **破壊的変更**: 0件（完全ロールバック可能）

### 定性的指標
- 開発者の手動作業時間50%削減
- 新規開発でのカプセル化ルール遵守率向上
- コードレビューでのimport関連指摘減少

## 拡張可能性

### 将来的な機能拡張
1. **エディタ統合**: VS Code Extension開発
2. **カスタムルール**: プロジェクト固有ルール設定
3. **メトリクス収集**: カプセル化品質の継続監視
4. **自動リファクタリング**: より高度な構造最適化

---

**作成日**: 2025-08-22  
**更新日**: 2025-08-22  
**ステータス**: 計画書完成・実装準備完了