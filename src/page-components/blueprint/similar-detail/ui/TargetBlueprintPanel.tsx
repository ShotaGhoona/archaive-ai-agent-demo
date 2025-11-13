'use client';
import React, { useState } from 'react';
import { TargetBlueprintPanelProps } from '../model';
import { Upload, Image as ImageIcon, Info } from 'lucide-react';
import { PicturePreviewContainer, TabNavigation } from '@/shared';
import { BasicInformationContainer } from '@/widgets';

export function TargetBlueprintPanel({
  targetBlueprint,
}: TargetBlueprintPanelProps) {
  const { blueprint, isUploaded } = targetBlueprint;
  const [activeTab, setActiveTab] = useState<string>('preview');

  if (!blueprint) {
    return (
      <div className='flex h-full flex-col items-center justify-center bg-gray-50 p-8'>
        <Upload className='mb-4 h-16 w-16 text-gray-300' />
        <p className='text-sm text-gray-500'>対象図面が選択されていません</p>
      </div>
    );
  }

  // PictureFile型に変換
  const pictureFile = blueprint.s3_url
    ? { imageUrl: blueprint.s3_url }
    : null;

  // タブ定義
  const tabs = [
    { key: 'preview', label: '図面プレビュー', icon: ImageIcon },
    { key: 'info', label: '基本情報', icon: Info },
  ];

  return (
    <div className='flex h-full flex-col bg-white'>
      {/* タブナビゲーション */}
      <TabNavigation
        items={tabs}
        selectedKey={activeTab}
        onTabChange={setActiveTab}
      />

      {/* タブコンテンツ */}
      <div className='relative flex flex-1 overflow-hidden w-full'>
        {activeTab === 'preview' && (
          <div className='w-full'>
            <PicturePreviewContainer activeFile={pictureFile} />
          </div>
        )}
        {activeTab === 'info' && (
          <div className='w-full'>
            <BasicInformationContainer blueprintData={blueprint} />
          </div>
        )}
      </div>
    </div>
  );
}
