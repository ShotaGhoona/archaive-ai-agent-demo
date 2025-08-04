"use client";

import { useState } from "react";
import { Button, Input } from "@/shared/shadcnui";
import { Send } from "lucide-react";
import { AIAgentConfig } from '../../types/types';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  agentConfig: AIAgentConfig;
}

export default function ChatInput({ 
  onSendMessage, 
  disabled = false, 
  agentConfig
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 border-t border-border bg-background">
      <form onSubmit={handleSubmit} className="flex gap-2">
        {/* メッセージ入力 */}
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="検索したい情報を入力してください..."
          disabled={disabled}
          className="flex-1"
        />

        {/* 送信ボタン */}
        <Button 
          type="submit" 
          size="icon"
          disabled={!inputValue.trim() || disabled}
          style={{ backgroundColor: agentConfig.color }}
          className="hover:opacity-90 text-white flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}