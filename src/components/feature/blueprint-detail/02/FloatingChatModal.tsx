"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Bot, X, GripVertical } from "lucide-react";
import { Message } from "./types";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useDraggable } from "./hooks/useDraggable";
import { useResizable } from "./hooks/useResizable";

interface FloatingChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onSendMessage: (message: string) => void;
  onQuickAction?: (action: string) => void;
  isLoading: boolean;
}

export default function FloatingChatModal({ 
  isOpen, 
  onClose, 
  messages, 
  onSendMessage, 
  onQuickAction,
  isLoading 
}: FloatingChatModalProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 初期位置（右下付近）
  const initialPosition = {
    x: typeof window !== 'undefined' ? window.innerWidth - 450 : 0,
    y: 100
  };

  const { position, isDragging, dragHandlers } = useDraggable({
    initialPosition,
    disabled: !isOpen
  });

  const { size, isResizing, resizeHandlers } = useResizable({
    initialSize: { width: 400, height: 700 },
    minSize: { width: 300, height: 400 },
    maxSize: { width: 800, height: 900 },
    disabled: !isOpen
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* オーバーレイ */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      
      {/* モーダル */}
      <div
        className={`
          fixed bg-background border border-border rounded-lg shadow-2xl z-50
          flex flex-col overflow-hidden
          ${isDragging ? 'cursor-grabbing select-none shadow-2xl' : ''}
          ${isResizing ? 'select-none' : ''}
        `}
        style={{
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
          transform: 'translate(0, 0)', // GPU加速
        }}
      >
        {/* ヘッダー（ドラッグハンドル） */}
        <div 
          className={`
            flex items-center justify-between p-4 border-b border-border bg-muted/50
            ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          `}
          {...dragHandlers}
        >
          <div className="flex items-center gap-3">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
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
          onQuickAction={onQuickAction}
          disabled={isLoading} 
        />

        {/* リサイズハンドル */}
        <div
          className={`
            absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize
            bg-gradient-to-tl from-muted-foreground/30 to-transparent
            hover:from-muted-foreground/50
            ${isResizing ? 'from-primary/50' : ''}
          `}
          style={{
            background: `linear-gradient(-45deg, transparent 0%, transparent 40%, currentColor 40%, currentColor 60%, transparent 60%)`
          }}
          {...resizeHandlers}
        />
      </div>
    </>
  );
}