"use client";

import { forwardRef, useRef, useImperativeHandle } from "react";
import { ChatLayoutState, Message } from "../../types/types";
import ChatHeader from "../components/ChatHeader";
import ChatContent from "../components/ChatContent";
import ChatInput from "../components/ChatInput";

interface SidebarLayoutProps {
  messages: Message[];
  isLoading: boolean;
  onLayoutChange: (layout: ChatLayoutState) => void;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  onQuickAction: (action: string) => void;
  selectedAgent?: string | null;
  agentConfig?: any;
  agentContent?: React.ReactNode;
  agentInput?: React.ReactNode;
}

export interface SidebarLayoutRef {
  getElement: () => HTMLDivElement | null;
}

const SidebarLayout = forwardRef<SidebarLayoutRef, SidebarLayoutProps>(({
  messages,
  isLoading,
  onLayoutChange,
  onClose,
  onSendMessage,
  onQuickAction,
  selectedAgent,
  agentConfig,
  agentContent,
  agentInput
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    getElement: () => containerRef.current
  }));

  return (
    <div
      ref={containerRef}
      className="fixed right-0 top-0 w-96 h-screen z-40 bg-background border-l border-border shadow-lg flex flex-col"
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
          />
        )}
      </div>
      
      {agentInput || (
        <ChatInput
          onSendMessage={onSendMessage}
          onQuickAction={onQuickAction}
          disabled={isLoading}
          agentConfig={agentConfig}
        />
      )}
    </div>
  );
});

SidebarLayout.displayName = "SidebarLayout";

export default SidebarLayout;