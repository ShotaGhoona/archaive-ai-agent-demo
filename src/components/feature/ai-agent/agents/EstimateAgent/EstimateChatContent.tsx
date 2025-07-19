"use client";

import React, { useState, useEffect, useRef } from 'react';
import { AgentContentProps } from '../../types/types';
import ChatMessage from '../../shared/components/ChatMessage';
import FileUploadArea from './FileUploadArea';
import TypingIndicator from '../../shared/components/TypingIndicator';

const EstimateChatContent: React.FC<AgentContentProps> = ({ 
  messages, 
  isLoading, 
  agentConfig 
}) => {
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (file: File) => {
    setHasUploadedFile(true);
    // ファイルアップロード処理（実際の実装では適切なファイル処理を行う）
    console.log('Uploaded file:', file.name);
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

  return (
    <div 
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 scroll-smooth"
      style={{ 
        maxHeight: '100%',
        scrollBehavior: 'smooth'
      }}
    >
      {/* ファイルアップロード領域 */}
      {!hasUploadedFile && messages.length === 0 && (
        <div className="mb-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-foreground">{agentConfig.name}</h3>
            <p className="text-sm text-muted-foreground">
              {agentConfig.welcomeMessage}
            </p>
          </div>
          <FileUploadArea
            onFileUpload={handleFileUpload}
            acceptedTypes={['.pdf', '.dwg', '.dxf', '.jpg', '.png']}
            maxSize={10 * 1024 * 1024} // 10MB
          />
        </div>
      )}
      
      {/* メッセージ表示 */}
      {messages.map((message, index) => (
        <ChatMessage 
          key={message.id} 
          message={message} 
          agentConfig={agentConfig}
          ref={index === messages.length - 1 ? lastMessageRef : undefined}
        />
      ))}
      
      {/* ローディング表示 */}
      {isLoading && (
        <div ref={lastMessageRef}>
          <TypingIndicator agentColor={agentConfig.color} agentIcon={agentConfig.icon} />
        </div>
      )}
    </div>
  );
};

export default EstimateChatContent;