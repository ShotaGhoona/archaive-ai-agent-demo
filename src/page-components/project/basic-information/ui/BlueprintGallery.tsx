"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { GalleryView } from "@/shared";
import { Blueprint } from "@/page-components";
import { createProjectBlueprintGalleryConfig } from "../lib";

interface BlueprintGalleryProps {
  blueprints: Blueprint[];
}

export function BlueprintGallery({ blueprints }: BlueprintGalleryProps) {
  const router = useRouter();

  const handlePopup = (blueprint: Blueprint) => {
    // ポップアップ処理を実装
    console.log("ポップアップで表示:", blueprint);
    // TODO: ポップアップモーダルコンポーネントを開く
  };

  const handleFullPage = (blueprint: Blueprint) => {
    // フルページに遷移
    router.push(`/blueprint/${blueprint.internalNumber}/basic-information`);
  };

  const galleryConfig = createProjectBlueprintGalleryConfig(handlePopup, handleFullPage);
  
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