'use client';

import { Calendar, User } from 'lucide-react';
import { BomNode, Directory, LeafProduct } from '../../../shared/data/types';

interface MetadataPanelProps {
  node: BomNode;
}

export default function MetadataPanel({ node }: MetadataPanelProps) {
  const isDirectory = node.type === 'directory';
  const directory = node as Directory;
  const leafProduct = node as LeafProduct;

  return (
    <div className="space-y-6">
      {/* 基本情報 */}
      <MetadataSection title="基本情報">
        <div className="grid grid-cols-2 @[600px]:grid-cols-3 gap-x-4 gap-y-3">
          {isDirectory ? (
            <>
              <FormField
                label={directory.directoryTypeName === '製品' ? '製品コード' : 'Assyコード'}
                required
              >
                <span className="text-sm text-gray-900">{directory.name}</span>
              </FormField>
              <FormField label="タイプ">
                <span className="text-sm text-gray-700">{directory.directoryTypeName}</span>
              </FormField>
              {directory.customItems?.weight && (
                <FormField label="重量">
                  <span className="text-sm text-gray-700">{directory.customItems.weight} kg</span>
                </FormField>
              )}
              {directory.customItems?.material && (
                <FormField label="材質">
                  <span className="text-sm text-gray-700">{directory.customItems.material}</span>
                </FormField>
              )}
              {directory.customItems?.maxPressure && (
                <FormField label="最大圧力">
                  <span className="text-sm text-gray-700">{directory.customItems.maxPressure}</span>
                </FormField>
              )}
              {directory.customItems?.flowRate && (
                <FormField label="流量">
                  <span className="text-sm text-gray-700">{directory.customItems.flowRate}</span>
                </FormField>
              )}
            </>
          ) : (
            <>
              <FormField label="部品コード" required>
                <span className="text-sm text-gray-900">{leafProduct.name}</span>
              </FormField>
              <FormField label="リビジョン">
                <span className="text-sm text-gray-700">#{leafProduct.revisionNumber}</span>
              </FormField>
              {leafProduct.drawings && leafProduct.drawings.length > 0 && (
                <FormField label="図面番号">
                  <span className="text-sm text-gray-700">{leafProduct.drawings[0].name}</span>
                </FormField>
              )}
            </>
          )}
        </div>
      </MetadataSection>

      {/* カスタム情報 */}
      {(node as any).customItemValues && (node as any).customItemValues.length > 0 && (
        <MetadataSection title="カスタム情報">
          <div className="grid grid-cols-2 @[600px]:grid-cols-3 gap-x-4 gap-y-3">
            {(node as any).customItemValues.map((item: any) => (
              <FormField key={item.itemId} label={item.name}>
                {renderCustomItemValue(item)}
              </FormField>
            ))}
          </div>
        </MetadataSection>
      )}

      {/* システム情報 */}
      <MetadataSection title="システム情報">
        <div className="grid grid-cols-2 @[600px]:grid-cols-3 gap-x-4 gap-y-3">
          <FormField label="作成者">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <User className="h-4 w-4 text-gray-400" />
              <span>{(node as any).createdBy}</span>
            </div>
          </FormField>
          <FormField label="更新者">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <User className="h-4 w-4 text-gray-400" />
              <span>{(node as any).updatedBy || (node as any).createdBy}</span>
            </div>
          </FormField>
          <FormField label="作成日">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{new Date((node as any).createdAt).toLocaleDateString('ja-JP')}</span>
            </div>
          </FormField>
          <FormField label="更新日">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{new Date((node as any).updatedAt).toLocaleDateString('ja-JP')}</span>
            </div>
          </FormField>
        </div>
      </MetadataSection>
    </div>
  );
}

// セクションコンポーネント
function MetadataSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold text-primary">{title}</h3>
      {children}
    </div>
  );
}

// フォームフィールドコンポーネント
function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="rounded-sm border border-gray-200 bg-white px-2 py-1">{children}</div>
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
