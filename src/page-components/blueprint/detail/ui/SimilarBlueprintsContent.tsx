import React, { useState } from "react";
import { Button } from "@/shared/shadcnui";
import { Search, GitCompareArrows } from "lucide-react";
import { SimilarBlueprintCompareModal } from "./SimilarBlueprintCompareModal";
import { BlueprintFile, SimilarBlueprint } from "../data/types";

interface SimilarBlueprintsContentProps {
  activeFile: BlueprintFile | null;
}

export function SimilarBlueprintsContent({ 
  activeFile
}: SimilarBlueprintsContentProps) {
  const [compareBlueprint, setCompareBlueprint] = useState<SimilarBlueprint | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const handleDifferenceDetection = (blueprint: SimilarBlueprint) => {
    // 差分検出ページを別タブで開く
    const differenceUrl = `/blueprint/difference-detection?source=${encodeURIComponent(activeFile?.name || '')}&target=${encodeURIComponent(blueprint.name)}&sourceId=${activeFile?.id}&targetId=${blueprint.id}`;
    window.open(differenceUrl, '_blank');
  };

  const handleDetailedComparison = (blueprint: SimilarBlueprint) => {
    setCompareBlueprint(blueprint);
    setIsCompareOpen(true);
  };

  const handleCloseCompare = () => {
    setIsCompareOpen(false);
    setCompareBlueprint(null);
  };


  if (!activeFile || !activeFile.similarBlueprints || activeFile.similarBlueprints.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <div className="text-4xl text-gray-300">🔍</div>
          <div className="text-sm text-gray-500">
            類似図面が見つかりませんでした
          </div>
        </div>
      </div>
    );
  }

  const similarBlueprints = activeFile.similarBlueprints;

  return (
    <div className="flex-1 overflow-y-auto p-4 h-full bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-bold">類似図面</div>
        <div className="text-sm text-gray-500">
          {similarBlueprints.length}件の類似図面が見つかりました
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {similarBlueprints
          .sort((a, b) => b.similarity - a.similarity)
          .map((blueprint) => (
            <div
              key={blueprint.id}
              className="group cursor-pointer"
            >
              <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] bg-gray-50 relative">
                  <img
                    src={blueprint.imageUrl}
                    alt={blueprint.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDifferenceDetection(blueprint);
                      }}
                    >
                      <Search className="h-4 w-4 mr-1" />
                      差分検出
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDetailedComparison(blueprint);
                      }}
                    >
                      <GitCompareArrows className="h-4 w-4 mr-1" />
                      詳細比較
                    </Button>
                  </div>
                </div>
                
                <div className="absolute top-2 right-2">
                  <div className="text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm bg-gray-500/90 text-white">
                    類似度 {blueprint.similarity}%
                  </div>
                </div>
                
                <div className="p-3">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {blueprint.name}
                  </h4>
                </div>
              </div>
            </div>
          ))}
      </div>
      
      <SimilarBlueprintCompareModal
        isOpen={isCompareOpen}
        onClose={handleCloseCompare}
        currentBlueprint={activeFile}
        similarBlueprint={compareBlueprint}
      />
    </div>
  );
}