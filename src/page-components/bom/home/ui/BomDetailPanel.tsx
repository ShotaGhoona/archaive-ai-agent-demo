'use client';

import type { BomNode, Directory, LeafProduct, DocumentNode } from '../data';
import { ScrollArea } from '@/shared';
import { FileText, Folder, Calendar, User, Tag, SquareChartGantt } from 'lucide-react';

interface BomDetailPanelProps {
  selectedNode: BomNode | null;
}

export function BomDetailPanel({ selectedNode }: BomDetailPanelProps) {
  if (!selectedNode) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <Folder className="mx-auto h-16 w-16 text-gray-300" />
          <p className="mt-4 text-lg font-medium text-gray-500">
            左のツリーからアイテムを選択してください
          </p>
        </div>
      </div>
    );
  }

  const isDirectory = selectedNode.type === 'directory';
  const isDocument = selectedNode.type === 'document';
  const isLeafProduct = selectedNode.type === 'leaf-product';

  // ドキュメントノードの場合
  if (isDocument) {
    const docNode = selectedNode as DocumentNode;
    const latestVersion = docNode.document.versions[0];
    return (
      <div className="flex flex-1 flex-col bg-gray-50">
        {/* ヘッダー */}
        <div className="border-b border-gray-200 bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{docNode.document.typeName}</h1>
                <span className="rounded bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  v{latestVersion.version}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{latestVersion.name}</p>
            </div>
          </div>
        </div>

        {/* コンテンツエリア */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            <div className="space-y-6">
              {/* バージョン履歴 */}
              <Section title="バージョン履歴">
                <div className="space-y-3">
                  {docNode.document.versions.map((version) => (
                    <div key={version.id} className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">v{version.version}</span>
                            <span className="text-sm text-gray-500">{version.name}</span>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            {new Date(version.createdAt).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                      </div>
                      {version.remarks && (
                        <p className="mt-2 text-sm text-gray-600">{version.remarks}</p>
                      )}
                      {Object.keys(version.customItems).length > 0 && (
                        <div className="mt-3 rounded bg-gray-50 p-3">
                          <pre className="text-xs text-gray-700">
                            {JSON.stringify(version.customItems, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      {/* ヘッダー */}
      <div className="border-b border-gray-200 bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary/10 p-3">
            {isDirectory ? (
              <Folder className="h-6 w-6 text-primary" />
            ) : (
              <SquareChartGantt className="h-6 w-6 text-primary" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{(selectedNode as any).name}</h1>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                {isDirectory ? (selectedNode as Directory).directoryTypeName : 'Leaf Product'}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>作成者: {(selectedNode as any).createdBy}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date((selectedNode as any).createdAt).toLocaleDateString('ja-JP')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* コンテンツエリア */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          <div className="space-y-6">
            {/* カスタムアイテム */}
            {selectedNode.customItemValues && selectedNode.customItemValues.length > 0 && (
              <Section title="カスタム項目">
                <div className="grid gap-4 sm:grid-cols-2">
                  {selectedNode.customItemValues.map((item) => (
                    <CustomItemCard key={item.itemId} item={item} />
                  ))}
                </div>
              </Section>
            )}

            {/* 図面（LeafProductの場合） */}
            {!isDirectory && (selectedNode as LeafProduct).drawings && (
              <Section title="図面ファイル">
                <div className="space-y-2">
                  {(selectedNode as LeafProduct).drawings.map((drawing) => (
                    <DrawingCard key={drawing.id} drawing={drawing} />
                  ))}
                </div>
              </Section>
            )}

            {/* 文書（Directoryの場合） */}
            {isDirectory && (selectedNode as Directory).documents && (
              <Section title="関連文書">
                <div className="space-y-2">
                  {(selectedNode as Directory).documents?.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} />
                  ))}
                </div>
              </Section>
            )}

            {/* 文書（LeafProductの場合） */}
            {!isDirectory && (selectedNode as any).documents && (selectedNode as any).documents.length > 0 && (
              <Section title="関連文書">
                <div className="space-y-2">
                  {(selectedNode as any).documents.map((doc: any) => (
                    <DocumentCard key={doc.id} document={doc} />
                  ))}
                </div>
              </Section>
            )}

            {/* 備考 */}
            {selectedNode.remarks && (
              <Section title="備考">
                <p className="text-sm text-gray-700">{selectedNode.remarks}</p>
              </Section>
            )}

            {/* JSONデータ（デバッグ用） */}
            <Section title="カスタム項目（JSON）">
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs text-gray-100">
                {JSON.stringify(selectedNode.customItems, null, 2)}
              </pre>
            </Section>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// セクションコンポーネント
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-gray-900">{title}</h2>
      {children}
    </div>
  );
}

// カスタムアイテムカード
function CustomItemCard({ item }: { item: any }) {
  const renderValue = () => {
    if (item.type === 'SELECT' && item.options) {
      const option = item.options.find((opt: any) => opt.value === item.value);
      return (
        <span
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{
            backgroundColor: option?.colorCode || '#e5e7eb',
            color: '#000',
          }}
        >
          {item.value}
        </span>
      );
    }
    return <span className="text-sm font-medium text-gray-900">{String(item.value)}</span>;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-1 flex items-center gap-2 text-xs text-gray-500">
        <Tag className="h-3 w-3" />
        <span>{item.name}</span>
      </div>
      {renderValue()}
    </div>
  );
}

// 図面カード
function DrawingCard({ drawing }: { drawing: any }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
      <SquareChartGantt className="h-5 w-5 text-primary" />
      <div className="flex-1">
        <p className="font-medium text-gray-900">{drawing.name}</p>
        <p className="text-xs text-gray-500">
          {drawing.fileExtension.toUpperCase()} • {drawing.pages?.length || 0} ページ
        </p>
      </div>
    </div>
  );
}

// 文書カード
function DocumentCard({ document }: { document: any }) {
  const latestVersion = document.versions[0];
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <FileText className="h-5 w-5 text-primary" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900">{document.typeName}</p>
            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              v{latestVersion.version}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{latestVersion.name}</p>
          {latestVersion.remarks && (
            <p className="mt-2 text-xs text-gray-500">{latestVersion.remarks}</p>
          )}
        </div>
      </div>
    </div>
  );
}
