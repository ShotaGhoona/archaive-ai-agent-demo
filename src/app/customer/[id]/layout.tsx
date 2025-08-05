import { CustomerSidebar } from "@/shared/basic-layout/ui/CustomerSidebar";
export default function CustomerDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    id: string;
  };
}) {
  return (
    <div className="flex h-[calc(100vh-45px)] bg-background">
      <CustomerSidebar customerId={params.id} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}