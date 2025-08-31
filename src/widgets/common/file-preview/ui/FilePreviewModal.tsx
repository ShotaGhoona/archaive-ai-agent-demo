import React from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/shared';
import { FilePreviewModalProps } from '../model';
import {
  useFilePreview,
  PreviewProviderManager,
  defaultPreviewProviders,
} from '../lib';
import { PreviewToolbar, PreviewViewer } from '../ui';

export function FilePreviewModal({
  files,
  isOpen,
  onClose,
  initialFileIndex = 0,
  options = {},
}: FilePreviewModalProps) {
  const providerManager = new PreviewProviderManager(defaultPreviewProviders);

  const {
    currentFile,
    currentIndex,
    zoom,
    rotation,
    isMultipleFiles,
    handleZoomIn,
    handleZoomOut,
    handleRotate,
    handleReset,
    handleDownload,
    handleDownloadAll,
    goToIndex,
    canZoomIn,
    canZoomOut,
  } = useFilePreview({
    files,
    initialIndex: initialFileIndex,
    options,
    providerManager,
  });

  if (!currentFile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={
          isMultipleFiles
            ? 'max-h-[90vh] max-w-[90vw] min-w-[90vw] overflow-hidden p-0'
            : 'max-h-[80vh] max-w-[80vw] min-w-[80vw] overflow-hidden p-0'
        }
      >
        {/* ヘッダー・ツールバー */}
        <DialogHeader className='p-0'>
          <PreviewToolbar
            currentFile={currentFile}
            zoom={zoom}
            canZoomIn={canZoomIn}
            canZoomOut={canZoomOut}
            isMultipleFiles={isMultipleFiles}
            filesCount={files.length}
            currentIndex={currentIndex}
            enableDownload={options.enableDownload}
            enableRotation={options.enableRotation}
            customActions={options.customActions}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onRotate={handleRotate}
            onReset={handleReset}
            onDownload={handleDownload}
            onDownloadAll={isMultipleFiles ? handleDownloadAll : undefined}
          />
        </DialogHeader>

        {/* プレビューエリア */}
        <PreviewViewer
          files={files}
          currentIndex={currentIndex}
          zoom={zoom}
          rotation={rotation}
          isMultipleFiles={isMultipleFiles}
          providerManager={providerManager}
          onIndexChange={goToIndex}
        />
      </DialogContent>
    </Dialog>
  );
}
