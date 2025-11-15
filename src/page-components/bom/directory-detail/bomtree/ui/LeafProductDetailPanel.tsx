'use client';

import { useState } from 'react';
import { FileImage, Info, Search, DollarSign } from 'lucide-react';
import { TabNavigation, PicturePreviewContainer } from '@/shared';
import { LeafProduct } from '@/page-components/bom/shared/data/data-type';

interface LeafProductDetailPanelProps {
  leafProductData: LeafProduct;
}

type TabKey = 'drawings' | 'basic-info' | 'similar-search' | 'estimate';

export function LeafProductDetailPanel({ leafProductData }: LeafProductDetailPanelProps) {
  const [selectedTab, setSelectedTab] = useState<TabKey>('drawings');

  // 最初の図面を取得（存在する場合）
  const firstDrawing = leafProductData.drawings.length > 0 ? leafProductData.drawings[0] : null;

  // タブアイテム定義
  const tabItems = [
    {
      key: 'drawings',
      label: '図面',
      icon: FileImage,
    },
    {
      key: 'basic-info',
      label: '基本情報',
      icon: Info,
    },
    {
      key: 'similar-search',
      label: '類似図面検索',
      icon: Search,
    },
    {
      key: 'estimate',
      label: '見積もり情報',
      icon: DollarSign,
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
        {selectedTab === 'drawings' && (
          <div className="w-full h-full">
            <PicturePreviewContainer
              activeFile={firstDrawing && firstDrawing.previewImageUrl ? { imageUrl: firstDrawing.previewImageUrl } : null}
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
                      value={leafProductData.ulid}
                      disabled
                      className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className='text-sm font-medium text-gray-700'>
                      リビジョン番号 <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={leafProductData.revisionNumber}
                      disabled
                      className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className='text-sm font-medium text-gray-700'>
                      名称 <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={leafProductData.name}
                      disabled
                      className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className='text-sm font-medium text-gray-700'>
                      数量
                    </label>
                    <input
                      type="number"
                      value={leafProductData.quantity}
                      disabled
                      className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                    />
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <label className='text-sm font-medium text-gray-700'>
                      備考
                    </label>
                    <textarea
                      value={leafProductData.remarks || ''}
                      disabled
                      rows={3}
                      className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* カスタム情報セクション */}
              {leafProductData.customItems && Object.keys(leafProductData.customItems).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-primary">カスタム項目</h3>
                  <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
                    {Object.entries(leafProductData.customItems).map(([key, value]) => (
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
                      value={leafProductData.createdBy}
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
                      value={leafProductData.updatedBy}
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
                      value={new Date(leafProductData.createdAt).toLocaleDateString('ja-JP')}
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
                      value={new Date(leafProductData.updatedAt).toLocaleDateString('ja-JP')}
                      disabled
                      className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'similar-search' && (
          <div className="w-full overflow-y-auto px-6 py-4">
            <p>類似図面検索タブ（実装予定）</p>
          </div>
        )}

        {selectedTab === 'estimate' && (
          <div className="w-full overflow-y-auto px-6 py-4">
            <p>見積もり情報タブ（実装予定）</p>
          </div>
        )}
      </div>
    </div>
  );
}
