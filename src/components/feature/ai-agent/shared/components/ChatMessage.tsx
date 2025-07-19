"use client";

import React, { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
            <div className="text-sm leading-relaxed">
              {isAI ? (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({children}) => <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0">{children}</h1>,
                    h2: ({children}) => <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
                    h3: ({children}) => <h3 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h3>,
                    p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({children}) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                    li: ({children}) => <li className="ml-2">{children}</li>,
                    strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                    em: ({children}) => <em className="italic">{children}</em>,
                    code: ({children}) => <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                    pre: ({children}) => <pre className="bg-muted p-3 rounded mt-2 mb-2 overflow-x-auto text-xs font-mono">{children}</pre>,
                    blockquote: ({children}) => <blockquote className="border-l-4 border-muted-foreground/20 pl-4 my-2 italic">{children}</blockquote>,
                    hr: () => <hr className="my-4 border-muted-foreground/20" />,
                    a: ({href, children}) => <a href={href} className="text-primary underline hover:no-underline" target="_blank" rel="noopener noreferrer">{children}</a>
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              ) : (
                <div className="whitespace-pre-wrap">{message.content}</div>
              )}
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