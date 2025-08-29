import { BlueprintTabNavigation } from "@/shared";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="h-[calc(100vh-45px)] flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <BlueprintTabNavigation />
        </div>
      </div>
      <div className="flex-1 overflow-hidden h-full">
        <div className="h-full">
          {children}
        </div>
      </div>
    </div>
  );
}