"use client";

import { forwardRef, useRef, useImperativeHandle } from "react";
import { ChatLayoutState, Message, BlueprintInfo } from "../types";
import ChatHeader from "../shared/ChatHeader";
import ChatContent from "../shared/ChatContent";
import ChatInput from "../shared/ChatInput";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Image, 
  Zap,
  Download,
  Share,
  BookOpen
} from "lucide-react";

interface FullpageLayoutProps {
  messages: Message[];
  isLoading: boolean;
  onLayoutChange: (layout: ChatLayoutState) => void;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  onQuickAction: (action: string) => void;
  blueprintInfo?: BlueprintInfo;
}

export interface FullpageLayoutRef {
  getElement: () => HTMLDivElement | null;
}

const FullpageLayout = forwardRef<FullpageLayoutRef, FullpageLayoutProps>(({
  messages,
  isLoading,
  onLayoutChange,
  onClose,
  onSendMessage,
  onQuickAction,
  blueprintInfo
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    getElement: () => containerRef.current
  }));

  return (
    <>
      {/* バックドロップ */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
        onClick={onClose}
      />
      
      {/* モーダルコンテンツ */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-40 flex items-center justify-center p-4"
      >
        <div 
          className="bg-background rounded-lg shadow-2xl border border-border overflow-hidden flex"
          style={{ width: '95vw', height: '95vh', maxWidth: '1400px', maxHeight: '900px' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* メインチャットエリア */}
          <div className="flex-1 flex flex-col">
            <ChatHeader
              currentLayout={ChatLayoutState.FULLPAGE}
              onLayoutChange={onLayoutChange}
              onClose={onClose}
              title="AI Assistant - 大画面モード"
            />
            
            <ChatContent
              messages={messages}
              isLoading={isLoading}
            />
            
            <ChatInput
              onSendMessage={onSendMessage}
              onQuickAction={onQuickAction}
              disabled={isLoading}
            />
          </div>

          {/* 右サイドバー */}
          {blueprintInfo && (
            <div className="w-80 border-l border-border bg-muted/20 flex flex-col p-4 space-y-4">
              {/* 図面プレビュー */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Image className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">図面プレビュー</span>
                  </div>
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
                    <img
                      src={blueprintInfo.image}
                      alt={blueprintInfo.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{blueprintInfo.productName}</p>
                    <p className="text-xs text-muted-foreground">{blueprintInfo.customerName}</p>
                    <Badge variant="outline" className="text-xs">
                      {blueprintInfo.material}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* クイックアクション */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">クイックアクション</span>
                  </div>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => onQuickAction('download')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      図面ダウンロード
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => onQuickAction('share')}
                    >
                      <Share className="w-4 h-4 mr-2" />
                      チャット共有
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => onQuickAction('docs')}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      技術資料
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
});

FullpageLayout.displayName = "FullpageLayout";

export default FullpageLayout;