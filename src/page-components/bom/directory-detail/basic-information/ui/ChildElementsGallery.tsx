'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Image as ImageIcon, Folder } from 'lucide-react';
import { TabNavigation } from '@/shared';
import { Directory, DirectoryDocument, DrawingFile, LeafProduct } from '@/page-components/bom/shared/data/data-type';

interface ChildElementsGalleryProps {
  directoryData: Directory;
}

type TabKey = 'directories' | 'documents' | 'drawings';

export function ChildElementsGallery({ directoryData }: ChildElementsGalleryProps) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<TabKey>('directories');

  // 直下のDirectory要素を抽出
  const childDirectories = directoryData.children.filter(
    (child) => child.type === 'directory'
  ) as Directory[];

  // 帳票を抽出
  const documents = directoryData.documents || [];

  // 直下のLeafProduct要素とその図面を抽出
  const childLeafProducts = directoryData.children.filter(
    (child) => child.type === 'leaf-product'
  ) as LeafProduct[];

  // 全LeafProductの図面を平坦化して取得
  const allDrawings: Array<{ drawing: DrawingFile; leafProductName: string }> = [];
  childLeafProducts.forEach((leafProduct) => {
    leafProduct.drawings.forEach((drawing) => {
      allDrawings.push({
        drawing,
        leafProductName: leafProduct.name,
      });
    });
  });

  const handleDirectoryClick = (directoryId: string) => {
    router.push(`/bom/directory/${directoryId}/basic-information`);
  };

  // タブアイテム定義
  const tabItems = [
    {
      key: 'directories',
      label: `Directory (${childDirectories.length})`,
      icon: Folder,
    },
    {
      key: 'documents',
      label: `帳票 (${documents.length})`,
      icon: FileText,
    },
    {
      key: 'drawings',
      label: `図面 (${allDrawings.length})`,
      icon: ImageIcon,
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
        {/* Directoryタブ */}
        {selectedTab === 'directories' && (
          <div className="w-full overflow-y-auto px-6 py-4">
            {childDirectories.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {childDirectories.map((dir) => (
                  <button
                    key={dir.id}
                    onClick={() => handleDirectoryClick(dir.id)}
                    className="flex flex-col items-start gap-2 rounded-lg border border-gray-200 p-4 text-left transition-all hover:border-primary hover:shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      <Folder className="h-5 w-5 text-primary" />
                      <span className="text-xs font-medium text-gray-500">
                        {dir.directoryTypeName}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900">{dir.name}</h4>
                    <p className="text-xs text-gray-500">ULID: {dir.ulid}</p>
                    <p className="text-xs text-gray-500">SEQ: {dir.seqNumber}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center py-12">
                <p className="text-gray-500">直下にDirectoryがありません</p>
              </div>
            )}
          </div>
        )}

        {/* 帳票タブ */}
        {selectedTab === 'documents' && (
          <div className="w-full overflow-y-auto px-6 py-4">
            {documents.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {documents.map((doc) => {
                  // 最新バージョンを取得
                  const latestVersion = doc.versions[doc.versions.length - 1];
                  return (
                    <div
                      key={doc.id}
                      className="flex flex-col gap-2 rounded-lg border border-gray-200 p-3 transition-all hover:border-primary hover:shadow-md"
                    >
                      {/* プレビュー画像 */}
                      <div className="aspect-[3/4] w-full overflow-hidden rounded-md bg-gray-100">
                        {latestVersion?.previewImageUrl ? (
                          <img
                            src={latestVersion.previewImageUrl}
                            alt={latestVersion.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <FileText className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      {/* 文書情報 */}
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500">{doc.typeName}</p>
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-2">
                          {latestVersion?.name || 'Untitled'}
                        </h4>
                        <p className="text-xs text-gray-500">
                          v{latestVersion?.version} | ULID: {doc.ulid}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center py-12">
                <p className="text-gray-500">帳票がありません</p>
              </div>
            )}
          </div>
        )}

        {/* 図面タブ */}
        {selectedTab === 'drawings' && (
          <div className="w-full overflow-y-auto px-6 py-4">
            {allDrawings.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {allDrawings.map(({ drawing, leafProductName }) => (
                  <div
                    key={drawing.id}
                    className="flex flex-col gap-2 rounded-lg border border-gray-200 p-3 transition-all hover:border-primary hover:shadow-md"
                  >
                    {/* プレビュー画像 */}
                    <div className="aspect-[3/4] w-full overflow-hidden rounded-md bg-gray-100">
                      {drawing.previewImageUrl ? (
                        <img
                          src={drawing.previewImageUrl}
                          alt={drawing.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {/* 図面情報 */}
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">{leafProductName}</p>
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-2">
                        {drawing.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {drawing.fileExtension.toUpperCase()} | ULID: {drawing.ulid}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center py-12">
                <p className="text-gray-500">図面がありません</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
