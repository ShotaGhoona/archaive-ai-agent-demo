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

interface SidebarLayoutProps {
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

export interface SidebarLayoutRef {
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

const SidebarLayout = forwardRef<SidebarLayoutRef, SidebarLayoutProps>(({
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
    <div
      ref={containerRef}
      className="fixed right-0 top-0 w-96 h-screen z-50 bg-background border-l border-border shadow-lg flex flex-col"
      style={{ height: 'calc(100vh - 45px)', top: '45px' }}
    >
      <ChatHeader
        currentLayout={ChatLayoutState.SIDEBAR}
        onLayoutChange={onLayoutChange}
        onClose={onClose}
      />
      
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
      
      {agentInput || (
        <ChatInput
          onSendMessage={onSendMessage}
          onQuickAction={onQuickAction}
          disabled={isLoading}
          agentConfig={agentConfig as AIAgentConfig}
        />
      )}
    </div>
  );
});

SidebarLayout.displayName = "SidebarLayout";

export default SidebarLayout;