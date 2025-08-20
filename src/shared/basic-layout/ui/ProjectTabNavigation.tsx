'use client';
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/shared/shadcnui";
import { blueprintDetailTabs } from "../constants/project-navigation";

export function ProjectTabNavigation() {
  const pathname = usePathname();
  const params = useParams();
  const blueprintId = params.id as string;

  // 現在のタブをパスから判定
  const getCurrentTab = () => {
    const pathSegments = pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // パスの最後がIDの場合はblueprint（デフォルト）
    if (lastSegment === blueprintId) {
      return 'blueprint';
    }
    
    // タブIDに該当するものがあればそれを返す
    const foundTab = blueprintDetailTabs.find(tab => tab.id === lastSegment);
    return foundTab ? foundTab.id : 'blueprint';
  };

  const activeTab = getCurrentTab();

  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
      {blueprintDetailTabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <Tooltip key={tab.id} delayDuration={500}>
            <TooltipTrigger asChild>
              <Link href={tab.href(blueprintId)}>
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
            <TooltipContent side="bottom">
              <p>{tab.description}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}