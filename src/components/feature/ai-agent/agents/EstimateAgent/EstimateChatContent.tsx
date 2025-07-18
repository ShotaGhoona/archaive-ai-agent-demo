"use client";

import React, { useState } from 'react';
import { AgentContentProps } from '../../types/types';
import EstimateMessage from './EstimateMessage';
import FileUploadArea from './FileUploadArea';
import TypingIndicator from '../../shared/components/TypingIndicator';
import { Calculator } from 'lucide-react';

const EstimateChatContent: React.FC<AgentContentProps> = ({ 
  messages, 
  isLoading, 
  agentConfig 
}) => {
  const [hasUploadedFile, setHasUploadedFile] = useState(false);

  const handleFileUpload = (file: File) => {
    setHasUploadedFile(true);
    // ファイルアップロード処理（実際の実装では適切なファイル処理を行う）
    console.log('Uploaded file:', file.name);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* ファイルアップロード領域 */}
      {!hasUploadedFile && messages.length === 0 && (
        <div className="mb-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-foreground">見積もりAI</h3>
            <p className="text-sm text-muted-foreground">
              図面をアップロードして見積もりを開始します
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
      {messages.map((message) => (
        <EstimateMessage 
          key={message.id} 
          message={message} 
          agentConfig={agentConfig}
        />
      ))}
      
      {/* ローディング表示 */}
      {isLoading && <TypingIndicator agentColor="#10b981" agentIcon={Calculator} />}
    </div>
  );
};

export default EstimateChatContent;