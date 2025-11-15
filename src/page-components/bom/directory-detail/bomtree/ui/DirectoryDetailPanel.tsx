'use client';

import { Save } from 'lucide-react';
import { Button } from '@/shared';
import { Directory } from '@/page-components/bom/shared/data/data-type';

interface DirectoryDetailPanelProps {
  directoryData: Directory;
}

export function DirectoryDetailPanel({ directoryData }: DirectoryDetailPanelProps) {
  return (
    <div className='flex h-full flex-col'>
      <div className='flex-1 overflow-y-auto p-4'>
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
                  value={directoryData.ulid}
                  disabled
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className='text-sm font-medium text-gray-700'>
                  シーケンス番号 <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  value={directoryData.seqNumber}
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
                  value={directoryData.name}
                  disabled
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className='text-sm font-medium text-gray-700'>
                  タイプ
                </label>
                <input
                  type="text"
                  value={directoryData.directoryTypeName}
                  disabled
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                />
              </div>

              <div className="space-y-2 lg:col-span-2">
                <label className='text-sm font-medium text-gray-700'>
                  備考
                </label>
                <textarea
                  value={directoryData.remarks || ''}
                  disabled
                  rows={3}
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* カスタム情報セクション */}
          {directoryData.customItems && Object.keys(directoryData.customItems).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-primary">カスタム項目</h3>
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
                {Object.entries(directoryData.customItems).map(([key, value]) => (
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
                  value={directoryData.createdBy}
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
                  value={directoryData.updatedBy}
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
                  value={new Date(directoryData.createdAt).toLocaleDateString('ja-JP')}
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
                  value={new Date(directoryData.updatedAt).toLocaleDateString('ja-JP')}
                  disabled
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
