"use client";

import React from 'react';
import { AgentContentProps } from '../../types/types';
import GeneralMessage from './GeneralMessage';
import TypingIndicator from '../../shared/components/TypingIndicator';
import { MessageCircle } from 'lucide-react';

const GeneralChatContent: React.FC<AgentContentProps> = ({ 
  messages, 
  isLoading, 
  agentConfig 
}) => {
  const welcomeMessage = {
    id: 'welcome',
    content: 'ARCHAIVE AIエージェントへようこそ。なんでもお聞きください。',
    sender: 'ai' as const,
    timestamp: new Date(),
    type: 'welcome' as const
  };

  const displayMessages = messages.length === 0 ? [welcomeMessage] : messages;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {displayMessages.map((message) => (
        <GeneralMessage 
          key={message.id} 
          message={message} 
          agentConfig={agentConfig}
        />
      ))}
      {isLoading && <TypingIndicator agentColor="#3b82f6" agentIcon={MessageCircle} />}
    </div>
  );
};

export default GeneralChatContent;