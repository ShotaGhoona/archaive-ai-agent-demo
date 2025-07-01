"use client";

import { Message } from "./types";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex gap-4 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* アバター */}
      <div className={`
        flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
        ${isUser ? 'bg-primary' : 'bg-muted'}
      `}>
        {isUser ? (
          <User className="w-5 h-5 text-primary-foreground" />
        ) : (
          <Bot className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
      
      {/* メッセージバブル */}
      <div className={`
        max-w-[80%] px-5 py-3 rounded-2xl
        ${isUser 
          ? 'bg-primary text-primary-foreground rounded-br-md' 
          : 'bg-muted text-foreground rounded-bl-md'
        }
      `}>
        {message.isTyping ? (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce opacity-60"></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.2s' }}></div>
          </div>
        ) : (
          <p className="leading-relaxed">{message.content}</p>
        )}
      </div>
    </div>
  );
}