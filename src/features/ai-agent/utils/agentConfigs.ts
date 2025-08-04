"use client";

import { 
  MessageCircle, Calculator, Bug
} from 'lucide-react';
import { AIAgentConfig, AgentCategory } from '../types/types';

// エージェント定義
export const availableAgents: Record<string, AIAgentConfig> = {
  general: {
    id: 'general',
    name: 'なんでもAI',
    icon: MessageCircle,
    description: '一般的な相談・質問に対応',
    color: '#3b82f6',
    category: AgentCategory.GENERAL,
    welcomeMessage: 'ARCHAIVE AIエージェントへようこそ。なんでもお聞きください。'
  },
  estimate: {
    id: 'estimate',
    name: '見積もりAI',
    icon: Calculator,
    description: 'プロのコストエンジニアが図面を分析して精密見積もり',
    color: '#10b981',
    category: AgentCategory.ESTIMATE,
    welcomeMessage: 'こんにちは！図面をアップロードしていただければ、詳細な見積もりを作成いたします。製造上のリスクや最適化提案もお任せください！',
    defaultInput: 'この図面の見積もりをお願いします'
  },
  trouble: {
    id: 'trouble',
    name: 'カコトラAI',
    icon: Bug,
    description: '製造上のトラブルを解決',
    color: '#ef4444',
    category: AgentCategory.TROUBLE,
    welcomeMessage: '製造上のトラブルを解決します。'
  }
};

/**
 * 指定されたエージェントIDからエージェント設定を取得
 */
export const getAgentConfig = (agentId: string): AIAgentConfig | null => {
  return availableAgents[agentId] || null;
};

/**
 * 複数のエージェントIDからエージェント設定配列を取得
 */
export const getAgentConfigs = (agentIds: string[]): AIAgentConfig[] => {
  return agentIds
    .map(id => availableAgents[id])
    .filter(agent => agent !== undefined);
};

