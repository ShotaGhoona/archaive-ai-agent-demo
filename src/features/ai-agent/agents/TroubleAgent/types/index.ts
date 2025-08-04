// TroubleAgent 固有の型定義
// 既存のMessage型は @/features/ai-agent/types/types から使用

export interface SearchQuery {
  hasトラブル: boolean;
  has見積もり: boolean;
  has仕様書: boolean;
  startDate?: number;
  endDate?: number;
}

export interface SearchResult {
  id: string;
  category: 'trouble' | 'estimate' | 'specification';
  documentName: string;
  documentId: string;
  pageNumber: number;
  customer: string;
  date: string;
  summary: string;
  detail?: {
    text?: string;
    cause?: string;
    solution?: string;
    cost?: string;
    content?: Record<string, unknown>;
  };
}

export interface SearchResults {
  troubles: SearchResult[];
  estimates: SearchResult[];
  specifications: SearchResult[];
  totalCount: number;
  query: SearchQuery;
}

// データベースの型定義
export interface DatabaseDocument {
  document_id: string;
  document_name: string;
  customer: string;
  created_date: string;
  updated_date: string;
  total_pages: number;
  pages: DatabasePage[];
}

export interface DatabasePage {
  page_number: number;
  image_url: string;
  trouble: TroubleData;
  estimate: EstimateData;
  specification: SpecificationData;
}

export interface TroubleData {
  exists: boolean;
  date?: string;
  text?: string;
  detail?: {
    cause?: string;
    solution?: string;
    cost?: string;
  };
}

export interface EstimateData {
  exists: boolean;
  content?: Record<string, unknown>;
}

export interface SpecificationData {
  exists: boolean;
  content?: Record<string, unknown>;
}