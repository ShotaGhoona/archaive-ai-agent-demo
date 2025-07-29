import React from 'react';
import { FileImage, Download } from 'lucide-react';
import { Button } from '@/shared/shadcnui';
import { PreviewProvider, PreviewableFile, PreviewRenderOptions } from '../model/types';
import { detectFileType } from './fileTypeDetector';

// 画像プレビュープロバイダー
export const imagePreviewProvider: PreviewProvider = {
  id: 'image',
  name: '画像プレビュー',
  supportedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/svg+xml'],
  supportedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'],
  priority: 10,
  
  canPreview: (file: PreviewableFile) => {
    const typeInfo = detectFileType(file.name, file.type);
    return typeInfo.category === 'image';
  },
  
  render: (file: PreviewableFile, options: PreviewRenderOptions) => {
    return (
      <div
        className={`transition-transform duration-200 ease-in-out ${options.className || ''}`}
        style={{
          transform: `scale(${options.zoom}) rotate(${options.rotation}deg)`,
          transformOrigin: 'center'
        }}
      >
        <img
          src={file.url}
          alt={file.name}
          className="max-w-none shadow-lg"
          style={{
            maxHeight: '70vh',
            maxWidth: '80vw'
          }}
        />
      </div>
    );
  }
};

// ドキュメントプレビュープロバイダー（PDF等）
export const documentPreviewProvider: PreviewProvider = {
  id: 'document',
  name: 'ドキュメントプレビュー',
  supportedTypes: ['application/pdf', 'text/plain'],
  supportedExtensions: ['pdf', 'txt'],
  priority: 8,
  
  canPreview: (file: PreviewableFile) => {
    const typeInfo = detectFileType(file.name, file.type);
    return typeInfo.category === 'document';
  },
  
  render: (file: PreviewableFile, options: PreviewRenderOptions) => {
    if (file.type === 'application/pdf') {
      return (
        <div className="w-full h-full">
          <iframe
            src={file.url}
            className="w-full h-full border-0"
            title={file.name}
          />
        </div>
      );
    }
    
    // テキストファイルの場合は簡単な表示
    return (
      <div className="text-center space-y-4 p-8">
        <FileImage className="h-24 w-24 text-gray-400 mx-auto" />
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-700">
            {file.name.split('.').pop()?.toUpperCase()} ファイル
          </h3>
          <p className="text-sm text-gray-500">
            このファイル形式はプレビューできません
          </p>
        </div>
      </div>
    );
  }
};

// CADファイルプレビュープロバイダー（将来拡張用）
export const cadPreviewProvider: PreviewProvider = {
  id: 'cad',
  name: 'CADプレビュー',
  supportedTypes: ['application/acad', 'application/step', 'application/iges'],
  supportedExtensions: ['dwg', 'step', 'stp', 'igs', 'iges'],
  priority: 6,
  
  canPreview: (file: PreviewableFile) => {
    const typeInfo = detectFileType(file.name, file.type);
    return typeInfo.category === 'cad';
  },
  
  render: (file: PreviewableFile, options: PreviewRenderOptions) => {
    return (
      <div className="text-center space-y-4 p-8">
        <FileImage className="h-24 w-24 text-gray-400 mx-auto" />
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-700">
            {file.name.split('.').pop()?.toUpperCase()} ファイル
          </h3>
          <p className="text-sm text-gray-500">
            CADファイルのプレビュー機能は開発中です
          </p>
          <Button
            variant="outline"
            onClick={() => {
              const link = document.createElement('a');
              link.href = file.url;
              link.download = file.name;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="mt-4"
          >
            <Download className="h-4 w-4 mr-2" />
            ダウンロード
          </Button>
        </div>
      </div>
    );
  }
};

// フォールバックプレビュープロバイダー
export const fallbackPreviewProvider: PreviewProvider = {
  id: 'fallback',
  name: 'フォールバック',
  supportedTypes: ['*'],
  supportedExtensions: ['*'],
  priority: 0,
  
  canPreview: () => true, // 常に対応
  
  render: (file: PreviewableFile) => {
    return (
      <div className="text-center space-y-4 p-8">
        <FileImage className="h-24 w-24 text-gray-400 mx-auto" />
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-700">
            {file.name.split('.').pop()?.toUpperCase()} ファイル
          </h3>
          <p className="text-sm text-gray-500">
            このファイル形式はプレビューできません
          </p>
          <Button
            variant="outline"
            onClick={() => {
              const link = document.createElement('a');
              link.href = file.url;
              link.download = file.name;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="mt-4"
          >
            <Download className="h-4 w-4 mr-2" />
            ダウンロード
          </Button>
        </div>
      </div>
    );
  }
};

// デフォルトプロバイダーリスト
export const defaultPreviewProviders: PreviewProvider[] = [
  imagePreviewProvider,
  documentPreviewProvider,
  cadPreviewProvider,
  fallbackPreviewProvider
];

// プロバイダーマネージャー
export class PreviewProviderManager {
  private providers: PreviewProvider[] = [];
  
  constructor(providers: PreviewProvider[] = defaultPreviewProviders) {
    this.providers = [...providers].sort((a, b) => b.priority - a.priority);
  }
  
  addProvider(provider: PreviewProvider) {
    this.providers.push(provider);
    this.providers.sort((a, b) => b.priority - a.priority);
  }
  
  getProviderForFile(file: PreviewableFile): PreviewProvider {
    return this.providers.find(provider => provider.canPreview(file)) || fallbackPreviewProvider;
  }
  
  getAllProviders(): PreviewProvider[] {
    return [...this.providers];
  }
}