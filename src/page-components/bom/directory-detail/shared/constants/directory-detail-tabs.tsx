import { Info, FolderTree, Settings } from 'lucide-react';

export interface DirectoryDetailTab {
  id: string;
  label: string;
  href: (directoryId: string) => string;
  icon: React.ReactElement;
  description?: string;
}

export const directoryDetailTabs: DirectoryDetailTab[] = [
  {
    id: 'basic-information',
    label: '基本情報',
    href: (id) => `/bom/directory/${id}/basic-information`,
    icon: <Info className='h-4 w-4' />,
    description: 'Directoryの基本情報とメタデータ',
  },
  {
    id: 'register',
    label: '登録',
    href: (id) => `/bom/directory/${id}/register`,
    icon: <Settings className='h-4 w-4' />,
    description: '子要素の追加・編集（後回し）',
  },
  {
    id: 'bomtree',
    label: 'BOMツリー',
    href: (id) => `/bom/directory/${id}/bomtree`,
    icon: <FolderTree className='h-4 w-4' />,
    description: 'BOM階層構造の閲覧',
  },
];
