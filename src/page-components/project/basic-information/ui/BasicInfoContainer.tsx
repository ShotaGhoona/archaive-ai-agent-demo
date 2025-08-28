"use client";
import { useState } from "react";
import { Blueprint } from "@/page-components";
import { ResizableLayout, ResizablePanel, ResizableHandle } from "@/shared";
import { ProjectData, projectConfig } from "../data";
import { ProjectInfoForm, BlueprintGallery } from "../ui";
import { basicInfoResizableLayoutConfig } from "../lib/basicInfoResizableLayoutConfig";

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
    <div className="flex-1 flex overflow-hidden">
      <ResizableLayout config={basicInfoResizableLayoutConfig} className="h-full">
        <ResizablePanel index={0}>
          {/* 左半分 - 案件情報 */}
          <ProjectInfoForm
            formData={formData}
            fieldConfig={fieldConfig}
            onChange={handleInputChange}
          />
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel index={1}>
          {/* 右半分 - 登録図面情報 */}
          <BlueprintGallery blueprints={blueprints} />
        </ResizablePanel>
      </ResizableLayout>
    </div>
  );
}