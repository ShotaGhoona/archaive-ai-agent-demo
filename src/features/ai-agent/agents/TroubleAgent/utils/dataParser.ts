import { DatabaseDocument, SearchResult } from '../types';

/**
 * データベースドキュメントからトラブル情報を抽出
 */
export function extractTroubles(documents: DatabaseDocument[]): SearchResult[] {
  const results: SearchResult[] = [];
  
  documents.forEach(doc => {
    doc.pages.forEach(page => {
      if (page.trouble.exists && page.trouble.date && page.trouble.text) {
        results.push({
          id: `${doc.document_id}-${page.page_number}-trouble`,
          category: 'trouble',
          documentName: doc.document_name,
          documentId: doc.document_id,
          pageNumber: page.page_number,
          customer: doc.customer,
          date: page.trouble.date,
          summary: page.trouble.text,
          detail: page.trouble.detail
        });
      }
    });
  });
  
  return results;
}

/**
 * データベースドキュメントから見積もり情報を抽出
 */
export function extractEstimates(documents: DatabaseDocument[]): SearchResult[] {
  const results: SearchResult[] = [];
  
  documents.forEach(doc => {
    doc.pages.forEach(page => {
      if (page.estimate.exists) {
        results.push({
          id: `${doc.document_id}-${page.page_number}-estimate`,
          category: 'estimate',
          documentName: doc.document_name,
          documentId: doc.document_id,
          pageNumber: page.page_number,
          customer: doc.customer,
          date: doc.created_date,
          summary: '見積もり情報',
          detail: {
            content: page.estimate.content
          }
        });
      }
    });
  });
  
  return results;
}

/**
 * データベースドキュメントから仕様書情報を抽出
 */
export function extractSpecifications(documents: DatabaseDocument[]): SearchResult[] {
  const results: SearchResult[] = [];
  
  documents.forEach(doc => {
    doc.pages.forEach(page => {
      if (page.specification.exists) {
        results.push({
          id: `${doc.document_id}-${page.page_number}-specification`,
          category: 'specification',
          documentName: doc.document_name,
          documentId: doc.document_id,
          pageNumber: page.page_number,
          customer: doc.customer,
          date: doc.created_date,
          summary: '仕様書情報',
          detail: {
            content: page.specification.content
          }
        });
      }
    });
  });
  
  return results;
}

/**
 * コンテンツオブジェクトを文字列に変換
 */
export function formatContent(content: unknown): string {
  if (!content) return '';
  
  if (typeof content === 'string') return content;
  
  // オブジェクトの場合は整形して表示
  const lines: string[] = [];
  Object.entries(content).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      lines.push(`${key}:`);
      Object.entries(value as Record<string, unknown>).forEach(([subKey, subValue]) => {
        lines.push(`  - ${subKey}: ${subValue}`);
      });
    } else {
      lines.push(`${key}: ${value}`);
    }
  });
  
  return lines.join('\n');
}