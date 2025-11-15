import { DocumentSidebar } from './DocumentSidebar';

export default function DocumentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-[calc(100vh-60px)] w-full overflow-hidden'>
      {/* Document Sidebar */}
      <DocumentSidebar />

      {/* Main Content Area */}
      <div className='min-h-0 min-w-0 flex-1 overflow-auto'>{children}</div>
    </div>
  );
}
