'use client';

import { DirectoryDocument, BomNode, LeafProduct } from '../../../shared/data/types';
import { FileText, Image as ImageIcon } from 'lucide-react';

interface GalleryViewProps {
  documents: DirectoryDocument[];
  children: BomNode[];
}

export default function GalleryView({ documents, children }: GalleryViewProps) {
  // LeafProductのみをフィルタリング
  const leafProducts = children.filter((child) => child.type === 'leaf-product') as LeafProduct[];

  // 全アイテムを結合
  const allItems: Array<{ type: 'document' | 'drawing'; data: any }> = [
    ...documents.map((doc) => ({
      type: 'document' as const,
      data: doc,
    })),
    ...leafProducts.flatMap((leaf) =>
      (leaf.drawings || []).map((drawing) => ({
        type: 'drawing' as const,
        data: drawing,
      }))
    ),
  ];

  if (allItems.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="mb-4 text-lg font-semibold text-primary">直下の帳票・図面ギャラリー</h3>
      <div className="grid grid-cols-1 @[600px]:grid-cols-2 gap-4">
        {allItems.map((item, index) => {
          // プレビュー画像URLを取得
          const previewUrl = item.type === 'document'
            ? item.data.versions?.[0]?.previewImageUrl
            : item.data.previewImageUrl;

          return (
            <div
              key={index}
              className="cursor-pointer rounded-lg border border-gray-300 bg-gray-50 transition-all hover:border-primary hover:shadow-md overflow-hidden"
              onClick={() => {
                // TODO: 詳細ページへ遷移
                console.log('Navigate to detail page:', item);
              }}
            >
              <div className="flex items-start gap-3 p-3">
                {/* アイコン（狭い時 or プレビューがない時に表示） */}
                <div className={`flex-shrink-0 ${previewUrl ? '@[600px]:hidden' : ''}`}>
                  {item.type === 'document' ? (
                    <FileText className="h-5 w-5 text-primary" />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-primary" />
                  )}
                </div>

                {/* プレビュー画像（広い時 & URLがある時のみ表示） */}
                {previewUrl && (
                  <div className="hidden @[600px]:block flex-shrink-0 w-32 h-32 bg-gray-200 rounded overflow-hidden">
                    <img
                      src={previewUrl}
                      alt={item.type === 'document' ? item.data.typeName : item.data.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Failed to load image:', previewUrl);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* テキスト情報 */}
                <div className="flex-1 overflow-hidden min-w-0">
                  <div className="truncate text-sm font-medium text-gray-900">
                    {item.type === 'document'
                      ? item.data.typeName
                      : item.data.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.type === 'document'
                      ? `v${item.data.versions?.[0]?.version || 1}`
                      : item.data.pages?.[0]?.drawingNumber || '-'}
                  </div>
                  {/* 広い時に追加情報を表示 */}
                  <div className="hidden @[600px]:block text-xs text-gray-500 mt-2">
                    {item.type === 'document'
                      ? item.data.versions?.[0]?.name
                      : `${item.data.fileExtension || ''} • ${item.data.pages?.length || 0} ページ`}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
