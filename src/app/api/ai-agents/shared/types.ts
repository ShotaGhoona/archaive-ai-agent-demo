import { LucideIcon } from 'lucide-react';

// エージェント設定（統一版）
export interface AgentConfig {
  id: string;
  name: string;
  version: string;
  // ✅ inputType, capabilities 削除（自動判定にて統一）
}

// ✅ 削除済み: AgentCapability（自動判定により不要）

// 🎯 統一リクエスト型（新版）
export interface UnifiedAgentRequest {
  message: string;
  attachments?: Array<{
    type: 'image' | 'file' | 'audio';
    data: File;
    mimeType: string;
    filename: string;
  }>;
  context?: {
    history?: Array<{ role: 'user' | 'assistant'; content: string }>;
    sessionId?: string;
    userId?: string;
  };
  metadata?: Record<string, any>; // エージェント固有メタデータ
}

// ✅ 削除済み: AgentRequest<T>（UnifiedAgentRequestに統一）

export interface AgentResponse {
  response: string;
  agentId: string;
  timestamp: string;
  usage?: UsageStats;
  attachments?: ResponseAttachment[];
}

// ✅ 削除済み: ConversationContext（UnifiedAgentRequest.contextに統合）
// ✅ 削除済み: RequestAttachment（UnifiedAgentRequest.attachmentsに統合）

export interface ResponseAttachment {
  type: 'image' | 'file' | 'link';
  url?: string;
  data?: string;
  mimeType?: string;
  filename?: string;
}

export interface UsageStats {
  tokensUsed: number;
  cost?: number;
  processingTime: number;
}

// ✅ 削除済み: GeneralMetadata, EstimateMetadata（汎用metadataに統一）

// エラー型
export class AgentError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AgentError';
  }
}

export class ValidationError extends AgentError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AgentError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}

export class RateLimitError extends AgentError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 'RATE_LIMIT_EXCEEDED', 429);
    this.name = 'RateLimitError';
  }
}

// フロントエンド向け型定義（既存のagentConfigsと互換性維持）
export enum AgentCategory {
  GENERAL = 'general',
  ESTIMATE = 'estimate',
  PROCESS = 'process',
  INQUIRY = 'inquiry',
  CUSTOM = 'custom'
}

export interface AIAgentConfig {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  color: string;
  category: AgentCategory;
  welcomeMessage?: string;
  defaultInput?: string;
  quickActions?: QuickAction[];
}

export interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  action: string;
  color?: string;
}