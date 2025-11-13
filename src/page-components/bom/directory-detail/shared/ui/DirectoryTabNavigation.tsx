'use client';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/shared';
import { directoryDetailTabs } from '../constants';

export function DirectoryTabNavigation() {
  const pathname = usePathname();
  const params = useParams();
  const directoryId = params.id as string;

  // 現在のタブをパスから判定
  const getCurrentTab = () => {
    const pathSegments = pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];

    // パスの最後がIDの場合はbasic-information（デフォルト）
    if (lastSegment === directoryId) {
      return 'basic-information';
    }

    // タブIDに該当するものがあればそれを返す
    const foundTab = directoryDetailTabs.find((tab) => tab.id === lastSegment);
    return foundTab ? foundTab.id : 'basic-information';
  };

  const activeTab = getCurrentTab();

  return (
    <div className='scrollbar-hide flex items-center gap-1 overflow-x-auto'>
      {directoryDetailTabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return tab.description ? (
          <Tooltip key={tab.id} delayDuration={500}>
            <TooltipTrigger asChild>
              <Link href={tab.href(directoryId)}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size='lg'
                  className={`h-12 flex-shrink-0 gap-2 px-4 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  } `}
                >
                  {tab.icon}
                  {tab.label}
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side='bottom'>
              <p>{tab.description}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Link key={tab.id} href={tab.href(directoryId)}>
            <Button
              variant={isActive ? 'default' : 'ghost'}
              size='lg'
              className={`h-12 flex-shrink-0 gap-2 px-4 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              } `}
            >
              {tab.icon}
              {tab.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
