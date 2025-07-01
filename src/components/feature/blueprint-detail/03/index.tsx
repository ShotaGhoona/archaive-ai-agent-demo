"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Printer,
  Download,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit,
  MapPin,
  MessageSquare,
  Lightbulb
} from "lucide-react";
import blueprintsData from "@/components/feature/blueprint/data/blueprint.json";
import InteractiveCanvas from "./InteractiveCanvas";
import ImmersiveChat from "./ImmersiveChat";
import { useAnnotations } from "./hooks/useAnnotations";
import { useImmersiveMode } from "./hooks/useImmersiveMode";
import { Message } from "./types";

// ダミー応答生成（空間文脈考慮）
const generateContextualResponse = (userMessage: string, context: any): string => {
  const spatialResponses = [
    `${context.description}の部分についてお答えします。`,
    `この箇所は${context.nearbyElements.join('、')}に隣接しています。`,
    `${context.materials?.[0] || '指定材質'}を使用したこの部分では、`,
    `寸法${context.dimensions?.width}×${context.dimensions?.height}のこの領域について、`
  ];

  const baseResponse = spatialResponses[Math.floor(Math.random() * spatialResponses.length)];
  
  if (userMessage.includes("加工")) {
    return baseResponse + "加工時は材質の特性を考慮し、適切な工具と切削条件を選択することが重要です。";
  }
  if (userMessage.includes("強度")) {
    return baseResponse + "この部分の強度は材質と形状により決まります。応力集中を避ける設計が推奨されます。";
  }
  if (userMessage.includes("寸法")) {
    return baseResponse + "寸法公差は±0.1mmで設計されており、精密加工が必要です。";
  }
  
  return baseResponse + "詳細な仕様や加工方法について、具体的にどのような点をお知りになりたいですか？";
};

