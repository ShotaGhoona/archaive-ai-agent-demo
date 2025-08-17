import { useCallback } from 'react';

interface FileOperationsConfig {
  onDownloadStart?: () => void;
  onDownloadComplete?: () => void;
  onPrintStart?: () => void;
  onPrintComplete?: () => void;
}

interface FileOperations {
  downloadFile: (imageUrl: string, fileName: string) => void;
  printFile: (imageUrl: string, fileName: string) => void;
}

export function useFileOperations(config: FileOperationsConfig = {}): FileOperations {
  const {
    onDownloadStart,
    onDownloadComplete,
    onPrintStart,
    onPrintComplete
  } = config;

  const downloadFile = useCallback((imageUrl: string, fileName: string) => {
    try {
      onDownloadStart?.();
      
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      onDownloadComplete?.();
    } catch (error) {
      console.error('Download failed:', error);
    }
  }, [onDownloadStart, onDownloadComplete]);

  const printFile = useCallback((imageUrl: string, fileName: string) => {
    try {
      onPrintStart?.();
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>印刷: ${fileName}</title>
              <style>
                body {
                  margin: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                }
                img {
                  max-width: 100%;
                  max-height: 100%;
                }
              </style>
            </head>
            <body>
              <img src="${imageUrl}" alt="${fileName}" />
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        
        onPrintComplete?.();
      }
    } catch (error) {
      console.error('Print failed:', error);
    }
  }, [onPrintStart, onPrintComplete]);

  return {
    downloadFile,
    printFile
  };
}