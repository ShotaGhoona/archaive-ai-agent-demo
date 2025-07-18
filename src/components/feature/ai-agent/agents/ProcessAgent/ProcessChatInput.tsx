"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Send, 
  Zap, 
  Clock, 
  Users, 
  TrendingUp,
  FileText,
  Wrench,
  Target
} from 'lucide-react';

interface ProcessChatInputProps {
  onSendMessage: (message: string) => void;
  onQuickAction: (action: string) => void;
  disabled?: boolean;
  agentConfig?: any;
}

const ProcessChatInput: React.FC<ProcessChatInputProps> = ({
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

  const quickActions = [
    {
      id: 'optimize',
      label: '工程最適化',
      icon: TrendingUp,
      action: 'この図面の製造工程を最適化してください',
      color: 'text-blue-600'
    },
    {
      id: 'timeline',
      label: '作業時間見積もり',
      icon: Clock,
      action: '各工程の作業時間を見積もってください',
      color: 'text-green-600'
    },
    {
      id: 'resources',
      label: '必要リソース',
      icon: Users,
      action: '必要な設備とリソースを教えてください',
      color: 'text-orange-600'
    },
    {
      id: 'efficiency',
      label: '効率改善',
      icon: Target,
      action: '工程の効率改善点を分析してください',
      color: 'text-purple-600'
    },
    {
      id: 'workflow',
      label: 'ワークフロー生成',
      icon: Wrench,
      action: '最適なワークフローを生成してください',
      color: 'text-red-600'
    },
    {
      id: 'report',
      label: 'レポート作成',
      icon: FileText,
      action: '工程分析レポートを作成してください',
      color: 'text-indigo-600'
    }
  ];

  return (
    <div className="p-4 border-t border-border bg-background">
      {/* クイックアクション */}
      <Card className="mb-4">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">クイックアクション</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                className="h-auto p-2 justify-start"
                onClick={() => onQuickAction(action.action)}
                disabled={disabled}
              >
                <action.icon className={`w-3 h-3 mr-1.5 ${action.color}`} />
                <span className="text-xs">{action.label}</span>
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
          placeholder="工程最適化について質問を入力..."
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

      {/* ヒント */}
      <div className="mt-2 text-xs text-muted-foreground">
        💡 ヒント: 「工程を並行化できますか？」「ボトルネックはどこですか？」など具体的に質問してください
      </div>
    </div>
  );
};

export default ProcessChatInput;