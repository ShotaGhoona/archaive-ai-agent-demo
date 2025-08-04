"use client";

import { useCallback } from 'react';
import { analyzeKeywords, isValidQuery } from '../utils/keywordMatcher';
import { searchByQuery } from '../services/searchService';
import { formatSearchResults, createHelpMessage } from '../services/messageService';

/**
 * キーワード検索のカスタムフック（MVPに必要な最小限の機能のみ）
 */
export function useKeywordSearch() {
  
  const searchByKeywords = useCallback(async (input: string): Promise<string> => {
    // キーワード解析
    const query = analyzeKeywords(input);
    
    // 有効なクエリかチェック
    if (!isValidQuery(query)) {
      return createHelpMessage().content;
    }
    
    // 検索実行
    const results = await searchByQuery(query);
    
    // 結果をMarkdown形式でフォーマット
    return formatSearchResults(results);
  }, []);

  return {
    searchByKeywords
  };
}