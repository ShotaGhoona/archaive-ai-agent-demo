import { Button, ScrollArea, Card, CardContent } from "@/shared/shadcnui";
import { FolderPlus, FileImage } from "lucide-react";
import { ProjectBoxListProps } from "../model/type";
import Link from "next/link";

export function ProjectBoxList({ 
  projects = [], 
  onBatchRegister,
  onDropToNewProject,
  onDropToProject,
  dragOverTarget,
  onDragOver,
  onDragLeave,
  onDrop
}: ProjectBoxListProps) {
  return (
    <div className="h-full flex flex-col">
      {/* 固定ドロップゾーン */}
      <div className="flex-shrink-0 mb-4">
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
            dragOverTarget === 'new-project'
              ? 'border-primary bg-primary/10 scale-105'
              : 'border-gray-300 bg-gray-50 hover:border-primary hover:bg-primary/5'
          }`}
          onDragOver={(e) => onDragOver?.(e, 'new-project')}
          onDragLeave={onDragLeave}
          onDrop={(e) => onDrop?.(e, onDropToNewProject, onDropToProject)}
        >
          <div className="flex flex-col items-center gap-3">
            <FolderPlus className={`h-8 w-8 ${
              dragOverTarget === 'new-project' ? 'text-primary' : 'text-gray-400'
            }`} />
            <div className="space-y-1">
              <p className={`text-sm font-medium ${
                dragOverTarget === 'new-project' ? 'text-primary' : 'text-gray-700'
              }`}>
                ここにドロップ
              </p>
              <p className="text-xs text-gray-500">
                新案件作成
              </p>
            </div>
          </div>
        </div>
      </div>
      {projects.length > 0 && (
        <>
          {/* プロジェクトリスト */}
          <ScrollArea className="flex-1">
            <div className="space-y-3">
              {projects.map((project) => (
                  <Card 
                    key={project.id} 
                    className={`border-2 border-dashed transition-all duration-200 p-0 ${
                      dragOverTarget === project.id
                        ? 'border-primary bg-primary/5 shadow-lg scale-105'
                        : 'border-gray-300 hover:border-primary hover:shadow-md'
                    }`}
                  >
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
                      <div 
                        className={`border border-dashed rounded-md p-4 min-h-[80px] flex flex-col items-center justify-center text-center transition-all duration-200 ${
                          dragOverTarget === project.id
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                        onDragOver={(e) => onDragOver?.(e, project.id)}
                        onDragLeave={onDragLeave}
                        onDrop={(e) => onDrop?.(e, onDropToNewProject, onDropToProject, project.id)}
                      >
                        {project.fileCount > 0 ? (
                          <div className="space-y-2">
                            <FileImage className={`h-6 w-6 mx-auto ${
                              dragOverTarget === project.id ? 'text-primary' : 'text-gray-400'
                            }`} />
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
                            <div className={`w-6 h-6 border-2 border-dashed rounded mx-auto ${
                              dragOverTarget === project.id ? 'border-primary' : 'border-gray-300'
                            }`}></div>
                            <p className="text-xs text-gray-500">
                              図面をドロップ
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </ScrollArea>

          {/* 一括登録ボタン */}
          <div className="flex-shrink-0 pt-4 border-t">
            <Link href="/project/PJ-2024-001/basic-information">
            <Button
              onClick={onBatchRegister}
              className="w-full"
              size="lg"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              一括登録 ({projects.length}件)
            </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}