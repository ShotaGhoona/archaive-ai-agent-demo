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

interface DeliveryPreviewProps {
  imageUrl: string;
}

export function DeliveryPreview({ imageUrl }: DeliveryPreviewProps) {
  const handleDownload = () => {
    console.log("納品書をダウンロード");
  };

  const handlePrint = () => {
    console.log("納品書を印刷");
  };

  const handleDelete = () => {
    console.log("納品書を削除しました");
  };

  return (
    <div className="h-full bg-gray-100 relative">
      <PicturePreviewContainer activeFile={{ imageUrl }} />
      
      <div className="absolute top-6 right-6 flex gap-2">
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
              <AlertDialogTitle>納品書を削除しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                この納品書を削除します。この操作は取り消せません。
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
        <Button
          variant="outline"
          size="lg"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          ダウンロード
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handlePrint}
        >
          <Printer className="h-4 w-4" />
          印刷
        </Button>
      </div>
    </div>
  );
}