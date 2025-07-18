"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Plus, FileText, Calculator, Clock } from 'lucide-react';
import { AgentInputProps } from '../../types';
import { cn } from '@/lib/utils';

const EstimateChatInput: React.FC<AgentInputProps> = ({ 
  onSendMessage, 
  onQuickAction, 
  disabled = false,
  agentConfig 
}) => {
  const [message, setMessage] = useState('この図面の見積もりを開始してください');
  const [showQuickActions, setShowQuickActions] = useState(false);

  const quickActions = [
    { id: 'estimate', label: '見積もり開始', icon: Calculator },
    { id: 'materials', label: '材料費を確認', icon: FileText },
    { id: 'timeline', label: '納期を確認', icon: Clock }
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
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.label)}
                className="flex items-center gap-2 text-sm"
              >
                <action.icon className="w-4 h-4" />
                {action.label}
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
            placeholder="見積もりに関する質問を入力..."
            disabled={disabled}
            className="flex-1"
          />
          
          <Button
            type="submit"
            disabled={disabled || !message.trim()}
            size="sm"
            className="flex-shrink-0"
            style={{ backgroundColor: agentConfig.color }}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EstimateChatInput;