"use client";

import React from 'react';
import { Message } from '../../types/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Wrench, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Copy,
  Download,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessMessageProps {
  message: Message;
}

const ProcessMessage: React.FC<ProcessMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isWelcome = message.type === 'welcome';

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  // AIメッセージで工程関連のキーワードがある場合、特別なレイアウトを表示
  const isProcessAnalysis = !isUser && (
    message.content.includes('工程') || 
    message.content.includes('最適化') ||
    message.content.includes('効率')
  );

  const getProcessSteps = () => {
    if (!isProcessAnalysis) return [];
    
    // サンプルの工程ステップ（実際のAIレスポンスでは動的に生成）
    return [
      { step: '材料準備', time: '30分', status: 'optimized' },
      { step: '切断作業', time: '2時間', status: 'bottleneck' },
      { step: '成形作業', time: '4時間', status: 'normal' },
      { step: '仕上げ', time: '1時間', status: 'optimized' }
    ];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimized':
        return 'bg-green-100 text-green-800';
      case 'bottleneck':
        return 'bg-red-100 text-red-800';
      case 'normal':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimized':
        return <CheckCircle className="w-3 h-3" />;
      case 'bottleneck':
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className={cn(
      "flex gap-3 max-w-4xl",
      isUser ? "ml-auto flex-row-reverse" : "mr-auto"
    )}>
      {/* アバター */}
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarFallback className={cn(
          isUser ? "bg-primary text-primary-foreground" : "bg-orange-100 text-orange-700"
        )}>
          {isUser ? <User className="w-4 h-4" /> : <Wrench className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>

      {/* メッセージ内容 */}
      <div className={cn(
        "flex-1 space-y-2",
        isUser && "text-right"
      )}>
        {/* メッセージバブル */}
        <Card className={cn(
          "inline-block max-w-full",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : isWelcome 
              ? "bg-orange-50 border-orange-200" 
              : "bg-muted"
        )}>
          <CardContent className="p-3">
            {isWelcome && (
              <div className="flex items-center gap-2 mb-2">
                <Wrench className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-orange-800">工程生成AI</span>
              </div>
            )}
            
            <div className="text-sm whitespace-pre-wrap">{message.content}</div>
            
            {/* 工程分析結果の表示 */}
            {isProcessAnalysis && (
              <div className="mt-3 space-y-3">
                <div className="text-xs font-medium text-muted-foreground border-t pt-2">
                  工程分析結果
                </div>
                
                {/* 工程ステップ */}
                <div className="space-y-2">
                  {getProcessSteps().map((step, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-background rounded border">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(step.status)}
                        <span className="text-xs font-medium">{step.step}</span>
                        <Badge className={`text-xs ${getStatusColor(step.status)}`}>
                          {step.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{step.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 効率改善指標 */}
                <Card className="bg-background">
                  <CardContent className="p-2">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-green-600">+15%</div>
                        <div className="text-xs text-muted-foreground">効率向上</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-600">-2.5h</div>
                        <div className="text-xs text-muted-foreground">時間短縮</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* アクションボタン */}
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="h-6 text-xs">
                    <Download className="w-3 h-3 mr-1" />
                    工程表DL
                  </Button>
                  <Button variant="outline" size="sm" className="h-6 text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    詳細表示
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* メタ情報 */}
        <div className={cn(
          "flex items-center gap-2 text-xs text-muted-foreground",
          isUser && "justify-end"
        )}>
          <span>{formatTime(message.timestamp)}</span>
          {!isUser && !isWelcome && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 p-0 text-xs"
              onClick={handleCopy}
            >
              <Copy className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessMessage;