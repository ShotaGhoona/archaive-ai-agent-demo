import { Project, SourceFile, ExportedDeclarations } from 'ts-morph';
import * as fs from 'fs-extra';
import * as path from 'path';
import { glob } from 'glob';

export interface ExportInfo {
  name: string;
  type: 'function' | 'class' | 'interface' | 'type' | 'const' | 'default' | 'namespace';
  isDefault?: boolean;
}

export interface DirectoryAnalysis {
  path: string;
  hasIndexFile: boolean;
  needsIndexFile: boolean;
  exports: ExportInfo[];
  subDirectories: string[];
  tsFiles: string[];
}

export class PathAnalyzer {
  private project: Project;

  constructor(tsConfigFilePath?: string) {
    this.project = new Project({
      tsConfigFilePath: tsConfigFilePath || 'tsconfig.json',
    });
  }

  /**
   * ディレクトリ構造の分析
   */
  async analyzeDirectory(dirPath: string): Promise<DirectoryAnalysis> {
    const absolutePath = path.resolve(dirPath);
    
    if (!await fs.pathExists(absolutePath)) {
      throw new Error(`Directory does not exist: ${absolutePath}`);
    }

    const stats = await fs.stat(absolutePath);
    if (!stats.isDirectory()) {
      throw new Error(`Path is not a directory: ${absolutePath}`);
    }

    const contents = await fs.readdir(absolutePath);
    const tsFiles = contents.filter((file: string) => 
      file.endsWith('.ts') || file.endsWith('.tsx')
    ).filter((file: string) => file !== 'index.ts'); // index.tsは除外

    const subDirectories = [];
    for (const item of contents) {
      const itemPath = path.join(absolutePath, item);
      const itemStats = await fs.stat(itemPath);
      if (itemStats.isDirectory()) {
        subDirectories.push(item);
      }
    }

    const hasIndexFile = contents.includes('index.ts');
    const needsIndexFile = tsFiles.length > 0 || subDirectories.length > 0;
    
    // エクスポート情報の収集
    const exports = await this.extractExports(absolutePath, tsFiles);

    return {
      path: dirPath,
      hasIndexFile,
      needsIndexFile,
      exports,
      subDirectories,
      tsFiles,
    };
  }

  /**
   * ディレクトリ内のファイルからエクスポート情報を抽出
   */
  private async extractExports(dirPath: string, tsFiles: string[]): Promise<ExportInfo[]> {
    const allExports: ExportInfo[] = [];

    for (const fileName of tsFiles) {
      const filePath = path.join(dirPath, fileName);
      try {
        const sourceFile = this.project.addSourceFileAtPath(filePath);
        const fileExports = this.extractFileExports(sourceFile);
        allExports.push(...fileExports);
      } catch (error) {
        console.warn(`Failed to analyze exports from ${filePath}:`, error);
      }
    }

    return allExports;
  }

  /**
   * 単一ファイルからエクスポート情報を抽出
   */
  private extractFileExports(sourceFile: SourceFile): ExportInfo[] {
    const exports: ExportInfo[] = [];

    // 名前付きエクスポートの取得
    const exportedDeclarations = sourceFile.getExportedDeclarations();
    exportedDeclarations.forEach((declarations, name) => {
      if (declarations.length > 0) {
        const declaration = declarations[0];
        const type = this.getExportType(declaration);
        exports.push({ name, type });
      }
    });

    // デフォルトエクスポートの確認
    const defaultExport = sourceFile.getDefaultExportSymbol();
    if (defaultExport) {
      exports.push({
        name: 'default',
        type: 'default',
        isDefault: true,
      });
    }

    return exports;
  }

  /**
   * エクスポート宣言の型を判定
   */
  private getExportType(declaration: ExportedDeclarations): ExportInfo['type'] {
    const kind = declaration.getKind();
    
    switch (kind) {
      case 262: // SyntaxKind.FunctionDeclaration
        return 'function';
      case 263: // SyntaxKind.ClassDeclaration
        return 'class';
      case 265: // SyntaxKind.InterfaceDeclaration
        return 'interface';
      case 266: // SyntaxKind.TypeAliasDeclaration
        return 'type';
      case 258: // SyntaxKind.VariableDeclaration
        return 'const';
      case 267: // SyntaxKind.ModuleDeclaration
        return 'namespace';
      default:
        return 'const'; // デフォルトはconst扱い
    }
  }

  /**
   * index.tsファイルの内容を生成
   */
  generateIndexContent(analysis: DirectoryAnalysis): string {
    const exports: string[] = [];
    
    // TypeScriptファイルからのエクスポート（シンプルに統一）
    for (const fileName of analysis.tsFiles) {
      const baseName = fileName.replace(/\.(ts|tsx)$/, '');
      exports.push(`export * from './${baseName}';`);
    }
    
    // サブディレクトリからのエクスポート（index.tsがあるもののみ）
    for (const subDir of analysis.subDirectories) {
      const subDirIndexPath = path.join(analysis.path, subDir, 'index.ts');
      if (fs.existsSync(subDirIndexPath)) {
        exports.push(`export * from './${subDir}';`);
      }
    }
    
    return exports.join('\n') + (exports.length > 0 ? '\n' : '');
  }

  /**
   * プロジェクト全体のディレクトリを再帰的に分析
   */
  async analyzeProjectStructure(rootDir: string = 'src'): Promise<DirectoryAnalysis[]> {
    const analyses: DirectoryAnalysis[] = [];
    
    // 分析対象のディレクトリを特定
    const directories = await this.findAnalysisTargets(rootDir);
    
    for (const dir of directories) {
      try {
        const analysis = await this.analyzeDirectory(dir);
        analyses.push(analysis);
      } catch (error) {
        console.warn(`Failed to analyze directory ${dir}:`, error);
      }
    }
    
    return analyses;
  }

  /**
   * 分析対象のディレクトリを特定
   */
  private async findAnalysisTargets(rootDir: string): Promise<string[]> {
    const pattern = path.join(rootDir, '**/*/').replace(/\\/g, '/');
    const directories = await glob(pattern, { 
      ignore: ['**/node_modules/**', '**/.git/**']
    });
    
    // ルートディレクトリも含める
    directories.unshift(rootDir);
    
    return directories.sort();
  }

  /**
   * 重複するindex.ts設定の検証
   */
  validateIndexStructure(analyses: DirectoryAnalysis[]): {
    conflicts: string[];
    missing: string[];
    recommendations: string[];
  } {
    const conflicts: string[] = [];
    const missing: string[] = [];
    const recommendations: string[] = [];
    
    for (const analysis of analyses) {
      // index.tsが必要だが存在しない
      if (analysis.needsIndexFile && !analysis.hasIndexFile) {
        missing.push(analysis.path);
        recommendations.push(
          `Create index.ts in ${analysis.path} to export: ${analysis.tsFiles.join(', ')}`
        );
      }
      
      // index.tsが存在するが不要（空のディレクトリ）
      if (analysis.hasIndexFile && !analysis.needsIndexFile) {
        conflicts.push(analysis.path);
        recommendations.push(
          `Remove unnecessary index.ts from ${analysis.path}`
        );
      }
    }
    
    return { conflicts, missing, recommendations };
  }

  dispose(): void {
    // クリーンアップ処理
  }
}