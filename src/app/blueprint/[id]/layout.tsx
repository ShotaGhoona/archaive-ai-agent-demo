import { BlueprintDetailLayout } from "@/widgets/blueprint-detail-layout/ui/BlueprintDetailLayout";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <BlueprintDetailLayout>
      {children}
    </BlueprintDetailLayout>
  );
}