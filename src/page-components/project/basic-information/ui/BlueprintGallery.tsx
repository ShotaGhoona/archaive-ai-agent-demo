"use client";
import React from "react";
import { GalleryView } from "@/shared/view/gallery-view";
import { Blueprint } from "@/page-components/blueprint/home/lib/blueprintColumns";
import { createProjectBlueprintGalleryConfig } from "../lib/projectBlueprintGalleryConfig";

interface BlueprintGalleryProps {
  blueprints: Blueprint[];
}

export default function BlueprintGallery({ blueprints }: BlueprintGalleryProps) {
  const galleryConfig = createProjectBlueprintGalleryConfig();
  
  return (
    <div className="bg-white flex flex-col p-6">
      <h3 className="text-lg font-semibold mb-4">登録図面</h3>
      <div className="overflow-y-auto">
        <GalleryView
          data={blueprints}
          config={galleryConfig}
        />
      </div>
    </div>
  );
}