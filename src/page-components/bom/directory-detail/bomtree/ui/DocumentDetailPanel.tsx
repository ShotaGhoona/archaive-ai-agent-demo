'use client';

import { useState } from 'react';
import { FileText, Info } from 'lucide-react';
import { TabNavigation, PicturePreviewContainer } from '@/shared';
import { DocumentNode } from '@/page-components/bom/shared/data/data-type';

interface DocumentDetailPanelProps {
  documentNode: DocumentNode;
}

type TabKey = 'document' | 'basic-info';

export function DocumentDetailPanel({ documentNode }: DocumentDetailPanelProps) {
  const [selectedTab, setSelectedTab] = useState<TabKey>('document');

  // 最新バージョンを取得
  const latestVersion = documentNode.document.versions[documentNode.document.versions.length - 1];

  // タブアイテム定義
  const tabItems = [
    {
      key: 'document',
      label: documentNode.document.typeName,
      icon: FileText,
    },
    {
      key: 'basic-info',
      label: '基本情報',
      icon: Info,
    },
  ];

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* タブナビゲーション */}
      <TabNavigation
        items={tabItems}
        selectedKey={selectedTab}
        onTabChange={(key) => setSelectedTab(key as TabKey)}
      />

      {/* タブコンテンツ */}
      <div className="flex flex-1 overflow-hidden">
        {selectedTab === 'document' && (
          <div className="w-full h-full">
            <PicturePreviewContainer
              activeFile={latestVersion?.previewImageUrl ? { imageUrl: latestVersion.previewImageUrl } : null}
              backgroundVariant="white-dot"
            />
          </div>
        )}

        {selectedTab === 'basic-info' && (
          <div className="w-full overflow-y-auto p-4">
            <div className="space-y-6">
              {/* 基本情報セクション */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary">基本情報</h3>
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                  <div className="space-y-2">
                    <label className='text-sm font-medium text-gray-700'>
                      ULID <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={documentNode.document.ulid}
                      disabled
                      className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className='text-sm font-medium text-gray-700'>
                      タイプ名 <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={documentNode.document.typeName}
                      disabled
                      className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                    />
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <label className='text-sm font-medium text-gray-700'>
                      備考
                    </label>
                    <textarea
                      value={documentNode.document.remarks || ''}
                      disabled
                      rows={3}
                      className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* 最新バージョン情報セクション */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary">最新バージョン情報</h3>
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                  <div className="space-y-2">
                    <label className='text-sm font-medium text-gray-700'>
                      バージョン番号
                    </label>
                    <input
                      type="text"
                      value={latestVersion?.version || 'N/A'}
                      disabled
                      className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className='text-sm font-medium text-gray-700'>
                      バージョン名
                    </label>
                    <input
                      type="text"
                      value={latestVersion?.name || 'N/A'}
                      disabled
                      className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className='text-sm font-medium text-gray-700'>
                      ファイル拡張子
                    </label>
                    <input
                      type="text"
                      value={latestVersion?.fileExtension?.toUpperCase() || 'N/A'}
                      disabled
                      className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className='text-sm font-medium text-gray-700'>
                      ファイルサイズ (bytes)
                    </label>
                    <input
                      type="text"
                      value={latestVersion?.fileSizeBytes?.toLocaleString() || 'N/A'}
                      disabled
                      className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* カスタム情報セクション */}
              {documentNode.document.customItems && Object.keys(documentNode.document.customItems).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-primary">カスタム項目</h3>
                  <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
                    {Object.entries(documentNode.document.customItems).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <label className='text-sm font-medium text-gray-700'>
                          {key}
                        </label>
                        <input
                          type="text"
                          value={typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                          disabled
                          className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* システム情報セクション */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary">システム情報</h3>
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                  <div className="space-y-2">
                    <label className='text-sm font-medium text-gray-700'>
                      作成者
                    </label>
                    <input
                      type="text"
                      value={documentNode.document.createdBy}
                      disabled
                      className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className='text-sm font-medium text-gray-700'>
                      更新者
                    </label>
                    <input
                      type="text"
                      value={documentNode.document.updatedBy}
                      disabled
                      className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className='text-sm font-medium text-gray-700'>
                      作成日
                    </label>
                    <input
                      type="text"
                      value={new Date(documentNode.document.createdAt).toLocaleDateString('ja-JP')}
                      disabled
                      className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className='text-sm font-medium text-gray-700'>
                      更新日
                    </label>
                    <input
                      type="text"
                      value={new Date(documentNode.document.updatedAt).toLocaleDateString('ja-JP')}
                      disabled
                      className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
