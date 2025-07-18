"use client";

import React from 'react';
import { Message } from '../../types/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  HelpCircle, 
  Clock, 
  CheckCircle,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Star,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InquiryMessageProps {
  message: Message;
}

const InquiryMessage: React.FC<InquiryMessageProps> = ({ message }) => {
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

  const handleFeedback = (type: 'positive' | 'negative') => {
    console.log(`Feedback: ${type} for message ${message.id}`);
  };

  // AIメッセージで特定のキーワードがある場合、FAQ形式で表示
  const isFAQResponse = !isUser && (
    message.content.includes('納期') || 
    message.content.includes('価格') ||
    message.content.includes('材料') ||
    message.content.includes('品質') ||
    message.content.includes('保証')
  );

  const getRelatedTopics = () => {
    if (!isFAQResponse) return [];
    
    // 関連トピック（実際のAIレスポンスでは動的に生成）
    return [
      { title: '急ぎの注文について', category: '納期' },
      { title: '大量注文の割引', category: '価格' },
      { title: '品質保証書の発行', category: '品質' }
    ];
  };

  const getResponseMetrics = () => {
    if (!isFAQResponse) return null;
    
    return {
      responseTime: '即座',
      accuracy: '95%',
      satisfaction: '4.8/5'
    };
  };

  return (
    <div className={cn(
      "flex gap-3 max-w-4xl",
      isUser ? "ml-auto flex-row-reverse" : "mr-auto"
    )}>
      {/* アバター */}
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarFallback className={cn(
          isUser ? "bg-primary text-primary-foreground" : "bg-red-100 text-red-700"
        )}>
          {isUser ? <User className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
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
              ? "bg-red-50 border-red-200" 
              : "bg-muted"
        )}>
          <CardContent className="p-3">
            {isWelcome && (
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-800">問い合わせAI</span>
              </div>
            )}
            
            <div className="text-sm whitespace-pre-wrap">{message.content}</div>
            
            {/* FAQ詳細情報の表示 */}
            {isFAQResponse && (
              <div className="mt-3 space-y-3">
                <div className="text-xs font-medium text-muted-foreground border-t pt-2">
                  詳細情報
                </div>
                
                {/* レスポンス指標 */}
                {getResponseMetrics() && (
                  <Card className="bg-background">
                    <CardContent className="p-2">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-sm font-medium text-green-600">
                            {getResponseMetrics()?.responseTime}
                          </div>
                          <div className="text-xs text-muted-foreground">回答時間</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-blue-600">
                            {getResponseMetrics()?.accuracy}
                          </div>
                          <div className="text-xs text-muted-foreground">正確性</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-purple-600">
                            {getResponseMetrics()?.satisfaction}
                          </div>
                          <div className="text-xs text-muted-foreground">満足度</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 関連トピック */}
                {getRelatedTopics().length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">
                      関連する質問
                    </div>
                    {getRelatedTopics().map((topic, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="h-auto p-2 w-full justify-between text-left"
                      >
                        <div>
                          <div className="text-xs font-medium">{topic.title}</div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {topic.category}
                          </Badge>
                        </div>
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    ))}
                  </div>
                )}

                {/* アクションボタン */}
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="h-6 text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    保存
                  </Button>
                  <Button variant="outline" size="sm" className="h-6 text-xs">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    詳細
                  </Button>
                </div>

                {/* フィードバック */}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <span className="text-xs text-muted-foreground">この回答は役に立ちましたか？</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 p-1"
                    onClick={() => handleFeedback('positive')}
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 p-1"
                    onClick={() => handleFeedback('negative')}
                  >
                    <ThumbsDown className="w-3 h-3" />
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
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 p-0 text-xs"
                onClick={handleCopy}
              >
                <Copy className="w-3 h-3" />
              </Button>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>確認済み</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InquiryMessage;