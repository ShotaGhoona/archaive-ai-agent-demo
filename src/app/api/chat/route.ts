import { NextRequest, NextResponse } from 'next/server';
import { openai, MODEL, TEMPERATURE } from './utils/openai';
import { getEnhancedPrompt } from './utils/prompts';
import { validateChatRequest, ChatRequest, ChatResponse } from './utils/validation';
import { ManufacturingContext } from './agents/general-context';
import { EstimateContext } from './agents/estimate-context';
import { getMaterialInfo, calculateMaterialCost, estimateProcessingTime } from './utils/material-database';

export async function POST(request: NextRequest) {
  try {
    // リクエストボディの解析
    const body = await request.json();
    
    // リクエストの検証
    const { message, agentId, conversationHistory, blueprintInfo }: ChatRequest = validateChatRequest(body);
    
    // エージェント別コンテキスト情報を構築
    let context: ManufacturingContext | EstimateContext;
    
    if (agentId === 'estimate') {
      // 見積もりエージェント用コンテキスト
      context = {
        blueprintInfo,
        estimateType: 'detailed', // デフォルト
        quantity: 1,
        previousEstimates: []
      } as EstimateContext;
      
      // 材料情報があれば追加データを付与
      if (blueprintInfo?.material) {
        const materialInfo = getMaterialInfo(blueprintInfo.material);
        if (materialInfo) {
          contextualMessage += `\n\n材料情報:\n- 材質: ${materialInfo.name}\n- 密度: ${materialInfo.density}g/cm³\n- 概算価格: ${materialInfo.pricePerKg}円/kg\n- 特性: ${JSON.stringify(materialInfo.properties, null, 2)}`;
        }
      }
    } else {
      // 一般エージェント用コンテキスト
      context = {
        blueprintInfo,
        previousQuestions: conversationHistory?.map(msg => msg.content).filter(content => content.length > 0) || [],
        userPreferences: {
          experienceLevel: 'intermediate',
          preferredUnits: 'metric',
          industryFocus: ['machinery', 'manufacturing']
        }
      } as ManufacturingContext;
    }
    
    // エージェント別プロンプト取得（コンテキスト強化）
    const systemPrompt = getEnhancedPrompt(agentId, message, context);
    
    // 図面情報がある場合は追加コンテキストを作成
    let contextualMessage = message;
    if (blueprintInfo) {
      contextualMessage = `
図面情報：
- 図面ID: ${blueprintInfo.id}
- 図面名: ${blueprintInfo.name}
- 材質: ${blueprintInfo.material}
- 顧客名: ${blueprintInfo.customerName}
- 製品名: ${blueprintInfo.productName}

質問: ${message}`;
    }

    // OpenAI API呼び出し
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...(conversationHistory || []),
        { role: 'user', content: contextualMessage }
      ],
      temperature: TEMPERATURE,
    });

    const aiResponse = response.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from OpenAI API');
    }

    const chatResponse: ChatResponse = {
      response: aiResponse,
      agentId,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(chatResponse);
    
  } catch (error) {
    console.error('Chat API error:', error);
    
    // エラーの種類に応じてステータスコードを設定
    if (error instanceof Error) {
      if (error.message.includes('Message is required') || 
          error.message.includes('AgentId is required') ||
          error.message.includes('Invalid agentId') ||
          error.message.includes('Message is too long')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'OpenAI API configuration error' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}