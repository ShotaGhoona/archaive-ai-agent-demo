import { Project, SourceFile, ImportDeclaration } from 'ts-morph';
import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import { ImportViolation } from './detector';
import { PathAnalyzer, DirectoryAnalysis } from './analyzer';

export interface FixOptions {
  dryRun?: boolean;
  backup?: boolean;
  verbose?: boolean;
  createMissingIndexFiles?: boolean;
}

export interface FixResult {
  success: boolean;
  fixedViolations: number;
  createdIndexFiles: number;
  errors: string[];
  backupDir?: string;
}

export class ViolationFixer {
  private project: Project;
  private analyzer: PathAnalyzer;

  constructor(tsConfigFilePath?: string) {
    this.project = new Project({
      tsConfigFilePath: tsConfigFilePath || 'tsconfig.json',
    });
    this.analyzer = new PathAnalyzer(tsConfigFilePath);
  }

  /**
   * 違反の自動修正
   */
  async fixViolations(
    violations: ImportViolation[], 
    options: FixOptions = {}
  ): Promise<FixResult> {
    const result: FixResult = {
      success: false,
      fixedViolations: 0,
      createdIndexFiles: 0,
      errors: [],
    };

    try {
      // バックアップの作成
      if (options.backup && !options.dryRun) {
        result.backupDir = await this.createBackup();
        console.log(chalk.blue(`📦 Backup created: ${result.backupDir}`));
      }

      // 必要なindex.tsファイルの作成
      if (options.createMissingIndexFiles) {
        const created = await this.createMissingIndexFiles(options);
        result.createdIndexFiles = created;
      }

      // 違反修正の実行
      for (const violation of violations) {
        try {
          await this.fixSingleViolation(violation, options);
          result.fixedViolations++;
          
          if (options.verbose) {
            console.log(chalk.green(
              `✅ Fixed: ${violation.file}:${violation.lineNumber} "${violation.originalPath}" → "${violation.suggestedPath}"`
            ));
          }
        } catch (error) {
          const errorMsg = `Failed to fix ${violation.file}:${violation.lineNumber} - ${error}`;
          result.errors.push(errorMsg);
          
          if (options.verbose) {
            console.log(chalk.red(`❌ ${errorMsg}`));
          }
        }
      }

      // ファイルの保存
      if (!options.dryRun) {
        await this.saveChanges();
      }

      result.success = result.errors.length === 0;
      return result;

    } catch (error) {
      result.errors.push(`Critical error during fix process: ${error}`);
      result.success = false;
      return result;
    }
  }

  /**
   * 単一違反の修正
   */
  private async fixSingleViolation(
    violation: ImportViolation, 
    options: FixOptions
  ): Promise<void> {
    const sourceFile = this.project.getSourceFile(violation.file);
    if (!sourceFile) {
      throw new Error(`Source file not found: ${violation.file}`);
    }

    // import文の更新
    const newPath = await this.calculateOptimalPath(violation, sourceFile);
    
    if (options.dryRun) {
      // ドライランモードでは実際の変更は行わない
      return;
    }

    // 既存のimport文を更新
    violation.importDecl.setModuleSpecifier(newPath);
  }

  /**
   * 最適なimportパスの計算
   */
  private async calculateOptimalPath(
    violation: ImportViolation, 
    sourceFile: SourceFile
  ): Promise<string> {
    const currentDir = path.dirname(sourceFile.getFilePath());
    const originalPath = violation.originalPath;

    // パターン1: "../model/types" → "../model" (index.tsが存在する場合)
    if (originalPath.endsWith('/types')) {
      const targetDir = path.resolve(currentDir, originalPath.replace('/types', ''));
      const indexPath = path.join(targetDir, 'index.ts');
      
      if (await fs.pathExists(indexPath)) {
        return originalPath.replace('/types', '');
      }
    }

    // パターン2: "../lib/utils" → "../lib" (index.tsが存在する場合)
    if (originalPath.endsWith('/utils')) {
      const targetDir = path.resolve(currentDir, originalPath.replace('/utils', ''));
      const indexPath = path.join(targetDir, 'index.ts');
      
      if (await fs.pathExists(indexPath)) {
        return originalPath.replace('/utils', '');
      }
    }

    // パターン3: "../../shared/shadcnui" → "@/shared"
    if (originalPath.includes('../../shared/shadcnui') || originalPath.includes('../../shared/ui')) {
      return '@/shared';
    }

    // パターン4: 一般的なindex.ts最適化
    const suggestedPath = violation.suggestedPath;
    const targetDir = path.resolve(currentDir, suggestedPath);
    const indexPath = path.join(targetDir, 'index.ts');
    
    if (await fs.pathExists(indexPath)) {
      return suggestedPath;
    }

    // フォールバック: 元の提案パスを使用
    return suggestedPath;
  }

