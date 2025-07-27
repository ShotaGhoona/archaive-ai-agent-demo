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
import EstimatePopover from '../../agents/EstimateAgent/EstimatePopover';
import GeneralPopover from '../../agents/GeneralAgent/GeneralPopover';
import AttachedFilePreview from './AttachedFilePreview';
import SessionImagePreview from './SessionImagePreview';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onQuickAction?: (action: string) => void;
  onFileAttach?: (file: File) => void;
  disabled?: boolean;
  agentConfig: AIAgentConfig;
  isFirstVisit?: boolean;
  attachedFile?: File | null;
  onRemoveAttachment?: () => void;
  sessionImage?: File | null;
  onRemoveSessionImage?: () => void;
}

export default function ChatInput({ 
  onSendMessage, 
  onFileAttach,
  disabled = false, 
  agentConfig,
  isFirstVisit = false,
  attachedFile,
  onRemoveAttachment,
  sessionImage,
  onRemoveSessionImage
}: ChatInputProps) {
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

  // 🎯 エージェント別PopoverContent
  const renderPopoverContent = (agentId: string) => {
    switch (agentId) {
      case 'estimate':
        return (
          <EstimatePopover 
            onFileAttach={(file) => {
              onFileAttach?.(file);
              setIsPopoverOpen(false);
            }}
            onClose={() => setIsPopoverOpen(false)}
          />
        );
      case 'general':
        return (
          <GeneralPopover 
            onFileAttach={(file) => {
              onFileAttach?.(file);
              setIsPopoverOpen(false);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 border-t border-border bg-background">
      {/* セッション画像表示（継続参照可能） */}
      {sessionImage && (
        <SessionImagePreview 
          file={sessionImage} 
          onRemove={() => onRemoveSessionImage?.()} 
        />
      )}
      
      {/* 一時的な添付ファイル表示 */}
      {attachedFile && (
        <AttachedFilePreview 
          file={attachedFile} 
          onRemove={() => onRemoveAttachment?.()} 
        />
      )}
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        {/* 🎯 統一+ボタン（エージェント別ポップオーバー） */}
        <Popover 
          open={isPopoverOpen || (agentConfig.id === 'estimate' && isFirstVisit)}
          onOpenChange={setIsPopoverOpen}
        >
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
          <PopoverContent side="top" className="p-2 w-auto">
            {renderPopoverContent(agentConfig.id)}
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
        style={{ backgroundColor: agentConfig.color }}
        className="hover:opacity-90 text-white flex-shrink-0"
      >
        <Send className="h-4 w-4" />
      </Button>
      </form>
    </div>
  );
}