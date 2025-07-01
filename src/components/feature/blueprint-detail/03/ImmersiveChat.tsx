"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, User, X, Send, MapPin, Wrench, Ruler } from "lucide-react";
import { AnnotationPoint, Message } from "./types";

interface ImmersiveChatProps {
  isActive: boolean;
  annotation: AnnotationPoint | null;
  backgroundOpacity: number;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ImmersiveChat({ 
  isActive, 
  annotation, 
  backgroundOpacity, 
  onClose, 
  onSendMessage,
  isLoading 
}: ImmersiveChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [annotation?.conversations]);

  if (!isActive || !annotation) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get('message') as string;
    if (message.trim()) {
      onSendMessage(message.trim());
      e.currentTarget.reset();
    }
  };

  return (
    <div
      className={`
        fixed inset-0 z-50 transition-all duration-500
        ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      {/* 背景オーバーレイ */}
      <div 
        className="absolute inset-0 bg-black transition-opacity duration-500"
        style={{ opacity: 1 - backgroundOpacity }}
        onClick={onClose}
      />

      {/* メインチャットエリア */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div
          className={`
            w-full max-w-4xl h-full max-h-[80vh] bg-background rounded-2xl shadow-2xl
            border border-border overflow-hidden flex flex-col
            transform transition-all duration-500
            ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
          `}
        >
          {/* ヘッダー - 空間文脈カード */}
          <div className="p-6 bg-muted/50 border-b border-border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {annotation.context.description}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    図面上の特定箇所について詳しく説明します
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* 空間文脈情報 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 近くの要素 */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">周辺要素</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {annotation.context.nearbyElements.map((element, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {element}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 寸法情報 */}
              {annotation.context.dimensions && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Ruler className="w-4 h-4 text-primary" />
                      <span className="font-medium text-sm">寸法</span>
                    </div>
                    <p className="text-sm text-foreground">
                      {annotation.context.dimensions.width} × {annotation.context.dimensions.height}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* 材質情報 */}
              {annotation.context.materials && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 text-primary" />
                      <span className="font-medium text-sm">材質</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {annotation.context.materials.map((material, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* メッセージエリア */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {annotation.conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  この箇所について質問してください
                </h3>
                <p className="text-muted-foreground max-w-md">
                  選択した箇所の詳細情報、加工方法、材質について何でもお聞きください。
                  AIが図面の文脈を理解してお答えします。
                </p>
              </div>
            ) : (
              annotation.conversations.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* アバター */}
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                      ${message.sender === 'user' ? 'bg-primary' : 'bg-muted'}
                    `}
                  >
                    {message.sender === 'user' ? (
                      <User className="w-5 h-5 text-primary-foreground" />
                    ) : (
                      <Bot className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* メッセージ */}
                  <div
                    className={`
                      max-w-[70%] px-6 py-3 rounded-2xl
                      ${message.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted text-foreground rounded-bl-md'
                      }
                    `}
                  >
                    {message.isTyping ? (
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce opacity-60"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    ) : (
                      <p className="leading-relaxed">{message.content}</p>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 入力エリア */}
          <div className="p-6 border-t border-border bg-background">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                ref={inputRef}
                name="message"
                placeholder="この箇所について質問してください..."
                disabled={isLoading}
                className="flex-1 text-base"
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="px-6"
              >
                <Send className="h-4 w-4 mr-2" />
                送信
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}