  /**
   * 不足しているindex.tsファイルの作成
   */
  private async createMissingIndexFiles(options: FixOptions): Promise<number> {
    const analyses = await this.analyzer.analyzeProjectStructure('src');
    const missing = analyses.filter(a => a.needsIndexFile && !a.hasIndexFile);
    
    let created = 0;
    for (const analysis of missing) {
      try {
        if (!options.dryRun) {
          await this.createIndexFile(analysis);
        }
        created++;
        
        if (options.verbose) {
          console.log(chalk.green(`✅ Created index.ts: ${analysis.path}`));
        }
      } catch (error) {
        if (options.verbose) {
          console.log(chalk.red(`❌ Failed to create index.ts in ${analysis.path}: ${error}`));
        }
      }
    }
    
    return created;
  }

  /**
   * index.tsファイルの作成
   */
  private async createIndexFile(analysis: DirectoryAnalysis): Promise<void> {
    const indexPath = path.join(analysis.path, 'index.ts');
    const content = this.analyzer.generateIndexContent(analysis);
    
    await fs.writeFile(indexPath, content, 'utf8');
    
    // プロジェクトに新しいファイルを追加
    this.project.addSourceFileAtPath(indexPath);
  }

  /**
   * バックアップの作成
   */
  private async createBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join('.backups', `auto-capsulate-${timestamp}`);
    
    await fs.ensureDir(backupDir);
    
    // srcディレクトリ全体をバックアップ
    await fs.copy('src', path.join(backupDir, 'src'));
    
    return backupDir;
  }

  /**
   * 変更の保存
   */
  private async saveChanges(): Promise<void> {
    // ts-morphプロジェクトの変更を保存
    await this.project.save();
  }

  /**
   * TypeScriptコンパイルチェック
   */
  async validateTypeScript(): Promise<{ success: boolean; errors: string[] }> {
    const diagnostics = this.project.getPreEmitDiagnostics();
    const errors: string[] = [];
    
    for (const diagnostic of diagnostics) {
      const file = diagnostic.getSourceFile();
      const fileName = file ? path.relative(process.cwd(), file.getFilePath()) : 'unknown';
      const lineNumber = diagnostic.getLineNumber();
      const message = diagnostic.getMessageText();
      
      errors.push(`${fileName}:${lineNumber} - ${message}`);
    }
    
    return {
      success: errors.length === 0,
      errors,
    };
  }

  /**
   * Git作業ディレクトリのクリーン状態チェック
   */
  async isGitClean(): Promise<boolean> {
    try {
      const { execSync } = require('child_process');
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      return status.trim().length === 0;
    } catch {
      // gitが利用できない場合はtrueを返す
      return true;
    }
  }

  /**
   * 安全性チェック
   */
  async performSafetyChecks(options: FixOptions): Promise<{ safe: boolean; warnings: string[] }> {
    const warnings: string[] = [];
    let safe = true;

    // Git作業ディレクトリのチェック
    if (!await this.isGitClean() && !options.dryRun) {
      warnings.push('Git working directory is not clean. Consider committing changes first.');
      safe = false;
    }

    // TypeScriptコンパイルチェック
    const tsValidation = await this.validateTypeScript();
    if (!tsValidation.success) {
      warnings.push(`TypeScript compilation errors found:\n${tsValidation.errors.slice(0, 5).join('\n')}`);
      if (tsValidation.errors.length > 5) {
        warnings.push(`... and ${tsValidation.errors.length - 5} more errors`);
      }
      safe = false;
    }

    return { safe, warnings };
  }

  dispose(): void {
    this.analyzer.dispose();
  }
}