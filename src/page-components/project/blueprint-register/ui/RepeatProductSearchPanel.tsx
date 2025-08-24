"use client";
import { useState } from "react";
import { List, Grid3X3, Plus } from "lucide-react";
import { Button, Tooltip, TooltipTrigger, TooltipContent, Card, CardContent, Badge, SearchInput } from "@/shared";
import { BlueprintTableView, Blueprint, blueprintsData } from "@/page-components";
import Link from "next/link";

interface RepeatProductSearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RepeatProductSearchPanel({ isOpen }: RepeatProductSearchPanelProps) {
  const [viewMode, setViewMode] = useState<"table" | "gallery">("gallery");
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredBlueprint, setHoveredBlueprint] = useState<string | null>(null);
  
  const blueprints: Blueprint[] = blueprintsData as unknown as Blueprint[];
  
  // 検索フィルタリング
  const filteredBlueprints = blueprints.filter(blueprint =>
    (blueprint.filename || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (blueprint.productName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (blueprint.customerNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRegisterAsRepeat = (blueprint: Blueprint) => {
    console.log("リピート品として登録:", blueprint);
    // TODO: リピート品登録処理を実装
  };

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
            <BlueprintTableView blueprints={filteredBlueprints} />
          ) : (
            <div className="overflow-auto flex-1 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
                {filteredBlueprints.map((blueprint) => (
                  <div 
                    key={blueprint.internalNumber}
                    className="relative"
                    onMouseEnter={() => setHoveredBlueprint(blueprint.internalNumber)}
                    onMouseLeave={() => setHoveredBlueprint(null)}
                  >
                    <Link href={`/blueprint/${blueprint.internalNumber}/basic-information`}>
                      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200 group cursor-pointer p-0">
                        <div className="aspect-video overflow-hidden bg-gray-100 relative">
                          <img
                            src={blueprint.image}
                            alt={blueprint.productName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          
                          {/* ホバー時のオーバーレイとボタン */}
                          {hoveredBlueprint === blueprint.internalNumber && (
                            <div className="absolute inset-0 bg-black/50 opacity-100 transition-opacity duration-200 flex items-center justify-center">
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleRegisterAsRepeat(blueprint);
                                }}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                リピート品として登録
                              </Button>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-600">
                              {blueprint.orderSource}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {blueprint.companyField}
                            </Badge>
                          </div>
                          <h3 className="font-medium text-gray-900 mb-1">
                            {blueprint.productName}
                          </h3>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="font-mono text-xs">
                              {blueprint.customerNumber}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {blueprint.orderQuantity}個
                            </span>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            {blueprint.orderDate} 〜 {blueprint.deliveryDate}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}