import { 
  Button, 
  Card, 
  CardContent,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared";
import { X } from "lucide-react";
import { BlueprintFile } from "@/widgets";

interface DetailSidebarProps {
  files: BlueprintFile[];
  onFileSelect: (fileId: string) => void;
  onFileRemove: (fileId: string) => void;
}

export function DetailSidebar({ 
  files,
  onFileSelect, 
  onFileRemove 
}: DetailSidebarProps) {
  const handleFileClick = (fileId: string) => {
    onFileSelect(fileId);
  };

  const handleRemoveFile = (fileId: string) => {
    onFileRemove(fileId);
  };


  return (
    <div className="w-48 border-r bg-white flex flex-col">
      {/* ファイル一覧 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {files.map((file) => (
          <Card 
            key={file.id}
            className={`
              cursor-pointer transition-all duration-200 group relative py-1
              ${file.isActive 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:shadow-md hover:bg-gray-50'
              }
            `}
            onClick={() => handleFileClick(file.id)}
          >
            {/* 削除ボタン */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>ファイルを削除しますか？</AlertDialogTitle>
                  <AlertDialogDescription>
                    「{file.name}」を削除します。この操作は取り消せません。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleRemoveFile(file.id)}
                    className="text-white bg-red-500 hover:bg-red-600"
                  >
                    削除
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <CardContent className="p-2">
              <div className="space-y-2">
                <div className="aspect-video w-full bg-gray-100 rounded overflow-hidden">
                  <img 
                    src={file.imageUrl} 
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-1">
                  <h4 className="text-xs font-medium text-gray-900 truncate">
                    {file.name}
                  </h4>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}