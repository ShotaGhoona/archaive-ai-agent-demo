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
  Plus, 
  Upload, 
  Search, 
  Calculator, 
  FileText, 
  Camera,
  Paperclip
} from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onQuickAction?: (action: string) => void;
  disabled?: boolean;
}

const quickActions = [
  { id: 'upload', label: '図面をアップロード', icon: Upload },
  { id: 'search', label: '類似図面検索', icon: Search },
  { id: 'calculate', label: '寸法計算', icon: Calculator },
  { id: 'export', label: '図面エクスポート', icon: FileText },
  { id: 'photo', label: '写真を撮る', icon: Camera },
  { id: 'attach', label: 'ファイル添付', icon: Paperclip },
];

export default function ChatInput({ onSendMessage, onQuickAction, disabled = false }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
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

  const handleQuickAction = (actionId: string) => {
    setIsPopoverOpen(false);
    onQuickAction?.(actionId);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-border bg-background">
      {/* プラスボタン（ポップオーバー） */}
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
          className="w-56 p-2"
          sideOffset={8}
        >
          <div className="grid gap-1">
            <div className="text-sm font-medium text-muted-foreground mb-2 px-2">
              クイックアクション
            </div>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuickAction(action.id)}
                  className="justify-start gap-2 h-8"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

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
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}