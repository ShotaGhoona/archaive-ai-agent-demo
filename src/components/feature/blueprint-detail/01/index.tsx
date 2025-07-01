"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Printer,
  Download,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit,
} from "lucide-react";
import blueprintsData from "@/components/feature/blueprint/data/blueprint.json";
import ChatButton from "./ChatButton";
import ChatPanel from "./ChatPanel";
import { Message } from "./types";

// ダミー応答生成
const generateDummyResponse = (userMessage: string): string => {
  const responses = [
    "この図面について詳しく教えてください。どのような点でお手伝いできますか？",
    "図面の仕様を確認いたします。少々お待ちください。",
    "その件についてはプロジェクト管理チームに確認が必要です。",
    "図面の材質や寸法について具体的にお聞かせください。",
    "類似の図面データベースを検索してみます。",
  ];
  
  if (userMessage.includes("材質")) {
    return "この図面の材質についてお調べいたします。材質情報は右側のパネルでご確認いただけます。";
  }
  if (userMessage.includes("寸法")) {
    return "寸法に関する詳細な情報が必要でしたら、図面をクリックして拡大表示をご利用ください。";
  }
  if (userMessage.includes("工程")) {
    return "工程に関する情報は「工程表」タブでご確認いただけます。";
  }
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export default function BlueprintDetail01() {
  const params = useParams();
  const blueprintId = params.id as string;
  const blueprint = blueprintsData.find((item) => item.id === blueprintId);
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!blueprint) {
    return <div>図面が見つかりません</div>;
  }

  // 複数の図面画像を想定
  const images = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    url: blueprint.image,
    name: `図面 ${i + 1}`,
  }));

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // タイピングインジケーター
    const typingMessage: Message = {
      id: 'typing',
      content: '',
      sender: 'ai',
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages(prev => [...prev, typingMessage]);

    // ダミー遅延
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateDummyResponse(content),
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => prev.filter(msg => msg.id !== 'typing').concat(aiResponse));
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <div className={`flex gap-6 h-[calc(100vh-45px)] p-6 transition-all duration-300 ${isChatOpen ? 'mr-80' : ''}`}>
        {/* 左2/3: 図面表示エリア */}
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

          {/* メイン図面表示 */}
          <div className="relative flex-1 bg-gray-100 p-5 rounded-lg overflow-hidden min-h-0">
            <img
              src={images[selectedImageIndex].url}
              alt={images[selectedImageIndex].name}
              className="w-full h-full object-contain"
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

          {/* 類似図面検索 */}
          <Button className="w-full">
            <Search className="h-4 w-4 mr-2" />
            類似図面検索
          </Button>
        </div>
      </div>

      {/* AIチャット機能 */}
      <ChatButton onClick={toggleChat} isOpen={isChatOpen} />
      <ChatPanel
        isOpen={isChatOpen}
        messages={messages}
        onSendMessage={handleSendMessage}
        onClose={toggleChat}
        isLoading={isLoading}
      />
    </>
  );
}