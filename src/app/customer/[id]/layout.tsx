import { CustomerSidebar } from "@/shared/basic-layout/ui/CustomerSidebar";
export default async function CustomerDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  return (
    <div className="flex h-[calc(100vh-45px)] bg-background">
      <CustomerSidebar customerId={id} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}