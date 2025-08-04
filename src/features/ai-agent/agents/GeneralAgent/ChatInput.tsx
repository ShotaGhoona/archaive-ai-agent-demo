"use client";

import { useState } from "react";
import { Button, Input, Popover, PopoverContent, PopoverTrigger } from "@/shared/shadcnui";
import { 
  Send, 
  Plus
} from "lucide-react";
import { AIAgentConfig } from '../../types/types';
import GeneralPopover from './GeneralPopover';
import AttachedFilePreview from '../../shared/components/AttachedFilePreview';
import SessionImagePreview from '../../shared/components/SessionImagePreview';

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

  // GeneralAgent専用のPopoverContent
  const renderPopoverContent = () => {
    return (
      <GeneralPopover 
        onFileAttach={(file) => {
          onFileAttach?.(file);
          setIsPopoverOpen(false);
        }}
      />
    );
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
        {/* GeneralAgent用+ボタン */}
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