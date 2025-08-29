"use client";

import { 
  PicturePreviewContainer, 
  Button,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/shared";
import { Download, Printer, Trash } from "lucide-react";
import { DocumentData, DocumentDetailViewConfig } from "../model";

interface DocumentPreviewProps<T extends DocumentData> {
  item: T | null;
  config: DocumentDetailViewConfig<T>;
  onUpdate: (data: Partial<T>) => void;
}

export function DocumentPreview<T extends DocumentData>({
  item,
  config,
  onUpdate,
}: DocumentPreviewProps<T>) {
  if (!item) {
    return (
      <div className="h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">📄</div>
          <p>帳票を選択してください</p>
        </div>
      </div>
    );
  }

  const imageUrl = config.dataConfig.getImageUrl(item);

  const handleDownload = () => {
    console.log("帳票をダウンロード");
  };

  const handlePrint = () => {
    console.log("帳票を印刷");
  };

  const handleDelete = () => {
    console.log("帳票を削除しました");
  };

  return (
    <div className="h-full bg-gray-100 relative">
      <PicturePreviewContainer activeFile={{ imageUrl }} />
      
      <div className="absolute top-6 right-6 flex gap-2">
        {config.previewActionButtonsConfig.showDeleteButton && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="lg"
              >
                <Trash className="h-4 w-4" />
                消去
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>帳票を削除しますか？</AlertDialogTitle>
                <AlertDialogDescription>
                  この帳票を削除します。この操作は取り消せません。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="text-white bg-red-500 hover:bg-red-600"
                >
                  削除
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        
        {config.previewActionButtonsConfig.showDownloadButton && (
          <Button
            variant="outline"
            size="lg"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            ダウンロード
          </Button>
        )}
        
        {config.previewActionButtonsConfig.showPrintButton && (
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4" />
            印刷
          </Button>
        )}
        
        {config.previewActionButtonsConfig.customButtonsRender?.(item, onUpdate)}
      </div>
    </div>
  );
}