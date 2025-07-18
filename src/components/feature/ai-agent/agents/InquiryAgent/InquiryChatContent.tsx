"use client";

import React, { useState } from 'react';
import { Message } from '../../types/types';
import InquiryMessage from './InquiryMessage';
import TypingIndicator from '../../shared/components/TypingIndicator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  Clock, 
  Calculator, 
  Package, 
  Shield,
  MessageCircle,
  Search,
  Star,
  ChevronRight
} from 'lucide-react';

interface InquiryChatContentProps {
  messages: Message[];
  isLoading: boolean;
  agentConfig?: any;
}

interface FAQItem {
  id: string;
  question: string;
  category: string;
  icon: any;
  color: string;
  priority: 'high' | 'medium' | 'low';
  quickAnswer?: string;
}

const InquiryChatContent: React.FC<InquiryChatContentProps> = ({ 
  messages, 
  isLoading, 
  agentConfig 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const welcomeMessage = {
    id: 'welcome',
    content: 'よくある質問からお選びください。お困りのことがあれば何でもお聞かせください。',
    sender: 'ai' as const,
    timestamp: new Date(),
    type: 'welcome'
  };

  const categories = [
    { id: 'delivery', name: '納期・配送', icon: Clock, color: 'text-blue-600' },
    { id: 'pricing', name: '価格・見積もり', icon: Calculator, color: 'text-green-600' },
    { id: 'materials', name: '材料・仕様', icon: Package, color: 'text-orange-600' },
    { id: 'quality', name: '品質・保証', icon: Shield, color: 'text-purple-600' }
  ];

  const frequentQuestions: FAQItem[] = [
    {
      id: 'delivery-time',
      question: '一般的な納期はどのくらいですか？',
      category: 'delivery',
      icon: Clock,
      color: 'text-blue-600',
      priority: 'high',
      quickAnswer: '通常2-3週間です。緊急対応も可能です。'
    },
    {
      id: 'rush-order',
      question: '急ぎの注文は可能ですか？',
      category: 'delivery',
      icon: Clock,
      color: 'text-blue-600',
      priority: 'high',
      quickAnswer: '割増料金で1週間での対応が可能です。'
    },
    {
      id: 'pricing-model',
      question: '価格体系について教えてください',
      category: 'pricing',
      icon: Calculator,
      color: 'text-green-600',
      priority: 'high',
      quickAnswer: '材料費 + 加工費 + 設計費で算出されます。'
    },
    {
      id: 'bulk-discount',
      question: '大量注文での割引はありますか？',
      category: 'pricing',
      icon: Calculator,
      color: 'text-green-600',
      priority: 'medium',
      quickAnswer: '100個以上で10%、500個以上で15%割引です。'
    },
    {
      id: 'material-types',
      question: '対応可能な材料を教えてください',
      category: 'materials',
      icon: Package,
      color: 'text-orange-600',
      priority: 'high',
      quickAnswer: 'ステンレス、アルミ、鉄、樹脂など幅広く対応します。'
    },
    {
      id: 'custom-materials',
      question: '特殊材料での製作は可能ですか？',
      category: 'materials',
      icon: Package,
      color: 'text-orange-600',
      priority: 'medium',
      quickAnswer: 'チタンやハステロイなども対応可能です。'
    },
    {
      id: 'quality-standard',
      question: '品質管理の基準は？',
      category: 'quality',
      icon: Shield,
      color: 'text-purple-600',
      priority: 'high',
      quickAnswer: 'ISO9001認証工場での製造・検査を行います。'
    },
    {
      id: 'warranty',
      question: '製品保証はありますか？',
      category: 'quality',
      icon: Shield,
      color: 'text-purple-600',
      priority: 'medium',
      quickAnswer: '製造不良については1年間の保証をお付けします。'
    }
  ];

  const displayMessages = messages.length === 0 ? [welcomeMessage] : messages;

  const filteredQuestions = selectedCategory 
    ? frequentQuestions.filter(q => q.category === selectedCategory)
    : frequentQuestions;

  const getPriorityColor = (priority: FAQItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleQuickAnswer = (faq: FAQItem) => {
    if (faq.quickAnswer) {
      // クイック回答を送信（実際の実装では onSendMessage を呼ぶ）
      console.log('Quick answer:', faq.quickAnswer);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* FAQ ダッシュボード */}
      {messages.length === 0 && (
        <div className="space-y-4">
          {/* カテゴリー選択 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">カテゴリーから選ぶ</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className="h-auto p-3 justify-start"
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.id ? null : category.id
                    )}
                  >
                    <category.icon className={`w-4 h-4 mr-2 ${category.color}`} />
                    <span className="text-sm">{category.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* よくある質問一覧 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">
                    {selectedCategory 
                      ? `${categories.find(c => c.id === selectedCategory)?.name}のよくある質問`
                      : 'よくある質問'
                    }
                  </h3>
                </div>
                {selectedCategory && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                  >
                    すべて表示
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                {filteredQuestions.map((faq) => (
                  <div
                    key={faq.id}
                    className="border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div 
                      className="p-3 cursor-pointer"
                      onClick={() => setExpandedFAQ(
                        expandedFAQ === faq.id ? null : faq.id
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2 flex-1">
                          <faq.icon className={`w-4 h-4 mt-0.5 ${faq.color}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{faq.question}</span>
                              <Badge className={`text-xs ${getPriorityColor(faq.priority)}`}>
                                {faq.priority === 'high' ? '人気' : 
                                 faq.priority === 'medium' ? '一般' : '詳細'}
                              </Badge>
                            </div>
                            {expandedFAQ === faq.id && faq.quickAnswer && (
                              <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                                {faq.quickAnswer}
                              </div>
                            )}
                          </div>
                        </div>
                        <ChevronRight 
                          className={`w-4 h-4 text-muted-foreground transition-transform ${
                            expandedFAQ === faq.id ? 'rotate-90' : ''
                          }`} 
                        />
                      </div>
                    </div>
                    
                    {expandedFAQ === faq.id && (
                      <div className="px-3 pb-3 flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleQuickAnswer(faq)}
                        >
                          <MessageCircle className="w-3 h-3 mr-1" />
                          詳しく聞く
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                        >
                          <Star className="w-3 h-3 mr-1" />
                          お気に入り
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* サポート情報 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">その他のサポート</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>営業時間</span>
                  <span className="text-muted-foreground">平日 9:00-18:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>緊急対応</span>
                  <span className="text-muted-foreground">24時間受付</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>レスポンス時間</span>
                  <span className="text-muted-foreground">平均30分以内</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* メッセージ表示 */}
      {displayMessages.map((message) => (
        <InquiryMessage key={message.id} message={message as Message} />
      ))}
      
      {isLoading && <TypingIndicator agentColor="#ef4444" agentIcon={HelpCircle} />}
    </div>
  );
};

export default InquiryChatContent;