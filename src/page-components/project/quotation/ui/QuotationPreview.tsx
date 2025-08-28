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
import { Download, Printer, Trash, Pencil } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

interface QuotationPreviewProps {
  imageUrl: string;
}

export function QuotationPreview({ imageUrl }: QuotationPreviewProps) {
  const router = useRouter();
  const { projectId } = useParams();

  const handleDownload = () => {
    console.log("見積書をダウンロード");
    // ダミー実装
  };

  const handlePrint = () => {
    console.log("見積書を印刷");
    // ダミー実装
  };

  const handleDelete = () => {
    console.log("見積書を削除しました");
    // ダミー実装
  };

  const handleEdit = () => {
    router.push(`/project/${projectId}/quotation-create`);
  };

  return (
    <div className="h-full bg-gray-100 relative">
      <PicturePreviewContainer activeFile={{ imageUrl }} />
      
      {/* ダウンロード・印刷ボタン */}
      <div className="absolute top-6 right-6 flex gap-2">
        {/* 消去ボタン */}
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
              <AlertDialogTitle>見積書を削除しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                この見積書を削除します。この操作は取り消せません。
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
        <Button
          size="lg"
          onClick={handleEdit}
        >
          <Pencil className="h-4 w-4" />
          編集
        </Button>
      </div>
    </div>
  );
}