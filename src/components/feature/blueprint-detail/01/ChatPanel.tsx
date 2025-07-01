"use client";

import { useEffect, useRef } from "react";
import { Message } from "./types";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatPanelProps {
  isOpen: boolean;
  messages: Message[];
  onSendMessage: (message: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

export default function ChatPanel({ isOpen, messages, onSendMessage, onClose, isLoading }: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className={`
      fixed right-0 top-[45px] h-[calc(100vh-45px)] w-1/4 min-w-[320px] bg-background shadow-2xl z-40
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      flex flex-col border-l border-border
    `}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">AI アシスタント</h3>
            <p className="text-sm text-muted-foreground">図面について何でもお聞きください</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center text-muted-foreground mt-8">
              <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg font-bold">ARCHAIVE AI チャット</p>
              <p className="text-sm mt-2">図面について何でもお聞きください</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 入力エリア */}
      <ChatInput 
        onSendMessage={onSendMessage} 
        onQuickAction={(action) => {
          // クイックアクション処理（ダミー）
          const actionMessage = `${action}アクションが実行されました`;
          onSendMessage(actionMessage);
        }}
        disabled={isLoading} 
      />
    </div>
  );
}