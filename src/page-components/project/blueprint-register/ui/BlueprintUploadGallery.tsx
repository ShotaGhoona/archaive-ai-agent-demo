"use client";
import React from "react";
import { GalleryView } from "@/shared/view/gallery-view";
import { registerBlueprintsData } from "../data";
import { createRegisterBlueprintGalleryConfig } from "../lib";

export function BlueprintUploadGallery() {
  const galleryConfig = createRegisterBlueprintGalleryConfig();

  return (
    <div className="flex flex-col p-6">
      <GalleryView
        data={registerBlueprintsData}
        config={galleryConfig}
      />
    </div>
  );
}