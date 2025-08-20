'use client';
import Link from "next/link";
import { Card, CardContent, Tooltip, TooltipContent, TooltipTrigger, Button } from "@/shared/shadcnui";
import { RevisionBlueprint } from "../model/revisionBlueprintTypes";
import { FileText, GitCompareArrows } from "lucide-react";

interface RevisionBlueprintBarProps {
  blueprints: RevisionBlueprint[];
  currentPath: string; // 'basic-information', 'estimate', 'similar' など
  onCompare?: (blueprint: RevisionBlueprint) => void;
}

export function RevisionBlueprintBar({ 
  blueprints, 
  currentPath,
  onCompare 
}: RevisionBlueprintBarProps) {

  return (
    <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-white via-white/50 to-transparent backdrop-blur-sm border-b">
      <div className="flex items-center gap-3 h-full overflow-x-auto p-4">
        {blueprints.map((blueprint) => (
          <Tooltip key={blueprint.id} delayDuration={300}>
            <TooltipTrigger asChild>
              <Link
                href={`/blueprint/${blueprint.id}/${currentPath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0"
              >
                <Card className={`w-40 cursor-pointer transition-all duration-200 hover:shadow-md p-0 ${
                  blueprint.isActive ? 'ring-2 ring-primary' : 'hover:bg-gray-50'
                }`}>
                  <CardContent className="p-2">
                    <div className="space-y-2">
                      {/* 画像部分 - aspect-videoで16:9比率 */}
                      <div className="aspect-video w-full bg-gray-100 rounded overflow-hidden">
                        {blueprint.imageUrl ? (
                          <img 
                            src={blueprint.imageUrl} 
                            alt={blueprint.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* 名前と納品日 */}
                      <div className="px-1 space-y-1">
                        <h4 className="text-xs font-medium text-gray-900 truncate" title={blueprint.name}>
                          {blueprint.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          納品: {blueprint.deliveryDate}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="w-96 p-0 border-0 shadow-2xl backdrop-blur-sm" style={{ filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.25))' }}>
              <div className="bg-white rounded-lg overflow-hidden">
                {/* 大きな画像 */}
                <div className="aspect-video w-full bg-gray-100">
                  {blueprint.imageUrl ? (
                    <img 
                      src={blueprint.imageUrl} 
                      alt={blueprint.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* 詳細情報部分 */}
                <div className="p-3 space-y-2">
                  <h3 className="font-medium text-gray-900">{blueprint.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">ファイル名:</span>
                      <p className="text-gray-900">{blueprint.filename}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">納品日:</span>
                      <p className="text-gray-900">{blueprint.deliveryDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">顧客:</span>
                      <p className="text-gray-900">{blueprint.customerName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">案件番号:</span>
                      <p className="text-gray-900">{blueprint.projectNumber}</p>
                    </div>
                    {blueprint.similarity && (
                      <div className="col-span-2">
                        <span className="text-gray-600">類似度:</span>
                        <p className="text-gray-900">{blueprint.similarity}%</p>
                      </div>
                    )}
                  </div>
                  {blueprint.description && (
                    <div>
                      <span className="text-gray-600">説明:</span>
                      <p className="text-sm text-gray-900">{blueprint.description}</p>
                    </div>
                  )}
                  {onCompare && (
                    <div className="mt-3 pt-2 border-t">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onCompare(blueprint);
                        }}
                        size="sm"
                        className="w-full"
                      >
                        <GitCompareArrows className="h-4 w-4 mr-2" />
                        詳細比較
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
        
        {blueprints.length === 0 && (
          <div className="text-sm text-gray-500">
            リビジョン図面はありません
          </div>
        )}
      </div>
    </div>
  );
}