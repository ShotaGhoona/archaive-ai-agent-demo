import { FileTypeInfo } from '../model/types';

// ファイル拡張子からカテゴリを判定
const FILE_TYPE_MAP: Record<string, FileTypeInfo['category']> = {
  // 画像
  'jpg': 'image',
  'jpeg': 'image',
  'png': 'image',
  'gif': 'image',
  'bmp': 'image',
  'webp': 'image',
  'svg': 'image',
  
  // ドキュメント
  'pdf': 'document',
  'doc': 'document',
  'docx': 'document',
  'txt': 'document',
  
  // CAD
  'dwg': 'cad',
  'dxf': 'cad',
  'step': 'cad',
  'stp': 'cad',
  'igs': 'cad',
  'iges': 'cad',
  
  // 動画
  'mp4': 'video',
  'avi': 'video',
  'mov': 'video',
  'mkv': 'video',
  
  // 音声
  'mp3': 'audio',
  'wav': 'audio',
  'flac': 'audio',
};

// プレビュー可能な拡張子
const PREVIEWABLE_EXTENSIONS = [
  'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg',
  'pdf', 'txt',
  'dwg', 'step', 'igs'
];

export function detectFileType(fileName: string, mimeType?: string): FileTypeInfo {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  const category = FILE_TYPE_MAP[extension] || 'unknown';
  
  return {
    category,
    extension,
    mimeType: mimeType || getMimeTypeFromExtension(extension),
    isPreviewable: PREVIEWABLE_EXTENSIONS.includes(extension)
  };
}

function getMimeTypeFromExtension(extension: string): string {
  const mimeMap: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'bmp': 'image/bmp',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'pdf': 'application/pdf',
    'txt': 'text/plain',
    'dwg': 'application/acad',
    'step': 'application/step',
    'igs': 'application/iges',
  };
  
  return mimeMap[extension] || 'application/octet-stream';
}

export function isImageFile(file: { name: string; type?: string }): boolean {
  const typeInfo = detectFileType(file.name, file.type);
  return typeInfo.category === 'image';
}

export function isPreviewableFile(file: { name: string; type?: string }): boolean {
  const typeInfo = detectFileType(file.name, file.type);
  return typeInfo.isPreviewable;
}