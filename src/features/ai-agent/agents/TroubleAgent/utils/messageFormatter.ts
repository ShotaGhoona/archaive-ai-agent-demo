import { SearchResults } from '../types';
import { formatSearchResults } from '../services/messageService';

/**
 * 検索結果をMarkdown文字列に変換
 * （messageServiceのラッパー関数）
 */
export function formatAsMarkdown(results: SearchResults): string {
  return formatSearchResults(results);
}

/**
 * エラーメッセージをフォーマット
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return `申し訳ございません。エラーが発生しました: ${error.message}`;
  }
  return 'エラーが発生しました。しばらくしてからもう一度お試しください。';
}

/**
 * 日付を日本語形式にフォーマット
 */
export function formatDate(date: Date): string {
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * ファイルサイズを人間が読みやすい形式に変換
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}