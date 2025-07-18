"use client";

import React, { useState } from 'react';
import { Message } from '../../types';
import ProcessMessage from './ProcessMessage';
import TypingIndicator from '../../shared/TypingIndicator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Wrench, 
  Users, 
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface ProcessChatContentProps {
  messages: Message[];
  isLoading: boolean;
  agentConfig?: any;
}

interface ProcessStep {
  id: string;
  name: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'pending';
  efficiency: number;
  requirements: string[];
}

const ProcessChatContent: React.FC<ProcessChatContentProps> = ({ 
  messages, 
  isLoading, 
  agentConfig 
}) => {
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);

  const welcomeMessage = {
    id: 'welcome',
    content: '製造工程の最適化をサポートします。図面から効率的な工程を生成できます。',
    sender: 'ai' as const,
    timestamp: new Date(),
    type: 'welcome'
  };

  const sampleProcesses = [
    {
      id: 'cutting',
      name: '切断工程',
      duration: '2時間',
      status: 'completed' as const,
      efficiency: 95,
      requirements: ['レーザー切断機', '熟練オペレーター']
    },
    {
      id: 'forming',
      name: '成形工程',
      duration: '4時間',
      status: 'in-progress' as const,
      efficiency: 87,
      requirements: ['プレス機', '金型', '品質チェック']
    },
    {
      id: 'finishing',
      name: '仕上げ工程',
      duration: '1.5時間',
      status: 'pending' as const,
      efficiency: 92,
      requirements: ['研磨機', '検査設備']
    }
  ];

  const processOptimizations = [
    {
      title: '工程短縮提案',
      description: '並行作業により20%の時間短縮が可能',
      impact: 'high',
      icon: Clock
    },
    {
      title: 'リソース最適化',
      description: '設備稼働率を15%向上',
      impact: 'medium',
      icon: TrendingUp
    },
    {
      title: '品質向上',
      description: '工程間検査により不良率を50%削減',
      impact: 'high',
      icon: CheckCircle
    }
  ];

  const displayMessages = messages.length === 0 ? [welcomeMessage] : messages;

  const getStatusIcon = (status: ProcessStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: ProcessStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* 工程最適化ダッシュボード */}
      {messages.length === 0 && (
        <div className="space-y-4">
          {/* 最適化提案カード */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">最適化提案</h3>
              </div>
              <div className="grid gap-3">
                {processOptimizations.map((optimization, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <optimization.icon className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{optimization.title}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getImpactColor(optimization.impact)}`}
                        >
                          {optimization.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {optimization.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 工程フロー表示 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Wrench className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">製造工程フロー</h3>
              </div>
              <div className="space-y-3">
                {sampleProcesses.map((process, index) => (
                  <div
                    key={process.id}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedProcess === process.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedProcess(
                      selectedProcess === process.id ? null : process.id
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(process.status)}
                        <span className="font-medium">{process.name}</span>
                        <Badge className={`text-xs ${getStatusColor(process.status)}`}>
                          {process.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{process.duration}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">効率性:</span>
                        <span className="text-sm font-medium">{process.efficiency}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {process.requirements.length}項目
                        </span>
                      </div>
                    </div>

                    {selectedProcess === process.id && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="space-y-2">
                          <span className="text-sm font-medium">必要リソース:</span>
                          <div className="flex flex-wrap gap-1">
                            {process.requirements.map((req, reqIndex) => (
                              <Badge key={reqIndex} variant="outline" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* クイックアクション */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">クイックアクション</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="h-auto p-3">
                  <div className="text-center">
                    <Clock className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-xs">工程最適化</div>
                  </div>
                </Button>
                <Button variant="outline" size="sm" className="h-auto p-3">
                  <div className="text-center">
                    <Users className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-xs">リソース分析</div>
                  </div>
                </Button>
                <Button variant="outline" size="sm" className="h-auto p-3">
                  <div className="text-center">
                    <TrendingUp className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-xs">効率改善</div>
                  </div>
                </Button>
                <Button variant="outline" size="sm" className="h-auto p-3">
                  <div className="text-center">
                    <FileText className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-xs">レポート生成</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* メッセージ表示 */}
      {displayMessages.map((message) => (
        <ProcessMessage key={message.id} message={message} />
      ))}
      
      {isLoading && <TypingIndicator agentColor="#f59e0b" agentIcon={Wrench} />}
    </div>
  );
};

export default ProcessChatContent;