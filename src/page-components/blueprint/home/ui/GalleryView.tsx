import React from 'react';
import { GalleryView } from '@/shared/view/gallery-view';
import { Blueprint } from '../lib/blueprintColumns';
import { createBlueprintGalleryConfig } from '../lib/blueprintGalleryConfig';

interface BlueprintGalleryViewProps {
  blueprints: Blueprint[];
}

export function BlueprintGalleryView({ blueprints }: BlueprintGalleryViewProps) {
  const galleryConfig = createBlueprintGalleryConfig();
  
  return (
    <GalleryView
      data={blueprints}
      config={galleryConfig}
    />
  );
}