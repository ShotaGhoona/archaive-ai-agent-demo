"use client";

import { useState } from "react";
import { Button, Input, Popover, PopoverContent, PopoverTrigger } from "@/shared/shadcnui";
import { 
  Send, 
  Plus
} from "lucide-react";
import { AIAgentConfig } from '../../types/types';
import TroublePopover from './TroublePopover';
import AttachedFilePreview from '../../shared/components/AttachedFilePreview';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onQuickAction?: (action: string) => void;
  onFileAttach?: (file: File) => void;
  disabled?: boolean;
  agentConfig: AIAgentConfig;
  isFirstVisit?: boolean;
  attachedFile?: File | null;
  onRemoveAttachment?: () => void;
}

export default function ChatInput({ 
  onSendMessage, 
  onFileAttach,
  disabled = false, 
  agentConfig,
  attachedFile,
  onRemoveAttachment
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

  // カコトラAI専用のPopoverContent
  const renderPopoverContent = () => {
    return (
      <TroublePopover 
        onClose={() => setIsPopoverOpen(false)}
        onFileAttach={onFileAttach}
      />
    );
  };

  return (
    <div className="p-4 border-t border-border bg-background">
      {/* 一時的な添付ファイル表示 */}
      {attachedFile && (
        <AttachedFilePreview 
          file={attachedFile} 
          onRemove={() => onRemoveAttachment?.()} 
        />
      )}
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        {/* カコトラAI専用+ボタン */}
        <Popover 
          open={isPopoverOpen}
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
            {renderPopoverContent()}
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