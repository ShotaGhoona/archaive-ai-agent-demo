"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GalleryView } from "@/shared";
import { Blueprint } from "@/page-components";
import { createProjectBlueprintGalleryConfig } from "../lib";
import { BlueprintDetailDialog } from "./BlueprintDetailDialog";

interface BlueprintGalleryProps {
  blueprints: Blueprint[];
}

export function BlueprintGallery({ blueprints }: BlueprintGalleryProps) {
  const router = useRouter();
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleShowDetail = (blueprint: Blueprint) => {
    setSelectedBlueprint(blueprint);
    setIsDialogOpen(true);
  };

  const handleFullPage = (blueprint: Blueprint) => {
    // フルページに遷移
    router.push(`/blueprint/${blueprint.internalNumber}/basic-information`);
  };

  const galleryConfig = createProjectBlueprintGalleryConfig(handleShowDetail, handleFullPage);
  
  return (
    <div className="bg-white flex flex-col px-6 pt-6 h-full">
      <h3 className="text-lg font-semibold mb-4">登録図面</h3>
      <div className="flex-1 overflow-y-auto">
        <GalleryView
          data={blueprints}
          config={galleryConfig}
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