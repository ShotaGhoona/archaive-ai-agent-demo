#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import * as path from 'path';
import * as fs from 'fs-extra';
import { ViolationDetector, ImportViolation } from './detector';
import { PathAnalyzer, DirectoryAnalysis } from './analyzer';
import { ViolationReporter } from './reporter';
import { ViolationFixer } from './fixer';

const program = new Command();

interface CLIOptions {
  check?: boolean;
  fix?: boolean;
  generateIndex?: boolean;
  report?: boolean;
  verbose?: boolean;
  dryRun?: boolean;
  output?: string;
  format?: 'console' | 'json' | 'markdown';
  sourceDir?: string;
}

program
  .name('auto-capsulate')
  .description('Automatic import capsulation system for TypeScript projects')
  .version('1.0.0');

program
  .option('-c, --check', 'Check for import violations without fixing')
  .option('-f, --fix', 'Automatically fix import violations')
  .option('-g, --generate-index', 'Generate missing index.ts files')
  .option('-r, --report', 'Generate detailed analysis report')
  .option('-v, --verbose', 'Enable verbose output')
  .option('-d, --dry-run', 'Preview changes without applying them')
  .option('-o, --output <path>', 'Output file for reports')
  .option('--format <format>', 'Report format (console|json|markdown)', 'console')
  .option('-s, --source-dir <dir>', 'Source directory to analyze', 'src')
  .parse();

const options = program.opts<CLIOptions>();

async function main() {
  try {
    console.log(chalk.blue.bold('🚀 Auto-Capsulation System\n'));

    // デフォルトでcheckモードを実行
    if (!options.check && !options.fix && !options.generateIndex && !options.report) {
      options.check = true;
    }

    const sourceDir = options.sourceDir || 'src';
    
    // ソースディレクトリの存在確認
    if (!await fs.pathExists(sourceDir)) {
      console.error(chalk.red(`❌ Source directory not found: ${sourceDir}`));
      process.exit(1);
    }

    const detector = new ViolationDetector();
    const analyzer = new PathAnalyzer();
    const reporter = new ViolationReporter();
    const fixer = new ViolationFixer();

    // チェックモード
    if (options.check) {
      await runCheckMode(detector, reporter, sourceDir, options);
    }

    // index.ts生成モード
    if (options.generateIndex) {
      await runGenerateIndexMode(analyzer, reporter, sourceDir, options);
    }

    // レポートモード
    if (options.report) {
      await runReportMode(detector, analyzer, reporter, sourceDir, options);
    }

    // 修正モード
    if (options.fix) {
      await runFixMode(detector, fixer, reporter, sourceDir, options);
    }

    detector.dispose();
    analyzer.dispose();
    fixer.dispose();

  } catch (error) {
    console.error(chalk.red('❌ Error:'), error);
    process.exit(1);
  }
}

/**
 * チェックモード実行
 */
async function runCheckMode(
  detector: ViolationDetector, 
  reporter: ViolationReporter, 
  sourceDir: string, 
  options: CLIOptions
) {
  console.log(chalk.cyan('🔍 Checking for import violations...\n'));
  
  const violations = await detector.detectViolations(sourceDir);
  
  if (options.output && options.format !== 'console') {
    await saveReport(reporter, violations, options);
  } else {
    reporter.generateConsoleReport(violations, {
      verbose: options.verbose,
      showSuggestions: true,
      groupByFile: true,
    });
  }

  // 終了コードの設定
  const hasErrors = violations.some(v => v.severity === 'error');
  if (hasErrors) {
    process.exit(1);
  }
}

/**
 * index.ts生成モード実行
 */
async function runGenerateIndexMode(
  analyzer: PathAnalyzer, 
  reporter: ViolationReporter, 
  sourceDir: string, 
  options: CLIOptions
) {
  console.log(chalk.cyan('📁 Analyzing directory structure...\n'));
  
  const analyses = await analyzer.analyzeProjectStructure(sourceDir);
  reporter.generateDirectoryReport(analyses);
  
  const validation = analyzer.validateIndexStructure(analyses);
  
  if (validation.missing.length > 0) {
    console.log(chalk.yellow.bold('\n💡 Recommendations:'));
    validation.recommendations.forEach(rec => {
      console.log(`  - ${rec}`);
    });
    
    if (!options.dryRun) {
      console.log(chalk.blue('\n🔧 Generating missing index.ts files...'));
      await generateMissingIndexFiles(analyzer, analyses, options);
    } else {
      console.log(chalk.gray('\n🔍 (Dry run mode - no files created)'));
    }
  }
}

/**
 * 修正モード実行
 */
