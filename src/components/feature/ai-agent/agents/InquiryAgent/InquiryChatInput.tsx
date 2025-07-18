"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Send, 
  Clock, 
  Calculator, 
  Package, 
  Shield,
  HelpCircle,
  MessageCircle,
  Phone
} from 'lucide-react';

interface InquiryChatInputProps {
  onSendMessage: (message: string) => void;
  onQuickAction: (action: string) => void;
  disabled?: boolean;
  agentConfig?: any;
}

const InquiryChatInput: React.FC<InquiryChatInputProps> = ({
  onSendMessage,
  onQuickAction,
  disabled = false,
  agentConfig
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    {
      id: 'delivery',
      label: '納期について',
      icon: Clock,
      action: '納期について教えてください',
      color: 'text-blue-600'
    },
    {
      id: 'pricing',
      label: '価格体系',
      icon: Calculator,
      action: '価格体系について知りたいです',
      color: 'text-green-600'
    },
    {
      id: 'materials',
      label: '対応可能な材料',
      icon: Package,
      action: '対応可能な材料について教えてください',
      color: 'text-orange-600'
    },
    {
      id: 'quality',
      label: '品質管理',
      icon: Shield,
      action: '品質管理について知りたいです',
      color: 'text-purple-600'
    },
    {
      id: 'support',
      label: 'サポート体制',
      icon: HelpCircle,
      action: 'サポート体制について教えてください',
      color: 'text-indigo-600'
    },
    {
      id: 'contact',
      label: '直接相談',
      icon: Phone,
      action: '直接相談したいです',
      color: 'text-red-600'
    }
  ];

  const suggestionTemplates = [
    '見積もりの有効期限はどのくらいですか？',
    '図面の修正は可能ですか？',
    'ロット数による価格変動はありますか？',
    '検査証明書は発行できますか？'
  ];

  return (
    <div className="p-4 border-t border-border bg-background">
      {/* クイック質問 */}
      <Card className="mb-4">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">よくある質問</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {quickQuestions.map((question) => (
              <Button
                key={question.id}
                variant="outline"
                size="sm"
                className="h-auto p-2 justify-start"
                onClick={() => onQuickAction(question.action)}
                disabled={disabled}
              >
                <question.icon className={`w-3 h-3 mr-1.5 ${question.color}`} />
                <span className="text-xs">{question.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 質問候補 */}
      <Card className="mb-4">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">質問例</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {suggestionTemplates.map((template, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setMessage(template)}
                disabled={disabled}
              >
                "{template}"
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* メッセージ入力 */}
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="ご質問をお聞かせください..."
          disabled={disabled}
          className="flex-1"
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          size="icon"
          className="shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* サポート情報 */}
      <div className="mt-2 text-xs text-muted-foreground">
        💬 迅速な回答を心がけています｜緊急の場合は直接お電話ください
      </div>
    </div>
  );
};

export default InquiryChatInput;