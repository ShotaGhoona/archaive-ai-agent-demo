import React from 'react';
import { GalleryView } from '@/shared';
import { DrawingPageBaseDataInterface } from '@/dummy-data-er-fix/blueprint';
import { createBlueprintGalleryConfig } from '../lib';

interface BlueprintGalleryViewProps {
  blueprints: DrawingPageBaseDataInterface[];
}

export function BlueprintGalleryView({
  blueprints,
}: BlueprintGalleryViewProps) {
  const galleryConfig = createBlueprintGalleryConfig();

  return <GalleryView data={blueprints} config={galleryConfig} />;
}
