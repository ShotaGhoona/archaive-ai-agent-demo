"use client";
import { DocumentType, DocumentTypeHeaderProps } from '../model';

const documentTypes = [
  { key: 'quotation' as DocumentType, label: '見積書' },
  { key: 'order' as DocumentType, label: '発注書' },
  { key: 'delivery' as DocumentType, label: '納品書' },
  { key: 'invoice' as DocumentType, label: '請求書' },
  { key: 'specification' as DocumentType, label: '仕様書' },
  { key: 'inspection' as DocumentType, label: '検査表' },
];

export function DocumentTypeHeader({
  selectedType,
  onTypeChange,
}: DocumentTypeHeaderProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8" aria-label="Tabs">
        {documentTypes.map((type) => (
          <button
            key={type.key}
            onClick={() => onTypeChange(type.key)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              selectedType === type.key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {type.label}
          </button>
        ))}
      </nav>
    </div>
  );
}