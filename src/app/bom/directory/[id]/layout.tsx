import { DirectoryTabNavigation } from '@/page-components/bom/directory-detail/shared';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className='flex h-[calc(100vh-45px)] flex-col overflow-hidden'>
      <div className='flex-shrink-0 border-b bg-white px-4'>
        <div className='flex items-center justify-between'>
          <DirectoryTabNavigation />
        </div>
      </div>
      <div className='flex-1 overflow-hidden'>{children}</div>
    </div>
  );
}
