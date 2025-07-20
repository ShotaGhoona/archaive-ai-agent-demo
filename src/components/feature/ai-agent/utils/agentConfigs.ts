"use client";

import { 
  MessageCircle, Calculator, HelpCircle,
  BookOpen, Settings, FileText, Search,
  Package, DollarSign, Clock, TrendingUp
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
    welcomeMessage: 'ARCHAIVE AIエージェントへようこそ。なんでもお聞きください。',
    quickActions: []
  },
  estimate: {
    id: 'estimate',
    name: '見積もりAI',
    icon: Calculator,
    description: '図面から見積もりを自動生成',
    color: '#10b981',
    category: AgentCategory.ESTIMATE,
    welcomeMessage: '図面ファイルをアップロードして見積もりを開始してください',
    defaultInput: 'この図面の見積もりを開始してください',
    quickActions: []
  },
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

/**
 * カテゴリーに基づいてエージェントを取得
 */
export const getAgentsByCategory = (category: AgentCategory): AIAgentConfig[] => {
  return Object.values(availableAgents).filter(agent => agent.category === category);
};

/**
 * 動的にエージェントを追加
 */
export const registerAgent = (agent: AIAgentConfig): void => {
  availableAgents[agent.id] = agent;
};

/**
 * 全てのエージェントを取得
 */
export const getAllAgents = (): AIAgentConfig[] => {
  return Object.values(availableAgents);
};