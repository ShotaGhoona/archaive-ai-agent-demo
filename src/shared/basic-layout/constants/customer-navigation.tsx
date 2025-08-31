import { Info, Phone, Briefcase } from 'lucide-react';

export interface CustomerMenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

export const customerMenuItems: CustomerMenuItem[] = [
  {
    id: 'profile',
    label: '基本情報',
    href: '/customer/[id]/profile',
    icon: <Info className='h-4 w-4' />,
    description: '顧客の基本的な情報を管理',
  },
  {
    id: 'contact',
    label: '連絡先リスト',
    href: '/customer/[id]/contact',
    icon: <Phone className='h-4 w-4' />,
    description: '顧客の連絡先情報を管理',
  },
  {
    id: 'project',
    label: '案件履歴',
    href: '/customer/[id]/project',
    icon: <Briefcase className='h-4 w-4' />,
    description: '過去の案件と進行中のプロジェクト',
  },
];
