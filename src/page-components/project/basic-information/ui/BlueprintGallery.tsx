'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GalleryView } from '@/shared';
import { createProjectBlueprintGalleryConfig } from '../lib/projectBlueprintGalleryConfig';
import { BlueprintDetailDataInterface } from '@/dummy-data-er-fix/blueprint/interfaces/types';
import { BlueprintDetailDialog } from './BlueprintDetailDialog';

interface BlueprintGalleryProps {
  blueprints: BlueprintDetailDataInterface[];
  onBlueprintUpdate?: (blueprintId: number, updatedBlueprint: Partial<BlueprintDetailDataInterface>) => void;
  isLoading?: boolean;
}

export function BlueprintGallery({ 
  blueprints, 
  onBlueprintUpdate, 
  isLoading = false 
}: BlueprintGalleryProps) {
  const router = useRouter();
  const [selectedBlueprint, setSelectedBlueprint] = useState<BlueprintDetailDataInterface | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleShowDetail = (blueprint: BlueprintDetailDataInterface) => {
    setSelectedBlueprint(blueprint);
    setIsDialogOpen(true);
  };

  const handleFullPage = (blueprint: BlueprintDetailDataInterface) => {
    // 図面詳細画面への遷移
    router.push(`/blueprint/${blueprint.id}/basic-information`);
  };

  const galleryConfig = createProjectBlueprintGalleryConfig(
    handleShowDetail,
    handleFullPage,
  );

  return (
    <div className='flex h-full flex-col bg-white px-4 pt-4'>
      <h3 className='mb-4 text-lg text-primary font-semibold'>登録図面</h3>
      <div className='flex-1 overflow-y-auto'>
        <GalleryView 
          data={blueprints} 
          config={galleryConfig} 
          loading={isLoading}
        />
      </div>

      {selectedBlueprint && (
        <BlueprintDetailDialog
          blueprint={selectedBlueprint}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </div>
  );
}