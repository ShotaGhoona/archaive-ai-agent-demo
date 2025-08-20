import { CustomerDetailLayout } from "@/widgets/customer-detail-layout/ui/CustomerDetailLayout";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <CustomerDetailLayout>
      {children}
    </CustomerDetailLayout>
  );
}