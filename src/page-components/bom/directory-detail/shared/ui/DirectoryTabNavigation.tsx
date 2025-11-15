'use client';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared';
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
    <div className='scrollbar-hide flex items-center gap-6 overflow-x-auto'>
      {directoryDetailTabs.map((tab) => {
        const isActive = activeTab === tab.id;

        const TabLink = (
          <Link
            href={tab.href(directoryId)}
            className={`flex flex-shrink-0 items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
              isActive
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </Link>
        );

        return tab.description ? (
          <Tooltip key={tab.id} delayDuration={500}>
            <TooltipTrigger asChild>{TabLink}</TooltipTrigger>
            <TooltipContent side='bottom'>
              <p>{tab.description}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div key={tab.id}>{TabLink}</div>
        );
      })}
    </div>
  );
}
