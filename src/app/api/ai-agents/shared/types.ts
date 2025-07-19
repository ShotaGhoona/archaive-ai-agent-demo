import { LucideIcon } from 'lucide-react';

// エージェント設定
export interface AgentConfig {
  id: string;
  name: string;
  version: string;
  inputType: 'json' | 'formdata' | 'multipart';
  capabilities: AgentCapability[];
}

export interface AgentCapability {
  type: 'text' | 'vision' | 'audio' | 'file';
  formats?: string[];
  maxSize?: number;
}

// リクエスト・レスポンス型
export interface AgentRequest<T = any> {
  message: string;
  metadata?: T;
  context?: ConversationContext;
  attachments?: RequestAttachment[];
}

export interface AgentResponse {
  response: string;
  agentId: string;
  timestamp: string;
  usage?: UsageStats;
  attachments?: ResponseAttachment[];
}

export interface ConversationContext {
  history?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  sessionId?: string;
  userId?: string;
}

export interface RequestAttachment {
  type: 'image' | 'file' | 'audio';
  data: File | string; // File object or base64 string
  mimeType?: string;
  filename?: string;
}

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

// エージェント別メタデータ
export interface GeneralMetadata {
  sessionId?: string;
  userId?: string;
  preferences?: {
    experienceLevel?: 'beginner' | 'intermediate' | 'expert';
    preferredUnits?: 'metric' | 'imperial';
    industryFocus?: string[];
  };
}

export interface EstimateMetadata {
  blueprintInfo?: {
    id: string;
    name: string;
    material: string;
    customerName: string;
    productName: string;
  };
  estimateType?: 'quick' | 'detailed' | 'final';
  quantity?: number;
  deliveryRequirement?: {
    deadline: Date;
    priority: 'normal' | 'urgent' | 'flexible';
  };
  qualityRequirements?: {
    tolerance: string;
    surfaceFinish: string;
    inspection: string[];
  };
}

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