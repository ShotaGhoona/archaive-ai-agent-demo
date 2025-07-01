"use client";

import { forwardRef, useRef, useImperativeHandle } from "react";
import { ChatLayoutState, Message } from "../types";
import ChatHeader from "../shared/ChatHeader";
import ChatContent from "../shared/ChatContent";
import ChatInput from "../shared/ChatInput";

interface SidebarLayoutProps {
  messages: Message[];
  isLoading: boolean;
  onLayoutChange: (layout: ChatLayoutState) => void;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  onQuickAction: (action: string) => void;
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
  onQuickAction
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
      
      <ChatContent
        messages={messages}
        isLoading={isLoading}
      />
      
      <ChatInput
        onSendMessage={onSendMessage}
        onQuickAction={onQuickAction}
        disabled={isLoading}
      />
    </div>
  );
});

SidebarLayout.displayName = "SidebarLayout";

export default SidebarLayout;