"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, Button, Separator } from "@/components/ui";
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

export default function BlueprintDetail() {
  const params = useParams();
  const blueprintId = params.id as string;
  const blueprint = blueprintsData.find((item) => item.id === blueprintId);
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!blueprint) {
    return <div>図面が見つかりません</div>;
  }

  // 複数の図面画像を想定（実際のデータでは配列になると想定）
  const images = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    url: blueprint.image,
    name: `図面 ${i + 1}`,
  }));

  return (
    <div className="flex gap-6 h-[calc(100vh-45px)] p-6">
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
  );
}