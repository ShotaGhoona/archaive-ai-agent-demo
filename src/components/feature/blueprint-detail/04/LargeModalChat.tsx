"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Bot, X, Minimize2, Maximize2 } from "lucide-react";
import { Message } from "./types";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ChatSidebar from "./ChatSidebar";

interface LargeModalChatProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onSendMessage: (message: string) => void;
  onQuickAction?: (action: string) => void;
  isLoading: boolean;
  blueprintInfo: {
    image: string;
    name: string;
    customerName: string;
    productName: string;
    material: string;
  };
}

export default function LargeModalChat({ 
  isOpen, 
  onClose, 
  messages, 
  onSendMessage, 
  onQuickAction,
  isLoading,
  blueprintInfo
}: LargeModalChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ESCキーとキーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      // ボディスクロール無効化
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* オーバーレイ */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* モーダル */}
      <div
        className={`
          fixed z-50 bg-background border border-border rounded-xl shadow-2xl
          transform transition-all duration-400 ease-out
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
        style={{
          left: '2.5vw',
          top: '2.5vh',
          width: '95vw',
          height: '95vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">AI アシスタント</h1>
              <p className="text-sm text-muted-foreground">
                {blueprintInfo.productName} - 詳細相談モード
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              title="最小化"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              title="最大化"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              title="閉じる (Esc)"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* メインコンテンツエリア */}
        <div className="flex h-[calc(95vh-73px)]"> {/* ヘッダー分を引く */}
          {/* 左側: チャットエリア (70%) */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* メッセージエリア */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Bot className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">AI アシスタントへようこそ</h2>
                  <p className="text-muted-foreground max-w-lg mb-6 leading-relaxed">
                    大画面モードで図面について詳しく相談できます。
                    技術的な質問、加工方法、材質について何でもお聞きください。
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium">💡 サンプル質問</p>
                      <p className="text-muted-foreground">この材質の加工手順は？</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium">🔧 技術相談</p>
                      <p className="text-muted-foreground">強度計算の方法を教えて</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium">📐 寸法確認</p>
                      <p className="text-muted-foreground">公差の設定について</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium">🏭 製造工程</p>
                      <p className="text-muted-foreground">最適な加工順序は？</p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* 入力エリア */}
            <ChatInput 
              onSendMessage={onSendMessage}
              onQuickAction={onQuickAction}
              disabled={isLoading} 
            />
          </div>

          {/* 右側: サイドバー (30%) */}
          <div className="w-80 border-l border-border">
            <ChatSidebar
              blueprintImage={blueprintInfo.image}
              blueprintName={blueprintInfo.name}
              blueprintInfo={{
                customerName: blueprintInfo.customerName,
                productName: blueprintInfo.productName,
                material: blueprintInfo.material
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}