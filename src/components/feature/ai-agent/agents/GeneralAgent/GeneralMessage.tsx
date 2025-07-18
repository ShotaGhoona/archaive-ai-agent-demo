"use client";

import React from 'react';
import { AgentMessageProps } from '../../types';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

const GeneralMessage: React.FC<AgentMessageProps> = ({ message, agentConfig }) => {
  const isAI = message.sender === 'ai';
  const isWelcome = message.type === 'welcome';

  return (
    <div className={cn(
      "flex items-start gap-3",
      isAI ? "justify-start" : "justify-end"
    )}>
      {isAI && (
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
          style={{ backgroundColor: agentConfig.color }}
        >
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[80%] rounded-lg px-4 py-2",
        isAI ? "bg-muted text-foreground" : "bg-primary text-primary-foreground",
        isWelcome && "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
      )}>
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
        <div className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {!isAI && (
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
};

export default GeneralMessage;