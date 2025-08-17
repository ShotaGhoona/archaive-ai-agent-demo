'use client';
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/shared/shadcnui";
import { blueprintTabs } from "../constants/blueprint-navigation";

export function BlueprintTabNavigation() {
  const pathname = usePathname();
  const params = useParams();
  const projectId = params.id as string;

  // 現在のタブをパスから判定
  const getCurrentTab = () => {
    const pathSegments = pathname.split('/');
    
    // /project/{id}/blueprint の場合は基本情報タブ
    if (pathSegments.includes('blueprint') && pathSegments[pathSegments.length - 1] === 'blueprint') {
      return 'basic-information';
    }
    
    // /project/{id}/blueprint/similar などの場合
    if (pathSegments.includes('blueprint')) {
      const lastSegment = pathSegments[pathSegments.length - 1];
      
      // 完全一致を最初にチェック
      const exactMatch = blueprintTabs.find(tab => tab.id === lastSegment);
      if (exactMatch) return exactMatch.id;
      
      // 部分一致をチェック（similar-blueprints -> similar など）
      const partialMatch = blueprintTabs.find(tab => {
        const tabParts = tab.id.split('-');
        return tabParts.some(part => lastSegment.includes(part));
      });
      
      return partialMatch ? partialMatch.id : 'basic-information';
    }
    
    return 'basic-information';
  };

  const activeTab = getCurrentTab();

  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
      {blueprintTabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <Tooltip key={tab.id}>
            <TooltipTrigger asChild>
              <Link href={tab.href(projectId)}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="lg"
                  className={`
                    flex-shrink-0 h-12 px-4 gap-2 text-sm font-medium transition-all
                    ${isActive 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }
                  `}
                >
                  {tab.icon}
                  {tab.label}
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tab.description}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}