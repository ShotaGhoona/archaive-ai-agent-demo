// トラブル情報の型定義
export interface TroubleInfo {
  document_id: string;
  document_name: string;
  customer: string;
  page_number: number;
  date: string;
  text: string;
  detail: {
    cause?: string;
    solution?: string;
    parts?: string;
    cost?: string;
    downtime?: string;
  };
}

// 見積もり情報の型定義
export interface EstimateInfo {
  document_id: string;
  document_name: string;
  customer: string;
  page_number: number;
  content: Record<string, any>;
}

// 仕様書情報の型定義
export interface SpecificationInfo {
  document_id: string;
  document_name: string;
  customer: string;
  page_number: number;
  content: Record<string, any>;
}

// 検索結果の型定義
export type SearchResultType = 'trouble' | 'estimate' | 'specification' | 'all';

export interface SearchResult {
  type: SearchResultType;
  data: TroubleInfo[] | EstimateInfo[] | SpecificationInfo[] | {
    troubles: TroubleInfo[];
    estimates: EstimateInfo[];
    specifications: SpecificationInfo[];
  };
}

// データベースの型定義
export interface TroubleDatabase {
  documents: Document[];
}

export interface Document {
  document_id: string;
  document_name: string;
  customer: string;
  pages: Page[];
}

export interface Page {
  page_number: number;
  trouble: {
    exists: boolean;
    date?: string;
    text?: string;
    detail?: {
      cause?: string;
      solution?: string;
      parts?: string;
      cost?: string;
      downtime?: string;
    };
  };
  estimate: {
    exists: boolean;
    content?: Record<string, any>;
  };
  specification: {
    exists: boolean;
    content?: Record<string, any>;
  };
}

// ChatContentのProps型定義
export interface ChatContentProps {
  messages: import("../../../types/types").Message[];
  isLoading: boolean;
  agentConfig: import("../../../types/types").AIAgentConfig;
  sessionImage?: File | null;
}