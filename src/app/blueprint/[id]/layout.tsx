'use client';
import { useState } from 'react';
import { BlueprintTabNavigation } from '@/shared';
import {
  QuickAccessControls,
  RevisionBlueprintBarContainer,
} from '@/widgets/blueprint/quick-access-navigation';
import { LeafProductDataInterface, blueprintRevisionData } from '@/dummy-data-er-fix/blueprint';
interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [showRevisionBlueprints, setShowRevisionBlueprints] = useState(false);

  const handleToggleRevision = () => {
    setShowRevisionBlueprints((prev) => !prev);
  };

  return (
    <div className='flex h-[calc(100vh-60px)] flex-col overflow-hidden'>
      <div className='flex-shrink-0 border-b bg-white p-4'>
        <div className='flex items-center justify-between'>
          <BlueprintTabNavigation />
          <QuickAccessControls
            showRevision={showRevisionBlueprints}
            onToggleRevision={handleToggleRevision}
          />
        </div>
      </div>

      <div className='relative h-full flex-1 overflow-hidden'>
        <div className='h-full'>{children}</div>

        {/* Quick Access Overlays */}

        {showRevisionBlueprints && (
          <RevisionBlueprintBarContainer
            blueprints={blueprintRevisionData}
          />
        )}
      </div>
    </div>
  );
}
