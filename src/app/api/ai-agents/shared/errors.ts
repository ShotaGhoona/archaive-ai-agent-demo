import { NextResponse } from 'next/server';
import { AgentError, ValidationError, UnauthorizedError, RateLimitError } from './types';

// エラーレスポンス用インターフェース
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
  };
}

// 統一エラーハンドラー
export function handleAgentError(error: unknown): NextResponse<ErrorResponse> {
  console.error('Agent API Error:', error);

  const timestamp = new Date().toISOString();

  // AgentError およびその派生クラス
  if (error instanceof AgentError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
          timestamp
        }
      },
      { status: error.statusCode }
    );
  }

  // 一般的なError
  if (error instanceof Error) {
    // OpenAI API 特有のエラー
    if (error.message.includes('API key')) {
      return NextResponse.json(
        {
          error: {
            code: 'API_KEY_ERROR',
            message: 'OpenAI API key configuration error',
            timestamp
          }
        },
        { status: 500 }
      );
    }

    if (error.message.includes('rate limit')) {
      return NextResponse.json(
        {
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'API rate limit exceeded. Please try again later.',
            timestamp
          }
        },
        { status: 429 }
      );
    }

    if (error.message.includes('content_policy')) {
      return NextResponse.json(
        {
          error: {
            code: 'CONTENT_POLICY_VIOLATION',
            message: 'Content does not comply with usage policies.',
            timestamp
          }
        },
        { status: 400 }
      );
    }

    // ネットワークエラー
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return NextResponse.json(
        {
          error: {
            code: 'NETWORK_ERROR',
            message: 'Network error occurred. Please try again.',
            timestamp
          }
        },
        { status: 503 }
      );
    }
  }

  // 予期しないエラー
  return NextResponse.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        timestamp
      }
    },
    { status: 500 }
  );
}

// カスタムエラークラスのファクトリー関数
export function createValidationError(message: string, details?: any): ValidationError {
  return new ValidationError(message, details);
}

export function createUnauthorizedError(message?: string): UnauthorizedError {
  return new UnauthorizedError(message);
}

export function createRateLimitError(message?: string): RateLimitError {
  return new RateLimitError(message);
}

export function createAgentError(
  message: string,
  code: string,
  statusCode: number = 500,
  details?: any
): AgentError {
  return new AgentError(message, code, statusCode, details);
}

// ミドルウェア用エラーチェック
export function isAgentError(error: unknown): error is AgentError {
  return error instanceof AgentError;
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

export function isUnauthorizedError(error: unknown): error is UnauthorizedError {
  return error instanceof UnauthorizedError;
}

export function isRateLimitError(error: unknown): error is RateLimitError {
  return error instanceof RateLimitError;
}