import { ValidationError, UnifiedAgentRequest } from './types';

// ✅ 削除済み: 下位互換性のため削除されたスキーマ・関数
// - ConversationHistorySchema, BaseRequestSchema
// - GeneralMetadataSchema, GeneralRequestSchema  
// - EstimateMetadataSchema, EstimateRequestSchema
// - validateGeneralRequest, validateEstimateRequest
// 
// 🎯 統一バリデーション（validateUnifiedRequest）のみ使用

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

// 🎯 統一バリデーション関数（新版）
export function validateUnifiedRequest(formData: FormData): UnifiedAgentRequest {
  try {
    const message = formData.get('message') as string;
    if (!message) {
      throw new ValidationError('Message is required');
    }

    if (message.length > 2000) {
      throw new ValidationError('Message too long (max 2000 characters)');
    }

    const attachments: Array<{
      type: 'image' | 'file' | 'audio';
      data: File;
      mimeType: string;
      filename: string;
    }> = [];

    // 画像ファイルの処理
    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.size > 0) {
      validateImageFile(imageFile);
      attachments.push({
        type: 'image',
        data: imageFile,
        mimeType: imageFile.type,
        filename: imageFile.name
      });
    }

    // コンテキストの処理
    let context: UnifiedAgentRequest['context'];
    const contextData = formData.get('context') as string | null;
    if (contextData) {
      try {
        const parsedContext = JSON.parse(contextData);
        context = {
          history: parsedContext.history,
          sessionId: parsedContext.sessionId,
          userId: parsedContext.userId
        };
      } catch {
        throw new ValidationError('Invalid context format');
      }
    }

    // メタデータの処理
    let metadata: Record<string, unknown> | undefined;
    const metadataData = formData.get('metadata') as string | null;
    if (metadataData) {
      try {
        metadata = JSON.parse(metadataData);
      } catch {
        throw new ValidationError('Invalid metadata format');
      }
    }

    return {
      message,
      attachments: attachments.length > 0 ? attachments : undefined,
      context,
      metadata
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError('Request validation failed');
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