import { NextRequest, NextResponse } from 'next/server';
import { BaseAgent } from '../shared/base-agent';
import { AgentConfig } from '../shared/types';
import { validateUnifiedRequest } from '../shared/validation';
import { handleAgentError } from '../shared/errors';

// General Agent クラス
class GeneralAgent extends BaseAgent {
  config: AgentConfig = {
    id: 'general',
    name: '一般エージェント',
    version: '1.0.0'
    // ✅ inputType, capabilities 削除（自動判定にて統一）
  };

  // ✅ process()メソッドは継承で自動取得（自動判定機能付き）
  // ✅ 画像処理ロジックは継承で自動取得

  buildSystemPrompt(): string {
    return `
あなたは製造業の専門AIアシスタントです。
画像が提供された場合は画像を分析し、テキストのみの場合は一般的な質問に回答してください。
設計、製造、材料、品質管理など製造業に関する質問に、実践的で分かりやすく回答してください。

必ず日本語で回答してください。
`;
  }
}

// 🎯 統一APIエンドポイント
export async function POST(request: NextRequest) {
  const agent = new GeneralAgent();
  
  try {
    const formData = await request.formData();
    const agentRequest = validateUnifiedRequest(formData); // ✅ 統一バリデーション
    const response = await agent.process(agentRequest);
    
    return NextResponse.json(response);
  } catch (error) {
    return handleAgentError(error);
  }
}

// エージェント設定情報の取得
export async function GET() {
  const agent = new GeneralAgent();
  return NextResponse.json({
    config: agent.config,
    status: 'active',
    version: agent.config.version
  });
}