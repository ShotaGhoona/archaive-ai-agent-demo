'use client';

import { useState } from 'react';
import { ResizableLayout, ResizablePanel, ResizableHandle } from '@/shared';
import { ProjectInfoForm } from './ProjectInfoForm';
import { BlueprintGallery } from './BlueprintGallery';
import projectDetailData from '@/dummy-data-er-fix/project/project-detail-data.json';
import { ProjectDetailDataInterface, DirectoryBaseDataInterface } from '@/dummy-data-er-fix/project/interfaces/types';
import { BlueprintDetailDataInterface } from '@/dummy-data-er-fix/blueprint/interfaces/types';
import { basicInfoResizableLayoutConfig } from '../lib/basicInfoResizableLayoutConfig';

interface BasicInfoContainerProps {
  projectId?: string;
}

export function BasicInfoContainer({ projectId }: BasicInfoContainerProps) {
  const [projectData, setProjectData] = useState<ProjectDetailDataInterface>(
    projectDetailData as ProjectDetailDataInterface
  );
  const [isLoading, setIsLoading] = useState(false);

  // プロジェクトデータの更新処理
  const handleProjectUpdate = (updatedProject: Partial<DirectoryBaseDataInterface>) => {
    setProjectData(prev => ({
      ...prev,
      project: { ...prev.project, ...updatedProject }
    }));
  };

  // 図面データの更新処理
  const handleBlueprintUpdate = (blueprintId: number, updatedBlueprint: Partial<BlueprintDetailDataInterface>) => {
    setProjectData(prev => ({
      ...prev,
      blueprints: prev.blueprints.map(blueprint =>
        blueprint.id === blueprintId ? { ...blueprint, ...updatedBlueprint } : blueprint
      )
    }));
  };

  // 保存処理
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: API呼び出し
      console.log('Saving project data:', projectData);
      // await saveProjectData(projectData);
    } catch (error) {
      console.error('Failed to save project data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-1 overflow-hidden'>
      <ResizableLayout config={basicInfoResizableLayoutConfig}>
        <ResizablePanel index={0}>
          {/* 左側: プロジェクト情報フォーム */}
          <ProjectInfoForm
            projectData={projectData.project}
            onUpdate={handleProjectUpdate}
            onSave={handleSave}
            isLoading={isLoading}
          />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel index={1}>
          {/* 右側: 図面ギャラリー */}
          <BlueprintGallery
            blueprints={projectData.blueprints}
            onBlueprintUpdate={handleBlueprintUpdate}
            isLoading={isLoading}
          />
        </ResizablePanel>
      </ResizableLayout>
    </div>
  );
}