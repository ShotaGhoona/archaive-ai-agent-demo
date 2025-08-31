'use client';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/shared';
import { customerMenuItems } from '../constants';

export function CustomerTabNavigation() {
  const pathname = usePathname();
  const params = useParams();
  const customerId = params.id as string;

  const getCurrentTab = () => {
    const pathSegments = pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];

    if (lastSegment === customerId) {
      return 'profile';
    }

    const foundTab = customerMenuItems.find((tab) => tab.id === lastSegment);
    return foundTab ? foundTab.id : 'profile';
  };

  const activeTab = getCurrentTab();

  return (
    <div className='scrollbar-hide flex items-center gap-1 overflow-x-auto'>
      {customerMenuItems.map((tab) => {
        const isActive = activeTab === tab.id;
        const href = tab.href.replace('[id]', customerId);

        return (
          <Tooltip key={tab.id} delayDuration={500}>
            <TooltipTrigger asChild>
              <Link href={href}>
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
        );
      })}
    </div>
  );
}
