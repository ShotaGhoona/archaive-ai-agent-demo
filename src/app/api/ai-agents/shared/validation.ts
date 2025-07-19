import { z } from 'zod';
import { AgentRequest, GeneralMetadata, EstimateMetadata, ValidationError } from './types';

// 共通バリデーションスキーマ
const ConversationHistorySchema = z.array(z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string()
}));

const BaseRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  context: z.object({
    history: ConversationHistorySchema.optional(),
    sessionId: z.string().optional(),
    userId: z.string().optional()
  }).optional()
});

// General Agent バリデーション
const GeneralMetadataSchema = z.object({
  sessionId: z.string().optional(),
  userId: z.string().optional(),
  preferences: z.object({
    experienceLevel: z.enum(['beginner', 'intermediate', 'expert']).optional(),
    preferredUnits: z.enum(['metric', 'imperial']).optional(),
    industryFocus: z.array(z.string()).optional()
  }).optional()
});

export const GeneralRequestSchema = BaseRequestSchema.extend({
  metadata: GeneralMetadataSchema.optional()
});

// Estimate Agent バリデーション
const EstimateMetadataSchema = z.object({
  blueprintInfo: z.object({
    id: z.string(),
    name: z.string(),
    material: z.string(),
    customerName: z.string(),
    productName: z.string()
  }).optional(),
  estimateType: z.enum(['quick', 'detailed', 'final']).optional(),
  quantity: z.number().positive().optional(),
  deliveryRequirement: z.object({
    deadline: z.string().transform((str) => new Date(str)),
    priority: z.enum(['normal', 'urgent', 'flexible'])
  }).optional(),
  qualityRequirements: z.object({
    tolerance: z.string(),
    surfaceFinish: z.string(),
    inspection: z.array(z.string())
  }).optional()
});

export const EstimateRequestSchema = BaseRequestSchema.extend({
  metadata: EstimateMetadataSchema.optional()
});

// バリデーション関数
export function validateGeneralRequest(body: unknown): AgentRequest<GeneralMetadata> {
  try {
    const result = GeneralRequestSchema.parse(body);
    return {
      message: result.message,
      metadata: result.metadata,
      context: result.context
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid request format', error.errors);
    }
    throw error;
  }
}

export function validateEstimateRequest(formData: FormData): AgentRequest<EstimateMetadata> {
  try {
    const message = formData.get('message') as string;
    const metadataStr = formData.get('metadata') as string;
    const contextStr = formData.get('context') as string;
    const imageFile = formData.get('image') as File | null;

    if (!message) {
      throw new ValidationError('Message is required');
    }

    // メタデータの解析
    let metadata: EstimateMetadata | undefined;
    if (metadataStr) {
      try {
        const parsedMetadata = JSON.parse(metadataStr);
        metadata = EstimateMetadataSchema.parse(parsedMetadata);
      } catch (error) {
        throw new ValidationError('Invalid metadata format');
      }
    }

    // コンテキストの解析
    let context;
    if (contextStr) {
      try {
        context = JSON.parse(contextStr);
      } catch (error) {
        throw new ValidationError('Invalid context format');
      }
    }

    // 画像ファイルの検証
    const attachments = [];
    if (imageFile && imageFile.size > 0) {
      // ファイル形式チェック
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(imageFile.type)) {
        throw new ValidationError(
          'Unsupported file format. Please upload JPG, PNG, or WEBP files.'
        );
      }

      // ファイルサイズチェック（20MB制限）
      if (imageFile.size > 20 * 1024 * 1024) {
        throw new ValidationError(
          'File size too large. Please upload files under 20MB.'
        );
      }

      attachments.push({
        type: 'image' as const,
        data: imageFile,
        mimeType: imageFile.type,
        filename: imageFile.name
      });
    }

    return {
      message,
      metadata,
      context,
      attachments: attachments.length > 0 ? attachments : undefined
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError('Request validation failed');
  }
}

// ファイル検証ヘルパー
export function validateImageFile(file: File): void {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 20 * 1024 * 1024; // 20MB

  if (!allowedTypes.includes(file.type)) {
    throw new ValidationError(
      `Unsupported file format: ${file.type}. Allowed formats: ${allowedTypes.join(', ')}`
    );
  }

  if (file.size > maxSize) {
    throw new ValidationError(
      `File too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maximum size: 20MB`
    );
  }
}

// エージェントID検証
export function validateAgentId(agentId: string): void {
  const validAgents = ['general', 'estimate'];
  if (!validAgents.includes(agentId)) {
    throw new ValidationError(
      `Invalid agent ID: ${agentId}. Valid agents: ${validAgents.join(', ')}`
    );
  }
}