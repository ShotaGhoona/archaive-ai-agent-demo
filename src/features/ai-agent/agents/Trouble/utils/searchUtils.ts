import troubleDatabase from "../data/trouble-database.json";
import { TroubleInfo, EstimateInfo, SpecificationInfo, SearchResult, TroubleDatabase } from "../types";

// トラブル情報を検索する関数
export const searchTroubles = (): TroubleInfo[] => {
  const troubles: TroubleInfo[] = [];

  (troubleDatabase as TroubleDatabase).documents.forEach(doc => {
    doc.pages.forEach(page => {
      if (page.trouble.exists && page.trouble.date) {
        troubles.push({
          document_id: doc.document_id,
          document_name: doc.document_name,
          customer: doc.customer,
          page_number: page.page_number,
          date: page.trouble.date,
          text: page.trouble.text || '',
          detail: page.trouble.detail || {}
        });
      }
    });
  });

  return troubles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// 見積もり情報を検索する関数
export const searchEstimates = (): EstimateInfo[] => {
  const estimates: EstimateInfo[] = [];

  (troubleDatabase as TroubleDatabase).documents.forEach(doc => {
    doc.pages.forEach(page => {
      if (page.estimate.exists) {
        estimates.push({
          document_id: doc.document_id,
          document_name: doc.document_name,
          customer: doc.customer,
          page_number: page.page_number,
          content: page.estimate.content || {}
        });
      }
    });
  });

  return estimates;
};

// 仕様書情報を検索する関数
export const searchSpecifications = (): SpecificationInfo[] => {
  const specifications: SpecificationInfo[] = [];

  (troubleDatabase as TroubleDatabase).documents.forEach(doc => {
    doc.pages.forEach(page => {
      if (page.specification.exists) {
        specifications.push({
          document_id: doc.document_id,
          document_name: doc.document_name,
          customer: doc.customer,
          page_number: page.page_number,
          content: page.specification.content || {}
        });
      }
    });
  });

  return specifications;
};

// ユーザー入力を解析して検索タイプを判定
export const parseUserInput = (input: string): SearchResult | null => {
  const trimmedInput = input.trim();
  
  if (trimmedInput === '1' || trimmedInput.toLowerCase().includes('トラブル')) {
    return { type: 'trouble', data: searchTroubles() };
  } else if (trimmedInput === '2' || trimmedInput.toLowerCase().includes('見積')) {
    return { type: 'estimate', data: searchEstimates() };
  } else if (trimmedInput === '3' || trimmedInput.toLowerCase().includes('仕様')) {
    return { type: 'specification', data: searchSpecifications() };
  } else if (trimmedInput.toLowerCase() === 'すべて' || trimmedInput === '1,2,3') {
    return {
      type: 'all',
      data: {
        troubles: searchTroubles(),
        estimates: searchEstimates(),
        specifications: searchSpecifications()
      }
    };
  }
  
  return null;
};