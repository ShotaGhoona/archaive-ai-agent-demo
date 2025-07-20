"use client";

import React, { useState, useEffect, useRef } from 'react';
import { AgentContentProps } from '../../types/types';
import ChatMessage from '../../shared/components/ChatMessage';
import FileUploadArea from './FileUploadArea';
import { Button } from '@/components/ui/button';
import { FileImage, X } from 'lucide-react';

interface UploadedFile {
  file: File;
  preview?: string;
}

const EstimateChatContent: React.FC<AgentContentProps> = ({ 
  messages, 
  isLoading, 
  agentConfig,
  onFileUpload
}) => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFile({ file });
    console.log('Uploaded file:', file.name);
    
    // 親コンポーネントのファイルアップロードハンドラーを呼び出し
    if (onFileUpload) {
      onFileUpload(file, 'この図面の見積もりを開始してください');
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  // 新しいメッセージが追加されたら自動スクロール
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end' 
      });
    }
  }, [messages, isLoading]);

  // 初期状態：大きなファイルアップロード領域を表示
  if (!uploadedFile && messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">{agentConfig.name}</h2>
            <p className="text-muted-foreground">
              {agentConfig.welcomeMessage}
            </p>
          </div>
          <FileUploadArea
            onFileUpload={handleFileUpload}
            acceptedTypes={['.jpg', '.jpeg', '.png', '.webp']}
            maxSize={20 * 1024 * 1024}
            large={true}
          />
        </div>
      </div>
    );
  }

  // ファイルアップロード後：縮小されたプレビュー＋チャット
  return (
    <div className="flex-1 flex flex-col h-full">
      {/* 縮小されたファイルプレビュー */}
      {uploadedFile && (
        <div className="flex-shrink-0 border-b border-border p-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileImage className="w-6 h-6 text-muted-foreground" />
              <div>
                <span className="text-sm font-medium">{uploadedFile.file.name}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({(uploadedFile.file.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRemoveFile}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
      
      {/* チャット履歴 */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 scroll-smooth min-h-0"
        style={{ 
          scrollBehavior: 'smooth'
        }}
      >
        {messages.map((message, index) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            agentConfig={agentConfig}
            ref={index === messages.length - 1 ? lastMessageRef : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default EstimateChatContent;