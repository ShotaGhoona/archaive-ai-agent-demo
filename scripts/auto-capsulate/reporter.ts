import chalk from 'chalk';
import { ImportViolation } from './detector';
import { DirectoryAnalysis } from './analyzer';

export interface ReportOptions {
  verbose?: boolean;
  showSuggestions?: boolean;
  groupByFile?: boolean;
  outputFormat?: 'console' | 'json' | 'markdown';
}

export class ViolationReporter {
  /**
   * コンソールに違反レポートを出力
   */
  generateConsoleReport(
    violations: ImportViolation[], 
    options: ReportOptions = {}
  ): void {
    const { verbose = false, showSuggestions = true, groupByFile = true } = options;

    if (violations.length === 0) {
      console.log(chalk.green('✅ No import violations found! Perfect capsulation achieved.'));
      return;
    }

    console.log(chalk.red.bold('🔍 Import Violations Found:\n'));

    if (groupByFile) {
      this.reportByFile(violations, showSuggestions, verbose);
    } else {
      this.reportByViolation(violations, showSuggestions, verbose);
    }

    // 統計情報の表示
    this.printStatistics(violations);
  }

  /**
   * ファイル別のレポート表示
   */
  private reportByFile(
    violations: ImportViolation[], 
    showSuggestions: boolean, 
    verbose: boolean
  ): void {
    const violationsByFile = this.groupViolationsByFile(violations);

    for (const [filePath, fileViolations] of Array.from(violationsByFile)) {
      const relativeFilePath = filePath.replace(process.cwd(), '.');
      console.log(chalk.blue.bold(`📁 ${relativeFilePath}`));

      for (const violation of fileViolations) {
        const severityIcon = violation.severity === 'error' ? '❌' : '⚠️ ';
        const severityColor = violation.severity === 'error' ? chalk.red : chalk.yellow;
        
        console.log(
          `  ${severityIcon} Line ${violation.lineNumber}: ${severityColor(
            `"${violation.originalPath}"`
          )} (${violation.slashCount} slashes)`
        );

        if (showSuggestions) {
          console.log(
            `     💡 Suggested: ${chalk.green(`"${violation.suggestedPath}"`)}`
          );
        }

        if (verbose) {
          console.log(
            `     📝 Import statement: ${chalk.gray(violation.importDecl.getText())}`
          );
        }
      }
      console.log();
    }
  }

  /**
   * 違反別のレポート表示
   */
  private reportByViolation(
    violations: ImportViolation[], 
    showSuggestions: boolean, 
    verbose: boolean
  ): void {
    for (const violation of violations) {
      const relativeFilePath = violation.file.replace(process.cwd(), '.');
      const severityIcon = violation.severity === 'error' ? '❌' : '⚠️ ';
      const severityColor = violation.severity === 'error' ? chalk.red : chalk.yellow;

      console.log(
        `${severityIcon} ${chalk.blue(relativeFilePath)}:${violation.lineNumber}`
      );
      console.log(
        `   ${severityColor(`"${violation.originalPath}"`)} (${violation.slashCount} slashes)`
      );

      if (showSuggestions) {
        console.log(
          `   💡 Suggested: ${chalk.green(`"${violation.suggestedPath}"`)}`
        );
      }

      if (verbose) {
        console.log(
          `   📝 ${chalk.gray(violation.importDecl.getText())}`
        );
      }
      console.log();
    }
  }

  /**
   * 統計情報の表示
   */
  private printStatistics(violations: ImportViolation[]): void {
    const stats = this.calculateStatistics(violations);
    
    console.log(chalk.cyan.bold('📊 Summary:'));
    console.log(`  - Total files scanned: ${chalk.white(stats.totalFilesScanned)}`);
    console.log(`  - Files with violations: ${chalk.white(stats.filesWithViolations)}`);
    console.log(`  - Total violations: ${chalk.white(stats.totalViolations)}`);
    console.log(`  - Errors: ${chalk.red(stats.errors)}, Warnings: ${chalk.yellow(stats.warnings)}`);
    
    if (stats.mostCommonPatterns.length > 0) {
      console.log('\n🔍 Most common violation patterns:');
      stats.mostCommonPatterns.forEach((pattern, index) => {
        console.log(`  ${index + 1}. "${pattern.path}" (${pattern.count} occurrences)`);
      });
    }
  }

  /**
   * JSON形式のレポート生成
   */
  generateJsonReport(violations: ImportViolation[]): string {
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.calculateStatistics(violations),
      violations: violations.map(v => ({
        file: v.file.replace(process.cwd(), '.'),
        line: v.lineNumber,
        originalPath: v.originalPath,
        suggestedPath: v.suggestedPath,
        slashCount: v.slashCount,
        severity: v.severity,
      })),
    };

