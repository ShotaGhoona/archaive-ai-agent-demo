"use client";

import { useEffect, useRef } from 'react';
import ChatMessage from '@/features/ai-agent/shared/components/ChatMessage';
import { Message } from '@/features/ai-agent/types/types';
import { AIAgentConfig } from '@/features/ai-agent/types/types';
import { MessageSquare } from 'lucide-react';

interface ChatContentProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onQuickMessage?: (message: string) => void;
  onFileUpload?: (file: File, message: string) => void;
  agentConfig: AIAgentConfig;
  sessionImage?: File | null;
}

// TroubleAgent専用のウェルカムメッセージ
const TROUBLE_WELCOME_MESSAGE = '過去のトラブル、見積もり、仕様書を検索できます。「トラブル」「見積もり」「仕様書」などのキーワードや、「1995-2001年」のような年代を指定して検索してください。';

export default function ChatContent({ 
  messages,
  agentConfig 
}: ChatContentProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const displayMessages = messages.filter(msg => 
    !msg.content.includes('typing') || msg.sender !== 'ai'
  );

  return (
    <div className="flex-1 flex flex-col h-full min-h-0">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {displayMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {agentConfig.name}へようこそ
              </h3>
              <p className="text-gray-600 max-w-md">
                {TROUBLE_WELCOME_MESSAGE}
              </p>
            </div>
          </div>
        )}

        {displayMessages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            agentConfig={agentConfig}
          />
        ))}
      </div>
    </div>
  );
}