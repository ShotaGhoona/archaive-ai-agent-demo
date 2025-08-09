import { Button, ScrollArea, Card, CardContent } from "@/shared/shadcnui";
import { FolderPlus, FileImage } from "lucide-react";
import { ProjectBoxListProps, Project } from "../model/type";

export function ProjectBoxList({ 
  projects = [], 
  onBatchRegister 
}: ProjectBoxListProps) {
  return (
    <div className="h-full flex flex-col">
      {/* 固定ドロップゾーン */}
      <div className="flex-shrink-0 mb-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-6 text-center hover:border-primary hover:bg-primary/5 transition-all duration-200">
          <div className="flex flex-col items-center gap-3">
            <FolderPlus className="h-8 w-8 text-gray-400" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">
                ここにドロップ
              </p>
              <p className="text-xs text-gray-500">
                新案件作成
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* プロジェクトリスト */}
      <ScrollArea className="flex-1">
        <div className="space-y-3 pr-2">
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 space-y-2">
                <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg mx-auto flex items-center justify-center">
                  <FolderPlus className="h-6 w-6" />
                </div>
                <p className="text-sm text-gray-500">
                  案件はまだありません
                </p>
                <p className="text-xs text-gray-400">
                  図面をドロップして案件を作成
                </p>
              </div>
            </div>
          ) : (
            projects.map((project) => (
              <Card key={project.id} className="border-2 border-dashed border-gray-300 hover:border-primary hover:shadow-md transition-all duration-200 p-0">
                <CardContent className="p-4">
                  {/* プロジェクトヘッダー */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900 text-sm">
                      {project.name}
                    </h3>
                    <div className="text-xs text-gray-500">
                      {project.fileCount}枚の図面を登録中
                    </div>
                  </div>

                  {/* ドロップエリア */}
                  <div className="border border-dashed border-gray-200 rounded-md p-4 bg-gray-50 min-h-[80px] flex flex-col items-center justify-center text-center">
                    {project.fileCount > 0 ? (
                      <div className="space-y-2">
                        <FileImage className="h-6 w-6 text-gray-400 mx-auto" />
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-600">
                            {project.fileCount}枚の図面
                          </p>
                          <p className="text-xs text-gray-500">
                            追加ドロップ可能
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-6 h-6 border-2 border-dashed border-gray-300 rounded mx-auto"></div>
                        <p className="text-xs text-gray-500">
                          図面をドロップ
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {/* 一括登録ボタン */}
      {projects.length > 0 && (
        <div className="flex-shrink-0 pt-4 border-t">
          <Button
            onClick={onBatchRegister}
            className="w-full"
            size="lg"
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            一括登録 ({projects.length}件)
          </Button>
        </div>
      )}
    </div>
  );
}