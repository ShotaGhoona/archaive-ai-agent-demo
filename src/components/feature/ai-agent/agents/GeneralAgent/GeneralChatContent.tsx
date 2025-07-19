"use client";

import React, { useEffect, useRef } from 'react';
import { AgentContentProps } from '../../types/types';
import ChatMessage from '../../shared/components/ChatMessage';
import TypingIndicator from '../../shared/components/TypingIndicator';

const GeneralChatContent: React.FC<AgentContentProps> = ({ 
  messages, 
  isLoading, 
  agentConfig 
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const welcomeMessage = {
    id: 'welcome',
    content: agentConfig.welcomeMessage || 'ARCHAIVE AIエージェントへようこそ。なんでもお聞きください。',
    sender: 'ai' as const,
    timestamp: new Date(),
    type: 'welcome' as const
  };

  const displayMessages = messages.length === 0 ? [welcomeMessage] : messages;

  // 新しいメッセージが追加されたら自動スクロール
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end' 
      });
    }
  }, [displayMessages, isLoading]);

  return (
    <div 
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 scroll-smooth"
      style={{ 
        maxHeight: '100%',
        scrollBehavior: 'smooth'
      }}
    >
      {displayMessages.map((message, index) => (
        <ChatMessage 
          key={message.id} 
          message={message} 
          agentConfig={agentConfig}
          ref={index === displayMessages.length - 1 ? lastMessageRef : undefined}
        />
      ))}
      {isLoading && (
        <div ref={lastMessageRef}>
          <TypingIndicator agentColor={agentConfig.color} agentIcon={agentConfig.icon} />
        </div>
      )}
    </div>
  );
};

export default GeneralChatContent;