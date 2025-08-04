import { SearchQuery } from '../types';
import { KEYWORD_PATTERNS, YEAR_PATTERN } from '../constants/messages';

/**
 * ユーザー入力からキーワードを解析して検索クエリを生成
 */
export function analyzeKeywords(input: string): SearchQuery {
  const normalized = input.toLowerCase();
  
  // 年代抽出（4桁の数字）
  const yearMatches = input.match(YEAR_PATTERN);
  let startDate: number | undefined;
  let endDate: number | undefined;
  
  if (yearMatches) {
    const years = yearMatches.map(y => parseInt(y)).sort((a, b) => a - b);
    if (years.length === 1) {
      // 1つの年が指定された場合、その年以降
      startDate = years[0];
    } else if (years.length >= 2) {
      // 2つ以上の年が指定された場合、最小と最大を範囲とする
      startDate = years[0];
      endDate = years[years.length - 1];
    }
  }
  
  return {
    hasトラブル: KEYWORD_PATTERNS.trouble.test(normalized),
    has見積もり: KEYWORD_PATTERNS.estimate.test(normalized),
    has仕様書: KEYWORD_PATTERNS.specification.test(normalized),
    startDate,
    endDate
  };
}

/**
 * 検索クエリが有効かどうかを判定
 */
export function isValidQuery(query: SearchQuery): boolean {
  return query.hasトラブル || query.has見積もり || query.has仕様書;
}

/**
 * 日付範囲でフィルタリング
 */
export function filterByDateRange<T extends { date: string }>(
  items: T[],
  startDate?: number,
  endDate?: number
): T[] {
  if (!startDate) return items;
  
  return items.filter(item => {
    // YYYY/MM/DD または YYYY-MM-DD 形式から年を抽出
    const yearMatch = item.date.match(/^(\d{4})/);
    if (!yearMatch) return false;
    
    const itemYear = parseInt(yearMatch[1]);
    
    if (endDate) {
      // 範囲指定
      return itemYear >= startDate && itemYear <= endDate;
    } else {
      // startDate以降
      return itemYear >= startDate;
    }
  });
}

/**
 * 期間の表示文字列を生成
 */
export function formatDateRange(startDate?: number, endDate?: number): string {
  if (!startDate) return '';
  
  if (endDate) {
    return `${startDate}年 〜 ${endDate}年`;
  } else {
    return `${startDate}年以降`;
  }
}