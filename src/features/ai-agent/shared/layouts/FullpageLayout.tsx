"use client";

import { forwardRef, useRef, useImperativeHandle } from "react";
import { ChatLayoutState, Message, AIAgentConfig } from "../../types/types";
import ChatHeader from "../components/ChatHeader";

// エージェント別コンポーネントを事前インポート
import TroubleAgentChatContent from '../../agents/TroubleAgent/ChatContent';
import TroubleAgentChatInput from '../../agents/TroubleAgent/ChatInput';
import EstimateAgentChatContent from '../../agents/EstimateAgent/ChatContent';
import EstimateAgentChatInput from '../../agents/EstimateAgent/ChatInput';
import GeneralAgentChatContent from '../../agents/GeneralAgent/ChatContent';
import GeneralAgentChatInput from '../../agents/GeneralAgent/ChatInput';

interface FullpageLayoutProps {
  messages: Message[];
  isLoading: boolean;
  onLayoutChange: (layout: ChatLayoutState) => void;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  onQuickAction: (action: string) => void;
  selectedAgent?: string | null;
  agentConfig?: unknown;
  agentContent?: React.ReactNode;
  agentInput?: React.ReactNode;
}

export interface FullpageLayoutRef {
  getElement: () => HTMLDivElement | null;
}

// Helper function to get agent-specific components
const getAgentComponents = (agentId: string) => {
  switch (agentId) {
    case 'trouble':
      return {
        ChatContent: TroubleAgentChatContent,
        ChatInput: TroubleAgentChatInput
      };
    case 'estimate':
      return {
        ChatContent: EstimateAgentChatContent,
        ChatInput: EstimateAgentChatInput
      };
    case 'general':
      return {
        ChatContent: GeneralAgentChatContent,
        ChatInput: GeneralAgentChatInput
      };
    default:
      return {
        ChatContent: TroubleAgentChatContent,
        ChatInput: TroubleAgentChatInput
      };
  }
};

const FullpageLayout = forwardRef<FullpageLayoutRef, FullpageLayoutProps>(({
  messages,
  isLoading,
  onLayoutChange,
  onClose,
  onSendMessage,
  onQuickAction,
  agentConfig,
  agentContent,
  agentInput
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    getElement: () => containerRef.current
  }));

  // Get agent-specific components
  const agentId = (agentConfig as AIAgentConfig)?.id || '';
  const { ChatContent, ChatInput } = getAgentComponents(agentId);

  return (
    <>
      {/* バックドロップ */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* モーダルコンテンツ */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-55 flex items-center justify-center p-4"
      >
        <div 
          className="bg-background rounded-lg shadow-2xl border border-border overflow-hidden flex"
          style={{ width: '80vw', height: '80vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* メインチャット領域 */}
          <div className="flex-1 flex flex-col">
            {/* ヘッダー */}
            <ChatHeader
              currentLayout={ChatLayoutState.FULLPAGE}
              onLayoutChange={onLayoutChange}
              onClose={onClose}
              title={(agentConfig as { name?: string })?.name ? `${(agentConfig as { name: string }).name} Assistant` : "AI Assistant"}
            />
            
            {/* チャット内容 */}
            <div className="flex-1 overflow-hidden">
              {agentContent || (
                <ChatContent
                  messages={messages}
                  isLoading={isLoading}
                  onSendMessage={onSendMessage}
                  agentConfig={agentConfig as AIAgentConfig}
                />
              )}
            </div>
            
            {/* 入力エリア */}
            {agentInput || (
              <ChatInput
                onSendMessage={onSendMessage}
                onQuickAction={onQuickAction}
                disabled={isLoading}
                agentConfig={agentConfig as AIAgentConfig}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
});

FullpageLayout.displayName = "FullpageLayout";

export default FullpageLayout;