"use client";

import { useEffect, useRef } from "react";
import { Message } from "../../types/types";
import ChatMessage from "./ChatMessage";

interface ChatContentProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ChatContent({ messages, isLoading }: ChatContentProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 bg-primary/20 rounded-full"></div>
          </div>
          <h3 className="font-medium text-foreground mb-2">AIアシスタントへようこそ</h3>
          <p className="text-sm text-muted-foreground">
            図面に関するご質問や技術的なサポートをお手伝いします。
            何でもお気軽にお聞きください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}