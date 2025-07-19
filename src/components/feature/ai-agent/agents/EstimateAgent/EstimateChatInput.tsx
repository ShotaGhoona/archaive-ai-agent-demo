"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Plus, FileText, Calculator, Clock, DollarSign, TrendingUp, Package } from 'lucide-react';
import { AgentInputProps } from '../../types/types';

const EstimateChatInput: React.FC<AgentInputProps> = ({ 
  onSendMessage, 
  onQuickAction, 
  disabled = false,
  agentConfig 
}) => {
  const [message, setMessage] = useState('この図面の見積もりを開始してください');
  const [showQuickActions, setShowQuickActions] = useState(false);

  const quickActions = [
    { id: 'quick-estimate', label: '概算見積もり', icon: Calculator },
    { id: 'detailed-estimate', label: '詳細見積もり', icon: FileText },
    { id: 'material-cost', label: '材料費分析', icon: Package },
    { id: 'processing-cost', label: '加工費算出', icon: DollarSign },
    { id: 'delivery-time', label: '納期見積もり', icon: Clock },
    { id: 'cost-optimization', label: 'コスト最適化', icon: TrendingUp }
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
            <h4 className="text-sm font-medium text-muted-foreground">見積もりメニュー</h4>
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