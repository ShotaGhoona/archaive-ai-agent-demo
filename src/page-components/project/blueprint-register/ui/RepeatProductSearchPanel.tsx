"use client";
import { useState, useMemo } from "react";
import { List, Grid3X3 } from "lucide-react";
import { Button, Tooltip, TooltipTrigger, TooltipContent, SearchInput } from "@/shared";
import { TableView } from "@/shared/view/table-view";
import { GalleryView } from "@/shared/view/gallery-view";
import { repeatBlueprintData } from "../data";
import { 
  createRepeatBlueprintGalleryConfig,
  createRepeatBlueprintTableConfig,
  RepeatBlueprint 
} from "../lib";

interface RepeatProductSearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RepeatProductSearchPanel({ isOpen }: RepeatProductSearchPanelProps) {
  const [viewMode, setViewMode] = useState<"table" | "gallery">("gallery");
  const [searchTerm, setSearchTerm] = useState("");
  
  const blueprints: RepeatBlueprint[] = repeatBlueprintData;
  
  // 検索フィルタリング
  const filteredBlueprints = useMemo(() => 
    blueprints.filter(blueprint =>
      (blueprint.filename || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blueprint.productName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blueprint.customerNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blueprint.orderSource || '').toLowerCase().includes(searchTerm.toLowerCase())
    ), [blueprints, searchTerm]
  );

  // リピート品登録処理
  const handleRepeatRegister = (blueprint: RepeatBlueprint) => {
    console.log("リピート品として登録:", blueprint);
    // TODO: 実際のリピート品登録処理を実装
  };

  // Gallery設定
  const galleryConfig = useMemo(
    () => createRepeatBlueprintGalleryConfig({ onRepeatRegister: handleRepeatRegister }),
    []
  );

  // Table設定
  const tableConfig = useMemo(
    () => createRepeatBlueprintTableConfig({ onRepeatRegister: handleRepeatRegister }),
    []
  );


  if (!isOpen) return null;

  return (
    <div className="min-w-1/2 max-w-1/2 p-4">
      <div className="h-full bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col animate-in slide-in-from-right-full duration-300">        
        {/* 検索・フィルターヘッダー */}
        <div className="flex items-center gap-5 px-6 py-4">
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg bg-background">
            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="lg"
                  onClick={() => setViewMode("table")}
                  className="h-10 w-10 p-0"
                >
                  <List className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                テーブルビュー
              </TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === "gallery" ? "default" : "ghost"}
                  size="lg"
                  onClick={() => setViewMode("gallery")}
                  className="h-10 w-10 p-0"
                >
                  <Grid3X3 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                ギャラリービュー
              </TooltipContent>
            </Tooltip>
          </div>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="ファイル名、発注元、製品名、整番で検索"
          />
          
        </div>
        
        {/* メインコンテンツ */}
        <div className="flex-1 flex flex-col min-h-0 px-4">
          {viewMode === "table" ? (
            <TableView
              data={filteredBlueprints}
              config={tableConfig}
            />
          ) : (
            <GalleryView
              data={filteredBlueprints}
              config={galleryConfig}
            />
          )}
        </div>
      </div>
    </div>
  );
}