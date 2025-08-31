'use client';

import { useMemo } from 'react';
import { Card, CardContent, Badge } from '@/shared';
import {} from 'lucide-react';
import { DirectoryBaseDataInterface } from '@/dummy-data-er-fix/project';
import { useRouter } from 'next/navigation';

interface ProjectKanbanViewProps {
  projects: DirectoryBaseDataInterface[];
  onProjectUpdate?: (projectId: number, field: string, value: unknown) => void;
}

interface KanbanColumn {
  id: string;
  title: string;
  count: number;
  color: string;
  projects: DirectoryBaseDataInterface[];
}

export function ProjectKanbanView({ projects }: ProjectKanbanViewProps) {
  const router = useRouter();
  // プロジェクトをステータス別にグループ化
  const columns: KanbanColumn[] = useMemo(() => {
    const statusGroups = {
      問い合わせ: {
        title: '問い合わせ',
        color: 'bg-blue-100 border-blue-300',
        projects: [] as DirectoryBaseDataInterface[],
      },
      見積もり中: {
        title: '見積もり中',
        color: 'bg-yellow-100 border-yellow-300',
        projects: [] as DirectoryBaseDataInterface[],
      },
      受注確定: {
        title: '受注確定',
        color: 'bg-purple-100 border-purple-300',
        projects: [] as DirectoryBaseDataInterface[],
      },
      製作中: {
        title: '製作中',
        color: 'bg-orange-100 border-orange-300',
        projects: [] as DirectoryBaseDataInterface[],
      },
      納品完了: {
        title: '納品完了',
        color: 'bg-green-100 border-green-300',
        projects: [] as DirectoryBaseDataInterface[],
      },
    };

    projects.forEach((project) => {
      const status = project.directory_custom_items?.['案件ステータス']?.value as keyof typeof statusGroups;
      console.log('Project Status:', status, 'Project:', project.id);
      if (statusGroups[status]) {
        statusGroups[status].projects.push(project);
      } else {
        console.warn(
          'Unknown status:',
          status,
          'for project:',
          project.id,
        );
      }
    });

    const columns = Object.entries(statusGroups).map(([id, group]) => ({
      id,
      title: group.title,
      count: group.projects.length,
      color: group.color,
      projects: group.projects,
    }));

    console.log(
      'Total columns:',
      columns.length,
      'Columns:',
      columns.map((c) => `${c.title}(${c.count})`),
    );
    return columns;
  }, [projects]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '未設定';
    try {
      return new Date(dateString).toLocaleDateString('ja-JP', {
        month: 'numeric',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className='flex-1 overflow-hidden'>
      <div className='flex h-full gap-4 overflow-x-auto px-6 pb-6'>
        {columns.map((column) => (
          <div key={column.id} className='min-w-64 flex-1'>
            {/* カラムヘッダー */}
            <div
              className={`mb-4 flex items-center justify-between rounded-lg p-3 ${column.color}`}
            >
              <div className='flex items-center gap-2'>
                <h3 className='font-medium text-gray-900'>{column.title}</h3>
                <Badge variant='secondary' className='rounded-full'>
                  {column.count}
                </Badge>
              </div>
            </div>

            {/* カードリスト */}
            <div className='max-h-[calc(100vh-200px)] space-y-3 overflow-y-auto'>
              {column.projects.map((project) => (
                <Card
                  key={project.id}
                  className='cursor-pointer p-0 transition-shadow hover:shadow-md'
                  onClick={() => router.push(`/project/${project.id}`)}
                >
                  <CardContent className='space-y-2 p-3'>
                    {/* 案件名 */}
                    <h4 className='text-sm font-semibold text-gray-900'>
                      {project.name}
                    </h4>

                    {/* 取引先名 */}
                    <p className='text-xs text-gray-600'>
                      {project.customer_name}
                    </p>

                    {/* 納品期日 */}
                    <p className='text-xs text-gray-600'>
                      {project.directory_custom_items?.['回答期限']?.value
                        ? formatDate(project.directory_custom_items['回答期限'].value)
                        : '未設定'}
                    </p>
                  </CardContent>
                </Card>
              ))}

              {column.projects.length === 0 && (
                <div className='py-8 text-center text-sm text-gray-500'>
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
