"use client";

import React, { forwardRef } from 'react';
import { Message } from "../../types/types";
import { User } from "lucide-react";
import { cn } from '@/lib/utils';
import { AIAgentConfig } from '../../types/types';

interface ChatMessageProps {
  message: Message;
  agentConfig: AIAgentConfig;
}

const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(({ message, agentConfig }, ref) => {
  const isUser = message.sender === 'user';
  const isAI = message.sender === 'ai';
  const isWelcome = message.type === 'welcome';
  const AgentIcon = agentConfig.icon;
  
  return (
    <div 
      ref={ref}
      className={cn(
        "flex items-start gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* AIアバター */}
      {isAI && (
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
          style={{ backgroundColor: agentConfig.color }}
        >
          <AgentIcon className="w-4 h-4 text-white" />
        </div>
      )}
      
      {/* メッセージとタイムスタンプコンテナ */}
      <div className="flex flex-col max-w-[80%]">
        {/* メッセージバブル */}
        <div className={cn(
          "rounded-lg px-4 py-2",
          isAI ? "bg-muted text-foreground" : "bg-primary text-primary-foreground",
          isWelcome && "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
        )}>
          {message.isTyping ? (
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          ) : (
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </div>
          )}
        </div>
        
        {/* タイムスタンプ */}
        <div className={cn(
          "text-xs opacity-70 mt-1 px-1",
          isUser ? "text-right" : "text-left"
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {/* ユーザーアバター */}
      {isUser && (
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;