async function runFixMode(
  detector: ViolationDetector,
  fixer: ViolationFixer,
  reporter: ViolationReporter,
  sourceDir: string,
  options: CLIOptions
) {
  console.log(chalk.cyan('🔧 Running automatic fix mode...\n'));
  
  // 安全性チェック
  const safetyCheck = await fixer.performSafetyChecks({
    dryRun: options.dryRun,
    verbose: options.verbose,
  });
  
  if (!safetyCheck.safe && !options.dryRun) {
    console.log(chalk.yellow.bold('⚠️  Safety warnings detected:'));
    safetyCheck.warnings.forEach(warning => {
      console.log(chalk.yellow(`   ${warning}`));
    });
    console.log(chalk.yellow('\nUse --dry-run to preview changes first, or fix the warnings and try again.'));
    process.exit(1);
  }
  
  // 違反の検知
  const violations = await detector.detectViolations(sourceDir);
  
  if (violations.length === 0) {
    console.log(chalk.green('✅ No violations found! Your project is perfectly capsulated.'));
    return;
  }
  
  console.log(chalk.blue(`Found ${violations.length} violations to fix.\n`));
  
  if (options.dryRun) {
    console.log(chalk.gray.bold('🔍 DRY RUN MODE - Preview of changes:\n'));
    reporter.generateConsoleReport(violations, {
      verbose: false,
      showSuggestions: true,
      groupByFile: true,
    });
    console.log(chalk.gray('\n(No actual changes will be made in dry-run mode)'));
    return;
  }
  
  // 修正の実行
  const fixResult = await fixer.fixViolations(violations, {
    dryRun: options.dryRun,
    backup: true,
    verbose: options.verbose,
    createMissingIndexFiles: true,
  });
  
  // 結果の表示
  if (fixResult.success) {
    console.log(chalk.green.bold('✅ Fix completed successfully!\n'));
    console.log(chalk.blue(`📊 Summary:`));
    console.log(`   Fixed violations: ${chalk.green(fixResult.fixedViolations)}`);
    console.log(`   Created index files: ${chalk.green(fixResult.createdIndexFiles)}`);
    
    if (fixResult.backupDir) {
      console.log(`   Backup location: ${chalk.gray(fixResult.backupDir)}`);
    }
    
    // TypeScriptコンパイルチェック
    const tsCheck = await fixer.validateTypeScript();
    if (tsCheck.success) {
      console.log(chalk.green('✅ TypeScript compilation successful'));
    } else {
      console.log(chalk.red('❌ TypeScript compilation errors detected:'));
      tsCheck.errors.slice(0, 5).forEach(error => {
        console.log(chalk.red(`   ${error}`));
      });
      if (tsCheck.errors.length > 5) {
        console.log(chalk.red(`   ... and ${tsCheck.errors.length - 5} more errors`));
      }
    }
  } else {
    console.log(chalk.red.bold('❌ Fix completed with errors:\n'));
    fixResult.errors.forEach(error => {
      console.log(chalk.red(`   ${error}`));
    });
    process.exit(1);
  }
}

/**
 * レポートモード実行
 */
async function runReportMode(
  detector: ViolationDetector, 
  analyzer: PathAnalyzer, 
  reporter: ViolationReporter, 
  sourceDir: string, 
  options: CLIOptions
) {
  console.log(chalk.cyan('📊 Generating comprehensive report...\n'));
  
  const [violations, analyses] = await Promise.all([
    detector.detectViolations(sourceDir),
    analyzer.analyzeProjectStructure(sourceDir),
  ]);
  
  // コンソール出力
  reporter.generateConsoleReport(violations, { verbose: options.verbose });
  console.log('\n' + '='.repeat(50) + '\n');
  reporter.generateDirectoryReport(analyses);
  
  // ファイル出力
  if (options.output) {
    await saveReport(reporter, violations, options);
  }
}

/**
 * レポートファイル保存
 */
async function saveReport(
  reporter: ViolationReporter, 
  violations: ImportViolation[], 
  options: CLIOptions
) {
  const outputPath = options.output!;
  let content: string;
  
  switch (options.format) {
    case 'json':
      content = reporter.generateJsonReport(violations);
      break;
    case 'markdown':
      content = reporter.generateMarkdownReport(violations);
      break;
    default:
      console.error(chalk.red('❌ Invalid format for file output. Use json or markdown.'));
      return;
  }
  
  await fs.writeFile(outputPath, content, 'utf8');
  console.log(chalk.green(`✅ Report saved to: ${outputPath}`));
}

/**
 * 不足しているindex.tsファイルの生成
 */
async function generateMissingIndexFiles(
  analyzer: PathAnalyzer, 
  analyses: DirectoryAnalysis[], 
  options: CLIOptions
) {
  const missing = analyses.filter(a => a.needsIndexFile && !a.hasIndexFile);
  
  for (const analysis of missing) {
    const indexPath = path.join(analysis.path, 'index.ts');
    const content = analyzer.generateIndexContent(analysis);
    
    if (options.verbose) {
      console.log(chalk.gray(`Creating ${indexPath}`));
      console.log(chalk.gray(`Content:\n${content}`));
    }
    
    await fs.writeFile(indexPath, content, 'utf8');
    console.log(chalk.green(`✅ Created: ${indexPath}`));
  }
}

// プログラム実行
if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
  });
}

export { main };