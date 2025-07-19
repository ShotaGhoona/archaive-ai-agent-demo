"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Plus, FileText, Search, Calculator, Settings, BookOpen, HelpCircle } from 'lucide-react';
import { AgentInputProps } from '../../types/types';

const GeneralChatInput: React.FC<AgentInputProps> = ({ 
  onSendMessage, 
  onQuickAction, 
  disabled = false,
  agentConfig 
}) => {
  const [message, setMessage] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);

  const quickActions = [
    { id: 'design-basics', label: '設計の基本を教えて', icon: BookOpen },
    { id: 'material-selection', label: '材料の選び方', icon: Settings },
    { id: 'tolerance-guide', label: '公差設定のガイド', icon: Calculator },
    { id: 'processing-methods', label: '加工方法について', icon: FileText },
    { id: 'quality-control', label: '品質管理のポイント', icon: Search },
    { id: 'safety-guidelines', label: '安全ガイドライン', icon: HelpCircle }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleQuickAction = (action: string) => {
    onQuickAction?.(action);
    setShowQuickActions(false);
  };

  return (
    <div className="border-t border-border bg-background">
      {/* クイックアクション */}
      {showQuickActions && (
        <div className="p-4 border-b border-border">
          <div className="mb-2">
            <h4 className="text-sm font-medium text-muted-foreground">よくある質問</h4>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.label)}
                className="flex items-center gap-2 text-sm justify-start h-auto py-2"
              >
                <action.icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-left">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* 入力エリア */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
          
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="メッセージを入力..."
            disabled={disabled}
            className="flex-1"
          />
          
          <Button
            type="submit"
            disabled={disabled || !message.trim()}
            size="sm"
            className="flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default GeneralChatInput;