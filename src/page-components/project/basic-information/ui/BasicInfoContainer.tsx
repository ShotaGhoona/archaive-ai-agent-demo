"use client";
import { useState } from "react";
import { Blueprint } from "@/page-components";
import { ProjectData, projectConfig } from "../data";
import { ProjectInfoForm, BlueprintGallery } from "../ui";

export function BasicInfoContainer() {
  const [formData, setFormData] = useState<ProjectData>(projectConfig.projectData);
  const [blueprints] = useState<Blueprint[]>(projectConfig.blueprints as unknown as Blueprint[]);

  const handleInputChange = (field: keyof ProjectData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Auto-save or debounced save logic can be added here
    console.log("Field updated:", field, value);
  };

  const { fieldConfig } = projectConfig;

  return (
    <div className="flex-1 flex overflow-hidden grid grid-cols-2 gap-4">
      {/* 左半分 - 案件情報 */}
      <ProjectInfoForm
        formData={formData}
        fieldConfig={fieldConfig}
        onChange={handleInputChange}
      />

      {/* 右半分 - 登録図面情報 */}
      <BlueprintGallery blueprints={blueprints} />
    </div>
  );
}