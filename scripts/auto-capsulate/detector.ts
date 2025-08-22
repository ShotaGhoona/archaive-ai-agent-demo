import { Project, SourceFile, ImportDeclaration } from 'ts-morph';
import * as path from 'path';

export interface ImportViolation {
  file: string;
  importDecl: ImportDeclaration;
  originalPath: string;
  slashCount: number;
  suggestedPath: string;
  severity: 'error' | 'warning';
  lineNumber: number;
}

export class ViolationDetector {
  private project: Project;

  constructor(tsConfigFilePath?: string) {
    this.project = new Project({
      tsConfigFilePath: tsConfigFilePath || 'tsconfig.json',
    });
  }

  /**
   * 指定されたディレクトリ配下の違反を検知
   */
  async detectViolations(sourceDir: string = 'src'): Promise<ImportViolation[]> {
    const sourceFiles = this.project.getSourceFiles(`${sourceDir}/**/*.{ts,tsx}`);
    const violations: ImportViolation[] = [];

    for (const file of sourceFiles) {
      const fileViolations = this.detectFileViolations(file);
      violations.push(...fileViolations);
    }

    return violations.sort((a, b) => {
      // ファイル名でソート後、行番号でソート
      const fileCompare = a.file.localeCompare(b.file);
      if (fileCompare !== 0) return fileCompare;
      return a.lineNumber - b.lineNumber;
    });
  }

  /**
   * 単一ファイルの違反検知
   */
  private detectFileViolations(file: SourceFile): ImportViolation[] {
    const violations: ImportViolation[] = [];
    const imports = file.getImportDeclarations();

    for (const importDecl of imports) {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();
      
      // 相対パスのみチェック（絶対パス、パッケージは除外）
      if (this.isRelativePath(moduleSpecifier)) {
        const slashCount = this.countSlashes(moduleSpecifier);
        
        // スラッシュが2個以上の場合は違反
        if (slashCount >= 2) {
          const violation: ImportViolation = {
            file: file.getFilePath(),
            importDecl,
            originalPath: moduleSpecifier,
            slashCount,
            suggestedPath: this.generateSuggestion(moduleSpecifier),
            severity: slashCount >= 3 ? 'error' : 'warning',
            lineNumber: importDecl.getStartLineNumber(),
          };
          violations.push(violation);
        }
      }
    }

    return violations;
  }

  /**
   * 相対パス判定
   */
  private isRelativePath(path: string): boolean {
    return path.startsWith('./') || path.startsWith('../');
  }

  /**
   * スラッシュの数をカウント
   */
  private countSlashes(path: string): number {
    return (path.match(/\//g) || []).length;
  }

  /**
   * 修正候補パスの生成
   */
  private generateSuggestion(originalPath: string): string {
    // パターン1: "../model/types" → "../model"
    if (originalPath.endsWith('/types')) {
      return originalPath.replace('/types', '');
    }
    
    // パターン2: "../lib/utils" → "../lib"
    if (originalPath.endsWith('/utils')) {
      return originalPath.replace('/utils', '');
    }
    
    // パターン3: "./components/deep/Item" → "../ui" (推測)
    if (originalPath.includes('/components/')) {
      return '../ui';
    }
    
    // パターン4: "../../shared/shadcnui" → "@/shared"
    if (originalPath.includes('../../shared/shadcnui')) {
      return '@/shared';
    }
    
    // パターン5: "../../shared/ui" → "@/shared"
    if (originalPath.includes('../../shared/')) {
      return '@/shared';
    }
    
    // デフォルト: 最後のセグメントを削除
    const segments = originalPath.split('/');
    if (segments.length > 2) {
      return segments.slice(0, -1).join('/');
    }
    
    return originalPath;
  }

  /**
   * 統計情報の取得
   */
  getViolationStats(violations: ImportViolation[]) {
    const totalFiles = new Set(violations.map(v => v.file)).size;
    const errorCount = violations.filter(v => v.severity === 'error').length;
    const warningCount = violations.filter(v => v.severity === 'warning').length;
    
    return {
      totalViolations: violations.length,
      totalFilesWithViolations: totalFiles,
      errors: errorCount,
      warnings: warningCount,
    };
  }

  /**
   * プロジェクトのクリーンアップ
   */
  dispose(): void {
    // ts-morphのプロジェクトインスタンスをクリーンアップ
    // メモリリークを防ぐため
  }
}