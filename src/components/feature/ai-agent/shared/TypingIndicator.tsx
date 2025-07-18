"use client";

import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';

interface TypingIndicatorProps {
  agentColor?: string;
  agentIcon?: React.ComponentType<{ className?: string }>;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  agentColor = '#3b82f6',
  agentIcon: AgentIcon = Bot
}) => {
  return (
    <div className="flex gap-3 max-w-4xl mr-auto">
      {/* アバター */}
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarFallback 
          className="text-white"
          style={{ backgroundColor: agentColor }}
        >
          <AgentIcon className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>

      {/* タイピングインジケーター */}
      <div className="bg-muted rounded-lg p-3 max-w-xs">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-xs text-muted-foreground ml-2">入力中...</span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;