'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { ResizableLayout, ResizablePanel, ResizableHandle } from '@/shared';
import { DirectoryInfoForm } from './DirectoryInfoForm';
import { ChildElementsGallery } from './ChildElementsGallery';
import bomTreeData from '@/page-components/bom/shared/data/mock6LayerRobotArm.json';
import { BomTree, Directory, BomNode } from '@/page-components/bom/shared/data/data-type';
import { basicInfoResizableLayoutConfig } from '../lib/basicInfoResizableLayoutConfig';

interface BasicInformationContainerProps {
  directoryId?: string;
}

// BOMツリーから指定IDのDirectoryを再帰的に検索
function findDirectoryById(node: BomNode, targetId: string): Directory | null {
  if (node.type === 'directory') {
    const dir = node as Directory;
    if (dir.id === targetId) {
      return dir;
    }
    // 子要素を再帰的に検索
    for (const child of dir.children) {
      const found = findDirectoryById(child, targetId);
      if (found) return found;
    }
  }
  return null;
}

export function BasicInformationContainer({ directoryId }: BasicInformationContainerProps) {
  const params = useParams();
  const id = (params?.id as string) || directoryId;

  // URLパラメータからDirectoryを検索
  const directoryData = useMemo(() => {
    const bomTree = bomTreeData as BomTree;
    if (!id) {
      return bomTree.root as Directory;
    }
    const found = findDirectoryById(bomTree.root, id);
    return found || (bomTree.root as Directory);
  }, [id]);

  const [isLoading, setIsLoading] = useState(false);

  // Directoryデータの更新処理
  const handleDirectoryUpdate = (updatedDirectory: Partial<Directory>) => {
    // TODO: 状態更新とAPI呼び出し
    console.log('Update directory:', updatedDirectory);
  };

  // 保存処理
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: API呼び出し
      console.log('Saving directory data:', directoryData);
      // await saveDirectoryData(directoryData);
    } catch (error) {
      console.error('Failed to save directory data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!directoryData) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Directory not found (ID: {id})</p>
      </div>
    );
  }

  return (
    <div className='w-full flex-1'>
      <ResizableLayout config={basicInfoResizableLayoutConfig}>
        <ResizablePanel index={0}>
          {/* 左側: Directory情報フォーム */}
          <DirectoryInfoForm
            directoryData={directoryData}
            onUpdate={handleDirectoryUpdate}
            onSave={handleSave}
            isLoading={isLoading}
          />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel index={1}>
          {/* 右側: 帳票・図面ギャラリー */}
          <ChildElementsGallery directoryData={directoryData} />
        </ResizablePanel>
      </ResizableLayout>
    </div>
  );
}
