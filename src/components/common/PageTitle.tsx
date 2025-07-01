interface PageTitleProps {
    title: string;
    children?: React.ReactNode;
  }
  
  export function PageTitle({ title, children }: PageTitleProps) {
    return (
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {children && <div className="flex items-center gap-4">{children}</div>}
      </div>
    );
  }