"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Image, 
  History, 
  Settings, 
  Download,
  Share,
  BookOpen,
  Zap
} from "lucide-react";

interface ChatSidebarProps {
  blueprintImage: string;
  blueprintName: string;
  blueprintInfo: {
    customerName: string;
    productName: string;
    material: string;
  };
}

export default function ChatSidebar({ 
  blueprintImage, 
  blueprintName, 
  blueprintInfo 
}: ChatSidebarProps) {
  return (
    <div className="w-full h-full flex flex-col space-y-4 p-4 bg-muted/20">
      {/* 図面プレビュー */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Image className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">図面プレビュー</span>
          </div>
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
            <img
              src={blueprintImage}
              alt={blueprintName}
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
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              図面ダウンロード
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Share className="w-4 h-4 mr-2" />
              チャット共有
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <BookOpen className="w-4 h-4 mr-2" />
              技術資料
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}