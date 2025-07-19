"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Send, 
  Plus
} from "lucide-react";
import { AIAgentConfig } from '../../types/types';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onQuickAction?: (action: string) => void;
  disabled?: boolean;
  agentConfig: AIAgentConfig;
}

export default function ChatInput({ onSendMessage, onQuickAction, disabled = false, agentConfig }: ChatInputProps) {
  const [inputValue, setInputValue] = useState(agentConfig.defaultInput || "");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

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

  const handleQuickAction = (actionText: string) => {
    setIsPopoverOpen(false);
    onQuickAction?.(actionText);
  };

  // エージェント別quickActions取得
  const quickActions = agentConfig.quickActions || [];

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-border bg-background">
      {/* プラスボタン（ポップオーバー） */}
      {quickActions.length > 0 && (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={disabled}
              className="flex-shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            side="top" 
            align="start" 
            className="w-80 p-4"
            sideOffset={8}
          >
            <div className="mb-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                {agentConfig.name}のクイックアクション
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickAction(action.action)}
                    className="justify-start gap-2 h-auto py-2"
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm text-left">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* メッセージ入力 */}
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="メッセージを入力..."
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
  );
}