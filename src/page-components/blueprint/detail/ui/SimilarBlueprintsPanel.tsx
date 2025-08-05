import React, { useState } from "react";
import { Button } from "@/shared/shadcnui";
import { X, Eye, GitCompare } from "lucide-react";
import { SimilarBlueprintPreviewModal } from "./SimilarBlueprintPreviewModal";
import { SimilarBlueprintCompareDialog } from "./SimilarBlueprintCompareDialog";

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

interface SimilarBlueprintsPanelProps {
  activeFile: BlueprintFile | null;
  onClose: () => void;
  onSimilarBlueprintClick?: (blueprint: SimilarBlueprint) => void;
}

export function SimilarBlueprintsPanel({ 
  activeFile, 
  onClose
}: SimilarBlueprintsPanelProps) {
  const [previewBlueprint, setPreviewBlueprint] = useState<SimilarBlueprint | null>(null);
  const [compareBlueprint, setCompareBlueprint] = useState<SimilarBlueprint | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const handlePreviewBlueprint = (blueprint: SimilarBlueprint) => {
    setPreviewBlueprint(blueprint);
    setIsPreviewOpen(true);
  };

  const handleCompareBlueprint = (blueprint: SimilarBlueprint) => {
    setCompareBlueprint(blueprint);
    setIsCompareOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewBlueprint(null);
  };

  const handleCloseCompare = () => {
    setIsCompareOpen(false);
    setCompareBlueprint(null);
  };
  if (!activeFile || !activeFile.similarBlueprints) {
    return (
      <div className="w-1/3 border-l bg-gray-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <h3 className="text-lg font-semibold text-gray-800">類似図面</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-2">
            <div className="text-4xl text-gray-300">🔍</div>
            <div className="text-sm text-gray-500">
              類似図面が見つかりませんでした
            </div>
          </div>
        </div>
      </div>
    );
  }

  const similarBlueprints = activeFile.similarBlueprints;

  return (
    <div className="w-1/3 border-l bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">類似図面</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* 類似図面ギャラリー - 2列グリッド */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {similarBlueprints
            .sort((a, b) => b.similarity - a.similarity)
            .map((blueprint) => (
              <div
                key={blueprint.id}
                className="group cursor-pointer"
              >
                <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* 画像 */}
                  <div className="aspect-[4/3] bg-gray-50 relative">
                    <img
                      src={blueprint.imageUrl}
                      alt={blueprint.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    
                    {/* ホバー時のオーバーレイボタン */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        className="bg-white/90 backdrop-blur-sm hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreviewBlueprint(blueprint);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        拡大
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompareBlueprint(blueprint);
                        }}
                      >
                        <GitCompare className="h-4 w-4 mr-1" />
                        比較
                      </Button>
                    </div>
                  </div>
                  
                  {/* 類似度バッジ */}
                  <div className="absolute top-2 right-2">
                    <div className={`text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm ${
                      blueprint.similarity >= 80 
                        ? 'bg-green-500/90 text-white'
                        : blueprint.similarity >= 70
                        ? 'bg-yellow-500/90 text-white' 
                        : 'bg-gray-500/90 text-white'
                    }`}>
                      {blueprint.similarity}%
                    </div>
                  </div>
                  
                  {/* 図面名 */}
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {blueprint.name}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      
      {/* プレビューモーダル */}
      <SimilarBlueprintPreviewModal
        blueprint={previewBlueprint}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
      />
      
      {/* 比較ダイアログ */}
      <SimilarBlueprintCompareDialog
        originalBlueprint={activeFile}
        compareBlueprint={compareBlueprint}
        isOpen={isCompareOpen}
        onClose={handleCloseCompare}
      />
    </div>
  );
}