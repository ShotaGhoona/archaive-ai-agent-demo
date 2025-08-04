"use client";

import { forwardRef, useRef, useImperativeHandle, lazy, Suspense } from "react";
import { ChatLayoutState, Message, AIAgentConfig } from "../../types/types";
import ChatHeader from "../components/ChatHeader";

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
        ChatContent: lazy(() => import('../../agents/TroubleAgent/ChatContent')),
        ChatInput: lazy(() => import('../../agents/TroubleAgent/ChatInput'))
      };
    case 'estimate':
      return {
        ChatContent: lazy(() => import('../../agents/EstimateAgent/ChatContent')),
        ChatInput: lazy(() => import('../../agents/EstimateAgent/ChatInput'))
      };
    case 'general':
      return {
        ChatContent: lazy(() => import('../../agents/GeneralAgent/ChatContent')),
        ChatInput: lazy(() => import('../../agents/GeneralAgent/ChatInput'))
      };
    default:
      // Fallback to shared components
      return {
        ChatContent: lazy(() => import('../components/ChatContent')),
        ChatInput: lazy(() => import('../components/ChatInput'))
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
          <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
            <ChatContent
              messages={messages}
              isLoading={isLoading}
              agentConfig={agentConfig as AIAgentConfig}
            />
          </Suspense>
        )}
      </div>
      
      {agentInput || (
        <Suspense fallback={<div className="p-4">Loading input...</div>}>
          <ChatInput
            onSendMessage={onSendMessage}
            onQuickAction={onQuickAction}
            disabled={isLoading}
            agentConfig={agentConfig as AIAgentConfig}
          />
        </Suspense>
      )}
    </div>
  );
});

SidebarLayout.displayName = "SidebarLayout";

export default SidebarLayout;