export default function BlueprintDetail03() {
  const params = useParams();
  const blueprintId = params.id as string;
  const blueprint = blueprintsData.find((item) => item.id === blueprintId);
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // フック
  const { annotations, createAnnotation, updateAnnotation, getAnnotation } = useAnnotations();
  const { 
    isActive: isImmersiveActive, 
    activeAnnotation, 
    backgroundOpacity,
    enterImmersiveMode, 
    exitImmersiveMode 
  } = useImmersiveMode();

  if (!blueprint) {
    return <div>図面が見つかりません</div>;
  }

  // 複数の図面画像を想定
  const images = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    url: blueprint.image,
    name: `図面 ${i + 1}`,
  }));

  const handleCanvasClick = useCallback((screenPosition: { x: number; y: number }, relativePosition: { x: number; y: number }) => {
    if (isImmersiveActive) return; // 没入モード中は新規作成しない
    
    const annotation = createAnnotation(screenPosition, relativePosition);
    enterImmersiveMode(annotation.id);
  }, [createAnnotation, enterImmersiveMode, isImmersiveActive]);

  const handleAnnotationClick = useCallback((annotation: any) => {
    enterImmersiveMode(annotation.id);
  }, [enterImmersiveMode]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!activeAnnotation) return;

    const annotation = getAnnotation(activeAnnotation);
    if (!annotation) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    // 注釈に会話を追加
    updateAnnotation(activeAnnotation, {
      conversations: [...annotation.conversations, userMessage]
    });

    setIsLoading(true);

    // タイピングインジケーター
    const typingMessage: Message = {
      id: 'typing',
      content: '',
      sender: 'ai',
      timestamp: new Date(),
      isTyping: true,
    };

    updateAnnotation(activeAnnotation, {
      conversations: [...annotation.conversations, userMessage, typingMessage]
    });

    // ダミー遅延
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateContextualResponse(content, annotation.context),
        sender: 'ai',
        timestamp: new Date(),
      };

      const updatedAnnotation = getAnnotation(activeAnnotation);
      if (updatedAnnotation) {
        const conversations = updatedAnnotation.conversations.filter(msg => msg.id !== 'typing');
        updateAnnotation(activeAnnotation, {
          conversations: [...conversations, aiResponse]
        });
      }

      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  }, [activeAnnotation, getAnnotation, updateAnnotation]);

  const currentAnnotation = activeAnnotation ? getAnnotation(activeAnnotation) : null;

  return (
    <>
      <div className="flex gap-6 h-[calc(100vh-45px)] p-6">
        {/* 左2/3: インタラクティブ図面エリア */}
        <div className="flex-1 flex flex-col space-y-4 min-h-0">
          {/* 図面ナビゲーション（横スクロール） */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide pb-2">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className={`flex-shrink-0 cursor-pointer rounded-lg border-2 transition-all ${
                    selectedImageIndex === index
                      ? "border-primary shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-20 h-14 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* メインインタラクティブキャンバス */}
          <div className="relative flex-1 min-h-0">
            <InteractiveCanvas
              imageUrl={images[selectedImageIndex].url}
              imageName={images[selectedImageIndex].name}
              annotations={annotations}
              onCanvasClick={handleCanvasClick}
              onAnnotationClick={handleAnnotationClick}
              activeAnnotationId={activeAnnotation}
              backgroundOpacity={isImmersiveActive ? backgroundOpacity : 1}
            />
            
            {/* ナビゲーションボタン */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-75 hover:opacity-100"
              onClick={() =>
                setSelectedImageIndex(
                  selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1
                )
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-75 hover:opacity-100"
              onClick={() =>
                setSelectedImageIndex(
                  selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0
                )
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 右1/3: ユーティリティエリア */}
        <div className="w-80 space-y-6">
          {/* 注釈サマリー */}
          {annotations.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="font-medium text-gray-900">注釈ポイント</h3>
                  <Badge variant="secondary">{annotations.length}</Badge>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {annotations.map((annotation) => (
                    <div
                      key={annotation.id}
                      className="flex items-center justify-between p-2 bg-muted/50 rounded-md cursor-pointer hover:bg-muted"
                      onClick={() => handleAnnotationClick(annotation)}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <MessageSquare className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm truncate">{annotation.context.description}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {annotation.conversations.length}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 使い方ガイド */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <h3 className="font-medium text-gray-900">使い方</h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>1. 図面上の気になる箇所をクリック</p>
                <p>2. 没入型チャット画面が開きます</p>
                <p>3. その箇所について詳しく質問</p>
                <p>4. AIが文脈を理解して回答</p>
              </div>
            </CardContent>
          </Card>

          {/* アクションボタン群 */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="w-full justify-start">
              <Printer className="h-4 w-4 mr-2" />
              印刷
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              ダウンロード
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              削除
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Edit className="h-4 w-4 mr-2" />
              編集
            </Button>
          </div>

          {/* 図面情報 */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-900 mb-4">図面情報</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">顧客名</label>
                  <p className="text-sm text-gray-900 mt-1">{blueprint.customerName}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-gray-500">製品名</label>
                  <p className="text-sm text-gray-900 mt-1">{blueprint.productName}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-gray-500">社内製番</label>
                  <p className="text-sm text-gray-900 mt-1">{blueprint.id}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-gray-500">客先製番</label>
                  <p className="text-sm text-gray-900 mt-1">{blueprint.drawing}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-gray-500">材質</label>
                  <p className="text-sm text-gray-900 mt-1">{blueprint.material}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-gray-500">備考</label>
                  <p className="text-sm text-gray-900 mt-1">特記事項なし</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 類似図面検索 */}
          <Button className="w-full">
            <Search className="h-4 w-4 mr-2" />
            類似図面検索
          </Button>
        </div>
      </div>

      {/* 没入型チャットオーバーレイ */}
      <ImmersiveChat
        isActive={isImmersiveActive}
        annotation={currentAnnotation}
        backgroundOpacity={backgroundOpacity}
        onClose={exitImmersiveMode}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </>
  );
}