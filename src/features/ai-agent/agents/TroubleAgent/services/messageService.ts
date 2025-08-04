import { Message } from '@/features/ai-agent/types/types';
import { SearchResults, SearchResult } from '../types';
import { MESSAGES, CATEGORY_ICONS } from '../constants/messages';
import { formatDateRange } from '../utils/keywordMatcher';
import { formatContent } from '../utils/dataParser';

/**
 * ウェルカムメッセージを生成
 */
export function createWelcomeMessage(): Message {
  return {
    id: 'welcome',
    content: MESSAGES.WELCOME,
    sender: 'ai',
    type: 'welcome',
    timestamp: new Date()
  };
}

/**
 * タイピング中メッセージを生成
 */
export function createTypingMessage(): Message {
  return {
    id: 'typing',
    content: '',
    sender: 'ai',
    isTyping: true,
    timestamp: new Date()
  };
}

/**
 * ヘルプメッセージを生成
 */
export function createHelpMessage(): Message {
  return {
    id: Date.now().toString(),
    content: MESSAGES.NO_KEYWORD,
    sender: 'ai',
    timestamp: new Date()
  };
}

/**
 * 検索結果をMarkdown形式でフォーマット
 */
export function formatSearchResults(results: SearchResults): string {
  const { query } = results;
  let markdown = '';
  
  // 期間表示
  const dateRange = formatDateRange(query.startDate, query.endDate);
  if (dateRange) {
    markdown += `📅 **検索期間**: ${dateRange}\n\n`;
  }
  
  // 結果がない場合
  if (results.totalCount === 0) {
    if (query.startDate || query.endDate) {
      return markdown + MESSAGES.NO_RESULTS_IN_PERIOD;
    }
    return MESSAGES.NO_RESULTS;
  }
  
  // トラブル情報
  if (results.troubles.length > 0) {
    markdown += formatTroubleResults(results.troubles);
    markdown += '\n';
  } else if (query.hasトラブル) {
    markdown += `## ${CATEGORY_ICONS.trouble} トラブル検索結果\n\n`;
    markdown += '該当するトラブル情報は見つかりませんでした。\n\n';
  }
  
  // 見積もり情報
  if (results.estimates.length > 0) {
    markdown += formatEstimateResults(results.estimates);
    markdown += '\n';
  } else if (query.has見積もり) {
    markdown += `## ${CATEGORY_ICONS.estimate} 見積もり検索結果\n\n`;
    markdown += '該当する見積もり情報は見つかりませんでした。\n\n';
  }
  
  // 仕様書情報
  if (results.specifications.length > 0) {
    markdown += formatSpecificationResults(results.specifications);
  } else if (query.has仕様書) {
    markdown += `## ${CATEGORY_ICONS.specification} 仕様書検索結果\n\n`;
    markdown += '該当する仕様書情報は見つかりませんでした。\n';
  }
  
  return markdown.trim();
}

/**
 * トラブル結果のフォーマット
 */
function formatTroubleResults(troubles: SearchResult[]): string {
  let markdown = `## ${CATEGORY_ICONS.trouble} トラブル検索結果: ${troubles.length}件\n\n`;
  
  troubles.forEach((item, index) => {
    markdown += `### ${index + 1}. ${item.documentName}\n`;
    markdown += `- **顧客**: ${item.customer}\n`;
    markdown += `- **日付**: ${item.date}\n`;
    markdown += `- **内容**: ${item.summary}\n`;
    
    if (item.detail) {
      if (item.detail.cause) {
        markdown += `- **原因**: ${item.detail.cause}\n`;
      }
      if (item.detail.solution) {
        markdown += `- **対策**: ${item.detail.solution}\n`;
      }
      if (item.detail.cost) {
        markdown += `- **費用**: ${item.detail.cost}\n`;
      }
    }
    
    markdown += `- [図面を確認](#)\n\n`;
  });
  
  return markdown;
}

/**
 * 見積もり結果のフォーマット
 */
function formatEstimateResults(estimates: SearchResult[]): string {
  let markdown = `## ${CATEGORY_ICONS.estimate} 見積もり検索結果: ${estimates.length}件\n\n`;
  
  estimates.forEach((item, index) => {
    markdown += `### ${index + 1}. ${item.documentName}\n`;
    markdown += `- **顧客**: ${item.customer}\n`;
    markdown += `- **日付**: ${item.date}\n`;
    
    if (item.detail?.content) {
      const content = formatContent(item.detail.content);
      if (content) {
        markdown += `- **詳細**:\n`;
        content.split('\n').forEach(line => {
          markdown += `  ${line}\n`;
        });
      }
    }
    
    markdown += `- [図面を確認](#)\n\n`;
  });
  
  return markdown;
}

/**
 * 仕様書結果のフォーマット
 */
function formatSpecificationResults(specifications: SearchResult[]): string {
  let markdown = `## ${CATEGORY_ICONS.specification} 仕様書検索結果: ${specifications.length}件\n\n`;
  
  specifications.forEach((item, index) => {
    markdown += `### ${index + 1}. ${item.documentName}\n`;
    markdown += `- **顧客**: ${item.customer}\n`;
    markdown += `- **日付**: ${item.date}\n`;
    
    if (item.detail?.content) {
      const content = formatContent(item.detail.content);
      if (content) {
        markdown += `- **詳細**:\n`;
        content.split('\n').forEach(line => {
          markdown += `  ${line}\n`;
        });
      }
    }
    
    markdown += `- [図面を確認](#)\n\n`;
  });
  
  return markdown;
}

/**
 * 検索結果メッセージを生成
 */
export function createSearchResultMessage(results: SearchResults): Message {
  return {
    id: Date.now().toString(),
    content: formatSearchResults(results),
    sender: 'ai',
    timestamp: new Date()
  };
}