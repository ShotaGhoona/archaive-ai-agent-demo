import { Message } from '@/features/ai-agent/types/types';
import { analyzeKeywords, isValidQuery } from './utils/keywordMatcher';
import { searchByQuery } from './services/searchService';
import { formatSearchResults, createHelpMessage } from './services/messageService';

/**
 * TroubleAgent用のメッセージハンドラー
 * 共有状態のハンドラーから呼び出される
 */
export async function handleTroubleMessage(content: string): Promise<Message> {
  try {
    // キーワード解析
    const query = analyzeKeywords(content);
    
    // 有効なクエリかチェック
    if (!isValidQuery(query)) {
      return createHelpMessage();
    }
    
    // 検索実行（遅延含む）
    const results = await searchByQuery(query);
    
    // 結果をMarkdown形式でフォーマット
    const resultContent = formatSearchResults(results);
    
    return {
      id: Date.now().toString(),
      content: resultContent,
      sender: 'ai',
      timestamp: new Date()
    };
  } catch (error) {
    console.error('TroubleAgent search error:', error);
    return {
      id: Date.now().toString(),
      content: 'エラーが発生しました。もう一度お試しください。',
      sender: 'ai',
      type: 'error',
      timestamp: new Date()
    };
  }
}