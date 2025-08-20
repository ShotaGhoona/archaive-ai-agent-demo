import { ProjectLayout } from "@/widgets/project-detail-layout/ui/ProjectLayout";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ProjectLayout>
      {children}
    </ProjectLayout>
  );
}