    return JSON.stringify(report, null, 2);
  }

  /**
   * Markdown形式のレポート生成
   */
  generateMarkdownReport(violations: ImportViolation[]): string {
    const stats = this.calculateStatistics(violations);
    const violationsByFile = this.groupViolationsByFile(violations);

    let markdown = '# Import Violations Report\n\n';
    markdown += `**Generated:** ${new Date().toISOString()}\n\n`;
    
    markdown += '## Summary\n\n';
    markdown += `- **Total violations:** ${stats.totalViolations}\n`;
    markdown += `- **Files with violations:** ${stats.filesWithViolations}\n`;
    markdown += `- **Errors:** ${stats.errors}\n`;
    markdown += `- **Warnings:** ${stats.warnings}\n\n`;

    if (violations.length === 0) {
      markdown += '✅ **No violations found! Perfect capsulation achieved.**\n';
      return markdown;
    }

    markdown += '## Violations by File\n\n';
    
    for (const [filePath, fileViolations] of Array.from(violationsByFile)) {
      const relativeFilePath = filePath.replace(process.cwd(), '.');
      markdown += `### ${relativeFilePath}\n\n`;
      
      for (const violation of fileViolations) {
        const severityIcon = violation.severity === 'error' ? '❌' : '⚠️';
        markdown += `${severityIcon} **Line ${violation.lineNumber}:** \`${violation.originalPath}\` (${violation.slashCount} slashes)\n`;
        markdown += `   💡 *Suggested:* \`${violation.suggestedPath}\`\n\n`;
      }
    }

    return markdown;
  }

  /**
   * ディレクトリ分析レポートの生成
   */
  generateDirectoryReport(analyses: DirectoryAnalysis[]): void {
    console.log(chalk.blue.bold('📂 Directory Structure Analysis:\n'));

    const needingIndex = analyses.filter(a => a.needsIndexFile && !a.hasIndexFile);
    const hasUnnecessaryIndex = analyses.filter(a => a.hasIndexFile && !a.needsIndexFile);
    const properlyConfigured = analyses.filter(a => 
      (a.needsIndexFile && a.hasIndexFile) || (!a.needsIndexFile && !a.hasIndexFile)
    );

    if (needingIndex.length > 0) {
      console.log(chalk.red.bold('❌ Directories missing index.ts:'));
      needingIndex.forEach(analysis => {
        console.log(`  📁 ${analysis.path}`);
        console.log(`     Files: ${analysis.tsFiles.join(', ') || 'none'}`);
        console.log(`     Subdirs: ${analysis.subDirectories.join(', ') || 'none'}`);
      });
      console.log();
    }

    if (hasUnnecessaryIndex.length > 0) {
      console.log(chalk.yellow.bold('⚠️  Directories with unnecessary index.ts:'));
      hasUnnecessaryIndex.forEach(analysis => {
        console.log(`  📁 ${analysis.path}`);
      });
      console.log();
    }

    console.log(chalk.green.bold('✅ Properly configured directories:'));
    console.log(`  ${properlyConfigured.length} directories`);
    
    console.log(chalk.cyan.bold('\n📊 Directory Summary:'));
    console.log(`  - Total directories: ${analyses.length}`);
    console.log(`  - Missing index.ts: ${chalk.red(needingIndex.length)}`);
    console.log(`  - Unnecessary index.ts: ${chalk.yellow(hasUnnecessaryIndex.length)}`);
    console.log(`  - Properly configured: ${chalk.green(properlyConfigured.length)}`);
  }

  /**
   * ファイル別にグループ化
   */
  private groupViolationsByFile(violations: ImportViolation[]): Map<string, ImportViolation[]> {
    const grouped = new Map<string, ImportViolation[]>();
    
    for (const violation of violations) {
      if (!grouped.has(violation.file)) {
        grouped.set(violation.file, []);
      }
      grouped.get(violation.file)!.push(violation);
    }
    
    return grouped;
  }

  /**
   * 統計情報の計算
   */
  private calculateStatistics(violations: ImportViolation[]) {
    const filesWithViolations = new Set(violations.map(v => v.file)).size;
    const errors = violations.filter(v => v.severity === 'error').length;
    const warnings = violations.filter(v => v.severity === 'warning').length;
    
    // パターン分析
    const pathCounts = new Map<string, number>();
    violations.forEach(v => {
      const count = pathCounts.get(v.originalPath) || 0;
      pathCounts.set(v.originalPath, count + 1);
    });
    
    const mostCommonPatterns = Array.from(pathCounts.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalFilesScanned: 'N/A', // TODO: 実際のスキャンファイル数を計算
      filesWithViolations,
      totalViolations: violations.length,
      errors,
      warnings,
      mostCommonPatterns,
    };
  }
}