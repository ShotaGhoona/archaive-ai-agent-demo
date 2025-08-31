'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Label,
} from '@/shared';
import { BlueprintDetailDataInterface } from '@/dummy-data-er-fix/blueprint/interfaces/types';

interface BlueprintDetailDialogProps {
  blueprint: BlueprintDetailDataInterface;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BlueprintDetailDialog({
  blueprint,
  open,
  onOpenChange,
}: BlueprintDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[80vh] min-w-7xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            図面詳細情報
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* 図面画像 */}
          <div className='space-y-2'>
            <div className='overflow-hidden rounded-lg border'>
              <img
                src={
                  blueprint.s3_url ||
                  'https://jp.meviy.misumi-ec.com/info/ja/wp-content/uploads/2022/04/y1-1.jpg'
                }
                alt={blueprint.drawing_file_name}
                className='w-full object-cover'
              />
            </div>
          </div>

          {/* 基本情報セクション */}
          <div className='space-y-4'>
            <h4 className='text-lg font-bold text-primary border-b pb-2'>基本情報</h4>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label className='text-sm font-medium text-gray-700'>ファイル名</Label>
                <p className='rounded border bg-gray-50 p-2 text-sm'>
                  {blueprint.drawing_file_name}
                </p>
              </div>
              <div className='space-y-2'>
                <Label className='text-sm font-medium text-gray-700'>製品名</Label>
                <p className='rounded border bg-gray-50 p-2 text-sm'>
                  {blueprint.leaf_product_name}
                </p>
              </div>
              <div className='space-y-2'>
                <Label className='text-sm font-medium text-gray-700'>図面番号</Label>
                <p className='rounded border bg-gray-50 p-2 text-sm'>
                  {blueprint.drawing_number}
                </p>
              </div>
              <div className='space-y-2'>
                <Label className='text-sm font-medium text-gray-700'>外部図面番号</Label>
                <p className='rounded border bg-gray-50 p-2 text-sm'>
                  {blueprint.external_drawing_number || '-'}
                </p>
              </div>
              <div className='space-y-2'>
                <Label className='text-sm font-medium text-gray-700'>顧客名</Label>
                <p className='rounded border bg-gray-50 p-2 text-sm'>
                  {blueprint.customer_name}
                </p>
              </div>
              <div className='space-y-2'>
                <Label className='text-sm font-medium text-gray-700'>会社名</Label>
                <p className='rounded border bg-gray-50 p-2 text-sm'>
                  {blueprint.company_name}
                </p>
              </div>
              <div className='space-y-2'>
                <Label className='text-sm font-medium text-gray-700'>ファイル形式</Label>
                <p className='rounded border bg-gray-50 p-2 text-sm'>
                  {blueprint.drawing_file_extension.toUpperCase()}
                </p>
              </div>
              <div className='space-y-2'>
                <Label className='text-sm font-medium text-gray-700'>カテゴリ</Label>
                <p className='rounded border bg-gray-50 p-2 text-sm'>
                  {blueprint.drawing_category_name}
                </p>
              </div>
            </div>
            
            {blueprint.remarks && (
              <div className='space-y-2'>
                <Label className='text-sm font-medium text-gray-700'>備考</Label>
                <p className='rounded border bg-gray-50 p-2 text-sm'>
                  {blueprint.remarks}
                </p>
              </div>
            )}
          </div>

          {/* カスタム項目セクション */}
          {blueprint.drawing_page_custom_items && Object.keys(blueprint.drawing_page_custom_items).length > 0 && (
            <div className='space-y-4'>
              <h4 className='text-lg font-bold text-primary border-b pb-2'>カスタム項目</h4>
              
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {Object.entries(blueprint.drawing_page_custom_items).map(([key, item]) => {
                  const customItem = item as { value: any; color?: string; type: string };
                  return (
                    <div key={key} className='space-y-2'>
                      <Label className='text-sm font-medium text-gray-700'>{key}</Label>
                      <div className='flex items-center gap-2'>
                        {customItem.color && (
                          <div 
                            className={`w-3 h-3 rounded-full bg-${customItem.color}-500 flex-shrink-0`}
                            title={`Color: ${customItem.color}`}
                          />
                        )}
                        <p className='rounded border bg-gray-50 p-2 text-sm flex-1'>
                          {customItem.value || '-'}
                          {customItem.type !== 'text' && (
                            <span className='text-xs text-gray-400 ml-1'>({customItem.type})</span>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* システム情報セクション */}
          <div className='space-y-4'>
            <h4 className='text-lg font-bold text-primary border-b pb-2'>システム情報</h4>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label className='text-sm font-medium text-gray-700'>作成者</Label>
                <p className='rounded border bg-gray-50 p-2 text-sm'>
                  {blueprint.created_by_name}
                </p>
              </div>
              <div className='space-y-2'>
                <Label className='text-sm font-medium text-gray-700'>更新者</Label>
                <p className='rounded border bg-gray-50 p-2 text-sm'>
                  {blueprint.updated_by_name}
                </p>
              </div>
              <div className='space-y-2'>
                <Label className='text-sm font-medium text-gray-700'>作成日時</Label>
                <p className='rounded border bg-gray-50 p-2 text-sm'>
                  {new Date(blueprint.created_at).toLocaleString('ja-JP')}
                </p>
              </div>
              <div className='space-y-2'>
                <Label className='text-sm font-medium text-gray-700'>更新日時</Label>
                <p className='rounded border bg-gray-50 p-2 text-sm'>
                  {new Date(blueprint.updated_at).toLocaleString('ja-JP')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
