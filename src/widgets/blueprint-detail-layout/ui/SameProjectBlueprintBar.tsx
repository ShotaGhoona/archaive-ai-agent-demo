'use client';
import Link from "next/link";
import { Card, CardContent, Tooltip, TooltipContent, TooltipTrigger, Button } from "@/shared/shadcnui";
import { SameProjectBlueprint } from "../model/sameProjectBlueprintTypes";
import { FileText, ExternalLink, Briefcase } from "lucide-react";

interface SameProjectBlueprintBarProps {
  blueprints: SameProjectBlueprint[];
  projectId: string;
  currentPath: string; // 'basic-information', 'estimate', 'similar' など
}

export function SameProjectBlueprintBar({ 
  blueprints, 
  currentPath 
}: SameProjectBlueprintBarProps) {
  const getStatusIndicator = (status: SameProjectBlueprint['status']) => {
    switch (status) {
      case 'completed':
        return { color: 'bg-green-500', label: '完了' };
      case 'in_progress':
        return { color: 'bg-blue-500', label: '進行中' };
      case 'pending':
        return { color: 'bg-gray-400', label: '未着手' };
      default:
        return { color: 'bg-gray-400', label: '未着手' };
    }
  };

  const handleOpenBlueprintPage = (blueprintId: string, path: string) => {
    window.open(`/blueprint/${blueprintId}/${path}`, '_blank');
  };

  const handleOpenProjectPage = (projectNumber: string) => {
    window.open(`/project/${projectNumber}/basic-information`, '_blank');
  };

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-white via-white/50 to-transparent backdrop-blur-sm border-b">
      <div className="flex items-center gap-3 h-full overflow-x-auto p-4">
        {blueprints.map((blueprint) => (
          <Tooltip key={blueprint.id} delayDuration={300}>
            <TooltipTrigger asChild>
              <div className="flex-shrink-0">
                <Card className={`w-40 transition-all duration-200 p-0`}>
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
                      
                      {/* 名前 */}
                      <div className="px-1">
                        <h4 className="text-xs font-medium text-gray-900 truncate" title={blueprint.name}>
                          {blueprint.name}
                        </h4>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
                
                {/* 情報部分 */}
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{blueprint.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusIndicator(blueprint.status).color}`}></div>
                      <span className="text-xs text-gray-600">{getStatusIndicator(blueprint.status).label}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{blueprint.filename}</p>
                  <div className="mt-3 pt-2 border-t">
                    <div className="flex gap-2">
                      <Button
                        onClick={(e) => handleButtonClick(e, () => handleOpenBlueprintPage(blueprint.id, currentPath))}
                        size="sm"
                        className="flex-1"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        図面ページを開く
                      </Button>
                      <Button
                        onClick={(e) => handleButtonClick(e, () => handleOpenProjectPage(blueprint.projectId))}
                        size="sm"
                        className="flex-1"
                      >
                        <Briefcase className="h-3 w-3 mr-1" />
                        案件ページを開く
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
        
        {blueprints.length === 0 && (
          <div className="text-sm text-gray-500">
            同一案件の図面はありません
          </div>
        )}
      </div>
    </div>
  );
}