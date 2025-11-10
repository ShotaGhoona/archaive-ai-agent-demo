'use client';

import { Calendar, User } from 'lucide-react';
import type { BomNode, Directory, DocumentNode, LeafProduct } from '../../../shared/data';
import { ScrollArea } from '@/shared';

interface BomMetadataPanelProps {
  selectedNode: BomNode;
}

export function BomMetadataPanel({ selectedNode }: BomMetadataPanelProps) {
  const isDirectory = selectedNode.type === 'directory';
  const isDocument = selectedNode.type === 'document';
  const isLeafProduct = selectedNode.type === 'leaf-product';

  return (
    <ScrollArea className="h-full bg-white">
      <div className="p-6 space-y-8">
        {/* 基本情報セクション */}
        <MetadataSection title="基本情報">
          {isDocument && <DocumentBasicInfo node={selectedNode as DocumentNode} />}
          {isDirectory && <DirectoryBasicInfo node={selectedNode as Directory} />}
          {isLeafProduct && <LeafProductBasicInfo node={selectedNode as LeafProduct} />}
        </MetadataSection>

        {/* カスタム情報セクション */}
        {!isDocument && (selectedNode as any).customItemValues && (selectedNode as any).customItemValues.length > 0 && (
          <MetadataSection title="カスタム情報">
            <div className="space-y-4">
              {(selectedNode as any).customItemValues.map((item: any) => (
                <FormField key={item.itemId} label={item.name}>
                  {renderCustomItemValue(item)}
                </FormField>
              ))}
            </div>
          </MetadataSection>
        )}

        {/* システム情報セクション */}
        {!isDocument && (
          <MetadataSection title="システム情報">
            <div className="space-y-4">
              <FormField label="作成者">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{(selectedNode as any).createdBy}</span>
                </div>
              </FormField>
              <FormField label="作成日">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>
                    {new Date((selectedNode as any).createdAt).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              </FormField>
              <FormField label="更新日">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>
                    {new Date((selectedNode as any).updatedAt).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              </FormField>
            </div>
          </MetadataSection>
        )}

        {/* 備考 */}
        {!isDocument && (selectedNode as any).remarks && (
          <MetadataSection title="備考">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {(selectedNode as any).remarks}
              </p>
            </div>
          </MetadataSection>
        )}
      </div>
    </ScrollArea>
  );
}

// セクションコンポーネント
function MetadataSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-primary">{title}</h3>
      {children}
    </div>
  );
}

// フォームフィールドコンポーネント（ラベル + 入力風表示）
function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5">
        {children}
      </div>
    </div>
  );
}

// ドキュメント基本情報
function DocumentBasicInfo({ node }: { node: DocumentNode }) {
  const latestVersion = node.document.versions[0];
  return (
    <div className="space-y-4">
      <FormField label="文書タイプ">
        <span className="text-sm text-gray-900">{node.document.typeName}</span>
      </FormField>
      <FormField label="バージョン">
        <span className="text-sm text-gray-900">v{latestVersion.version}</span>
      </FormField>
      <FormField label="ファイル名">
        <span className="text-sm text-gray-700">{latestVersion.name}</span>
      </FormField>
      <FormField label="作成日">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{new Date(latestVersion.createdAt).toLocaleDateString('ja-JP')}</span>
        </div>
      </FormField>
      {latestVersion.remarks && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">備考</label>
          <div className="rounded-lg border border-gray-300 bg-gray-50 p-3">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{latestVersion.remarks}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Directory基本情報
function DirectoryBasicInfo({ node }: { node: Directory }) {
  return (
    <div className="space-y-4">
      <FormField label="製品コード" required>
        <span className="text-sm text-gray-900">{node.name}</span>
      </FormField>
      <FormField label="タイプ">
        <span className="text-sm text-gray-700">{node.directoryTypeName}</span>
      </FormField>
      <FormField label="シーケンス番号">
        <span className="text-sm text-gray-700">#{node.seqNumber}</span>
      </FormField>
    </div>
  );
}

// LeafProduct基本情報
function LeafProductBasicInfo({ node }: { node: LeafProduct }) {
  return (
    <div className="space-y-4">
      <FormField label="部品コード" required>
        <span className="text-sm text-gray-900">{node.name}</span>
      </FormField>
      <FormField label="リビジョン">
        <span className="text-sm text-gray-700">#{node.revisionNumber}</span>
      </FormField>
      <FormField label="最新">
        <span className="text-sm text-gray-700">{node.isLatest ? 'はい' : 'いいえ'}</span>
      </FormField>
      {node.drawings && node.drawings.length > 0 && (
        <FormField label="図面番号">
          <span className="text-sm text-gray-700">{node.drawings[0].name}</span>
        </FormField>
      )}
    </div>
  );
}

// カスタム項目値のレンダリング
function renderCustomItemValue(item: any) {
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
  return <span className="text-sm text-gray-900">{String(item.value)}</span>;
}
