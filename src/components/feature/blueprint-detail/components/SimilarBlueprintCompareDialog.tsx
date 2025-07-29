import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from "@/shared/shadcnui";
import { 
  X,
  Scan
} from "lucide-react";

interface SimilarBlueprint {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  similarity: number;
  createdAt: string;
}

interface BlueprintFile {
  id: string;
  name: string;
  description: string;
  size: number;
  type: string;
  imageUrl: string;
  createdAt: string;
  isActive?: boolean;
  similarBlueprints?: SimilarBlueprint[];
}

interface SimilarBlueprintCompareDialogProps {
  originalBlueprint: BlueprintFile | null;
  compareBlueprint: SimilarBlueprint | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SimilarBlueprintCompareDialog({ 
  originalBlueprint,
  compareBlueprint, 
  isOpen, 
  onClose 
}: SimilarBlueprintCompareDialogProps) {
  const [showDifference, setShowDifference] = useState(false);

  const handleDifferenceDetection = () => {
    setShowDifference(!showDifference);
    // 実際の差分検出処理はここに実装
    console.log('差分検出処理を実行');
  };

  const handleClose = () => {
    setShowDifference(false);
    onClose();
  };

  if (!originalBlueprint || !compareBlueprint) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="min-w-[90vw] max-w-[90vw] max-h-[85vh] p-0 overflow-hidden"
      >
        {/* ヘッダー */}
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex-1">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              図面比較
            </DialogTitle>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-sm text-gray-500">
                類似度: {compareBlueprint.similarity}%
              </span>
              {showDifference && (
                <span className="text-sm text-blue-600 font-medium">
                  差分表示中
                </span>
              )}
            </div>
          </div>
          
          {/* 閉じるボタン */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* 比較エリア */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-2 h-full">
            {/* 元図面 */}
            <div className="border-r border-gray-300 p-4">
              <img
                src={originalBlueprint.imageUrl}
                alt={originalBlueprint.name}
                className={`max-w-none shadow-lg ${showDifference ? 'mix-blend-difference' : ''}`}
                style={{
                  maxHeight: '60vh',
                  maxWidth: '40vw'
                }}
              />
            </div>

            {/* 比較図面 */}
            <div className="p-4">
              <img
                src={compareBlueprint.imageUrl}
                alt={compareBlueprint.name}
                className={`max-w-none shadow-lg ${showDifference ? 'mix-blend-difference' : ''}`}
                style={{
                  maxHeight: '60vh',
                  maxWidth: '40vw'
                }}
              />
            </div>
          </div>
        </div>

        {/* フッター - 差分検出ボタン */}
        <div className="border-t bg-white p-4">
          <div className="flex items-center justify-center">
            <Button
              variant={showDifference ? "default" : "outline"}
              onClick={handleDifferenceDetection}
              className="gap-2"
            >
              <Scan className="h-4 w-4" />
              {showDifference ? '差分表示を終了' : '差分を検出'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}