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
  // process: {
  //   id: 'process',
  //   name: '工程生成AI',
  //   icon: GitBranch,
  //   description: '製造工程の最適化提案',
  //   color: '#f59e0b',
  //   category: AgentCategory.PROCESS,
  //   welcomeMessage: '製造工程の最適化をサポートします。',
  //   quickActions: [
  //     { id: 'optimize', label: '工程最適化', icon: GitBranch, action: '工程最適化' },
  //     { id: 'timeline', label: '作業時間見積もり', icon: MessageCircle, action: '作業時間見積もり' },
  //     { id: 'resources', label: '必要リソース', icon: MessageCircle, action: '必要リソース' }
  //   ]
  // },
  // inquiry: {
  //   id: 'inquiry',
  //   name: '問い合わせAI',
  //   icon: HelpCircle,
  //   description: 'よくある質問への迅速回答',
  //   color: '#ef4444',
  //   category: AgentCategory.INQUIRY,
  //   welcomeMessage: 'よくある質問からお選びください。',
  //   quickActions: [
  //     { id: 'delivery', label: '納期について', icon: MessageCircle, action: '納期について教えてください' },
  //     { id: 'pricing', label: '価格体系', icon: Calculator, action: '価格体系について知りたいです' },
  //     { id: 'materials', label: '対応可能な材料', icon: MessageCircle, action: '対応可能な材料について' },
  //     { id: 'quality', label: '品質管理', icon: MessageCircle, action: '品質管理について' }
  //   ]
  // }
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

