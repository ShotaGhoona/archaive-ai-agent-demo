import { LucideIcon } from 'lucide-react';

// 05の型定義を継承
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
  type?: 'welcome' | 'error' | 'system' | 'normal';
}

export enum ChatLayoutState {
  FLOATING = 'floating',
  SIDEBAR = 'sidebar', 
  FULLPAGE = 'fullpage'
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}


// 06新規追加 - AI エージェント関連型定義
export enum AgentCategory {
  GENERAL = 'general',
  ESTIMATE = 'estimate',
  TROUBLE = 'trouble'
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
}

// ChatUIManager のプロパティ
export interface ChatUIManagerProps {
  availableAgents: string[];
}

// 06用拡張ChatUIState
export interface ChatUIState {
  layoutState: ChatLayoutState;
  isOpen: boolean;
  position: Position;
  size: Size;
  messages: Message[];
  isLoading: boolean;
  selectedAgent: string | null;
  agentConfig: AIAgentConfig | null;
  selectorOpen: boolean;
  availableAgents: AIAgentConfig[];
}


// エージェント別コンポーネント用プロパティ
export interface AgentContentProps {
  messages: Message[];
  isLoading: boolean;
  onQuickMessage?: (message: string) => void;
  onFileUpload?: (file: File, message: string) => void;
  agentConfig: AIAgentConfig;
}

export interface AgentInputProps {
  onSendMessage: (message: string) => void;
  onQuickAction?: (action: string) => void;
  disabled?: boolean;
  agentConfig: AIAgentConfig;
}

export interface AgentMessageProps {
  message: Message;
  agentConfig: AIAgentConfig;
}

// エージェント選択UI用
export interface AgentSelectorProps {
  isOpen: boolean;
  agents: AIAgentConfig[];
  onSelect: (agentId: string) => void;
  onClose: () => void;
  position: Position;
}

export interface AgentSelectorItemProps {
  agent: AIAgentConfig;
  position: Position;
  index: number;
  isOpen: boolean;
  onSelect: (agentId: string) => void;
}