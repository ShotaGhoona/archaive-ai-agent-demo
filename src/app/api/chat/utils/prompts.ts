import { generalAgentPrompt } from '../agents/general';
import { estimateAgentPrompt } from '../agents/estimate';
import { enhanceGeneralPrompt, ManufacturingContext, getQuestionContext } from '../agents/general-context';
import { enhanceEstimatePrompt, EstimateContext, getEstimateQuestionContext } from '../agents/estimate-context';

export function getAgentPrompt(agentId: string, context?: ManufacturingContext | EstimateContext): string {
  switch (agentId) {
    case 'general':
      return context ? enhanceGeneralPrompt(generalAgentPrompt, context as ManufacturingContext) : generalAgentPrompt;
    case 'estimate':
      return context ? enhanceEstimatePrompt(estimateAgentPrompt, context as EstimateContext) : estimateAgentPrompt;
    default:
      return generalAgentPrompt;
  }
}

export function getEnhancedPrompt(agentId: string, userMessage: string, context?: ManufacturingContext | EstimateContext): string {
  let basePrompt = getAgentPrompt(agentId, context);

  // エージェント別のクイックアクション処理
  if (agentId === 'general') {
    const questionContext = getQuestionContext(userMessage);
    if (questionContext) {
      basePrompt += `\n\n## 質問コンテキスト\n${questionContext}\n`;
    }
  } else if (agentId === 'estimate') {
    const estimateContext = getEstimateQuestionContext(userMessage);
    if (estimateContext.context) {
      basePrompt += `\n\n## 見積もりコンテキスト\n${estimateContext.context}\n`;
      basePrompt += `## 見積もりタイプ\n${estimateContext.estimateType}\n`;
    }
  }

  return basePrompt;
}