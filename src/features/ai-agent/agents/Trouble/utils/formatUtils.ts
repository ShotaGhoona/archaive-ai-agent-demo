import { SearchResult, TroubleInfo, EstimateInfo, SpecificationInfo } from "../types";

// 検索結果をフォーマットする関数
export const formatSearchResults = (searchResults: SearchResult): string | null => {
  if (!searchResults) return null;

  if (searchResults.type === 'trouble') {
    return formatTroubles(searchResults.data as TroubleInfo[]);
  }
  
  if (searchResults.type === 'estimate') {
    return formatEstimates(searchResults.data as EstimateInfo[]);
  }
  
  if (searchResults.type === 'specification') {
    return formatSpecifications(searchResults.data as SpecificationInfo[]);
  }
  
  if (searchResults.type === 'all') {
    return formatAllResults(searchResults.data as {
      troubles: TroubleInfo[];
      estimates: EstimateInfo[];
      specifications: SpecificationInfo[];
    });
  }
  
  return null;
};

// トラブル情報のフォーマット
const formatTroubles = (troubles: TroubleInfo[]): string => {
  if (troubles.length === 0) {
    return 'トラブル情報は見つかりませんでした。';
  }
  
  let result = `🔧 **トラブル情報が${troubles.length}件見つかりました**\n\n`;
  troubles.forEach((trouble, index) => {
    result += `**${index + 1}. ${trouble.document_name}**\n`;
    result += `🏭 顧客: ${trouble.customer}\n`;
    result += `📄 文書ID: ${trouble.document_id} (ページ${trouble.page_number})\n`;
    result += `📅 日付: ${trouble.date}\n`;
    result += `⚠️ トラブル: ${trouble.text}\n`;
    if (trouble.detail.cause) result += `🔍 原因: ${trouble.detail.cause}\n`;
    if (trouble.detail.solution) result += `✅ 対策: ${trouble.detail.solution}\n`;
    if (trouble.detail.cost) result += `💰 費用: ${trouble.detail.cost}\n`;
    result += `🖼️ [図面を表示](/ai/agent/${trouble.document_id}/${trouble.page_number})\n\n`;
  });
  return result;
};

// 見積もり情報のフォーマット
const formatEstimates = (estimates: EstimateInfo[]): string => {
  if (estimates.length === 0) {
    return '見積もり情報は見つかりませんでした。';
  }
  
  let result = `💰 **見積もり情報が${estimates.length}件見つかりました**\n\n`;
  estimates.forEach((estimate, index) => {
    result += `**${index + 1}. ${estimate.document_name}**\n`;
    result += `🏭 顧客: ${estimate.customer}\n`;
    result += `📄 文書ID: ${estimate.document_id} (ページ${estimate.page_number})\n`;
    result += `📋 内容: ${formatContent(estimate.content)}\n`;
    result += `🖼️ [図面を表示](/ai/agent/${estimate.document_id}/${estimate.page_number})\n\n`;
  });
  return result;
};

// 仕様書情報のフォーマット
const formatSpecifications = (specifications: SpecificationInfo[]): string => {
  if (specifications.length === 0) {
    return '仕様書情報は見つかりませんでした。';
  }
  
  let result = `📄 **仕様書情報が${specifications.length}件見つかりました**\n\n`;
  specifications.forEach((spec, index) => {
    result += `**${index + 1}. ${spec.document_name}**\n`;
    result += `🏭 顧客: ${spec.customer}\n`;
    result += `📄 文書ID: ${spec.document_id} (ページ${spec.page_number})\n`;
    result += `📋 内容: ${formatContent(spec.content)}\n`;
    result += `🖼️ [図面を表示](/ai/agent/${spec.document_id}/${spec.page_number})\n\n`;
  });
  return result;
};

// 全検索結果のフォーマット
const formatAllResults = (data: {
  troubles: TroubleInfo[];
  estimates: EstimateInfo[];
  specifications: SpecificationInfo[];
}): string => {
  let result = '**すべての情報を検索しました**\n\n';
  
  if (data.troubles.length > 0) {
    result += formatTroubles(data.troubles) + '\n---\n\n';
  }
  
  if (data.estimates.length > 0) {
    result += formatEstimates(data.estimates) + '\n---\n\n';
  }
  
  if (data.specifications.length > 0) {
    result += formatSpecifications(data.specifications);
  }
  
  return result;
};

// コンテンツのフォーマット補助関数
const formatContent = (content: any): string => {
  return JSON.stringify(content, null, 2)
    .replace(/["{},]/g, '')
    .trim();
};