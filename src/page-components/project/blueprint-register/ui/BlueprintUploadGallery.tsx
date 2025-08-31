'use client';
import React from 'react';
import { GalleryView } from '@/shared/view/gallery-view';
import { projectDetailData } from '@/dummy-data-er-fix/project';
import { createRegisterBlueprintGalleryConfig } from '../lib';

export function BlueprintUploadGallery() {
  const galleryConfig = createRegisterBlueprintGalleryConfig();

  return (
    <div className='flex flex-col h-full overflow-hidden px-6 pt-6'>
      <GalleryView data={projectDetailData.blueprints} config={galleryConfig} />
    </div>
  );
}
