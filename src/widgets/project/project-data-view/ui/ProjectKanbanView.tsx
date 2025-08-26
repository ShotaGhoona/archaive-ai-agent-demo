"use client";

import { useMemo } from "react";
import { Card, CardContent, Badge } from "@/shared";
import { User, Clock } from "lucide-react";
import { Project } from "../lib";
import { useRouter } from "next/navigation";

interface ProjectKanbanViewProps {
  projects: Project[];
  onProjectUpdate?: (projectId: string, field: string, value: unknown) => void;
}

interface KanbanColumn {
  id: string;
  title: string;
  count: number;
  color: string;
  projects: Project[];
}

export function ProjectKanbanView({ projects }: ProjectKanbanViewProps) {
  const router = useRouter();
  // プロジェクトをステータス別にグループ化
  const columns: KanbanColumn[] = useMemo(() => {
    const statusGroups = {
      "問い合わせ": { title: "問い合わせ", color: "bg-blue-100 border-blue-300", projects: [] as Project[] },
      "見積もり中": { title: "見積もり中", color: "bg-yellow-100 border-yellow-300", projects: [] as Project[] },
      "受注確定": { title: "受注確定", color: "bg-purple-100 border-purple-300", projects: [] as Project[] },
      "製作中": { title: "製作中", color: "bg-orange-100 border-orange-300", projects: [] as Project[] },
      "納品完了": { title: "納品完了", color: "bg-green-100 border-green-300", projects: [] as Project[] }
    };

    projects.forEach(project => {
      const status = project.projectStatus as keyof typeof statusGroups;
      console.log('Project Status:', status, 'Project:', project.projectId);
      if (statusGroups[status]) {
        statusGroups[status].projects.push(project);
      } else {
        console.warn('Unknown status:', status, 'for project:', project.projectId);
      }
    });

    const columns = Object.entries(statusGroups).map(([id, group]) => ({
      id,
      title: group.title,
      count: group.projects.length,
      color: group.color,
      projects: group.projects
    }));
    
    console.log('Total columns:', columns.length, 'Columns:', columns.map(c => `${c.title}(${c.count})`));
    return columns;
  }, [projects]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "未設定";
    try {
      return new Date(dateString).toLocaleDateString('ja-JP', {
        month: 'numeric',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "提出済": return "bg-green-100 text-green-800";
      case "作成中": return "bg-yellow-100 text-yellow-800";
      case "未提出": return "bg-gray-100 text-gray-800";
      case "配送完了": return "bg-green-100 text-green-800";
      case "配送中": return "bg-blue-100 text-blue-800";
      case "配送準備中": return "bg-yellow-100 text-yellow-800";
      case "未対応": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full flex gap-4 px-6 pb-6 overflow-x-auto">
        {columns.map((column) => (
          <div key={column.id} className="flex-1 min-w-64">
            {/* カラムヘッダー */}
            <div className={`flex items-center justify-between mb-4 p-3 rounded-lg ${column.color}`}>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900">{column.title}</h3>
                <Badge variant="secondary" className="rounded-full">
                  {column.count}
                </Badge>
              </div>
            </div>

            {/* カードリスト */}
            <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
              {column.projects.map((project) => (
                <Card 
                  key={project.projectId} 
                  className="cursor-pointer hover:shadow-md transition-shadow p-0"
                  onClick={() => router.push(`/project/${project.projectId}`)}
                >
                  <CardContent className="p-3 space-y-2">
                    {/* タイトル行 */}
                    <div>
                      <h4 className="font-medium text-sm text-gray-900">
                        {project.projectId}
                      </h4>
                      <p className="text-xs text-gray-600 font-medium truncate">
                        {project.customerName}
                      </p>
                    </div>

                    {/* 担当者と重要期日 */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600">{project.assignee}</span>
                      </div>
                      {project.responseDeadline && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-orange-400" />
                          <span className="text-gray-600">
                            {formatDate(project.responseDeadline)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ステータス行 */}
                    <div className="flex justify-between items-center">
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-1.5 py-0.5 ${getStatusBadgeColor(project.quotationStatus)}`}
                      >
                        {project.quotationStatus}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-1.5 py-0.5 ${getStatusBadgeColor(project.deliveryStatus)}`}
                      >
                        {project.deliveryStatus}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {column.projects.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  {column.title}の案件はありません
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}