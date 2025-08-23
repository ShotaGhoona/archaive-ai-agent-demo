import React from 'react';
import { GalleryView } from '@/shared';
import { Blueprint, createBlueprintGalleryConfig } from '../lib';

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