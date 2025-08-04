import { SearchQuery, SearchResults, DatabaseDocument, SearchResult } from '../types';
import { extractTroubles, extractEstimates, extractSpecifications } from '../utils/dataParser';
import { filterByDateRange } from '../utils/keywordMatcher';
import mockDatabase from '../data/mockDatabase.json';

/**
 * キーワードに基づいて検索を実行
 */
export async function searchByQuery(query: SearchQuery): Promise<SearchResults> {
  // デモ用の遅延をシミュレート
  await simulateDelay();
  
  const documents = mockDatabase.documents as unknown as DatabaseDocument[];
  const results: SearchResults = {
    troubles: [],
    estimates: [],
    specifications: [],
    totalCount: 0,
    query
  };
  
  // カテゴリごとに検索
  if (query.hasトラブル) {
    let troubles = extractTroubles(documents);
    troubles = filterByDateRange(troubles, query.startDate, query.endDate);
    results.troubles = troubles;
  }
  
  if (query.has見積もり) {
    let estimates = extractEstimates(documents);
    estimates = filterByDateRange(estimates, query.startDate, query.endDate);
    results.estimates = estimates;
  }
  
  if (query.has仕様書) {
    let specifications = extractSpecifications(documents);
    specifications = filterByDateRange(specifications, query.startDate, query.endDate);
    results.specifications = specifications;
  }
  
  // 総件数を計算
  results.totalCount = 
    results.troubles.length + 
    results.estimates.length + 
    results.specifications.length;
  
  return results;
}

/**
 * デモ用の遅延をシミュレート
 */
async function simulateDelay(): Promise<void> {
  const delay = Math.floor(Math.random() * 500) + 500; // 500-1000ms
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * すべてのカテゴリから最新データを取得（初期表示用）
 */
export async function getRecentData(limit: number = 5): Promise<SearchResults> {
  const documents = mockDatabase.documents as unknown as DatabaseDocument[];
  
  // すべてのデータを取得
  const allTroubles = extractTroubles(documents);
  const allEstimates = extractEstimates(documents);
  const allSpecifications = extractSpecifications(documents);
  
  // 日付でソートして最新のものを取得
  const sortByDate = (a: SearchResult, b: SearchResult) => {
    const dateA = new Date(a.date.replace(/\//g, '-'));
    const dateB = new Date(b.date.replace(/\//g, '-'));
    return dateB.getTime() - dateA.getTime();
  };
  
  return {
    troubles: allTroubles.sort(sortByDate).slice(0, limit),
    estimates: allEstimates.sort(sortByDate).slice(0, limit),
    specifications: allSpecifications.sort(sortByDate).slice(0, limit),
    totalCount: Math.min(allTroubles.length + allEstimates.length + allSpecifications.length, limit * 3),
    query: {
      hasトラブル: false,
      has見積もり: false,
      has仕様書: false
    }
  };
}