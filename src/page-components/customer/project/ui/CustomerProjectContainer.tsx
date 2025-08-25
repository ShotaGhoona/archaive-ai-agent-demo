import { ProjectDataViewContainer } from "@/widgets/project/project-data-view";

interface CustomerProjectContainerProps {
  customerId: string;
}

export function CustomerProjectContainer({ customerId }: CustomerProjectContainerProps) {
  // TODO: 将来的にはcustomerIdで案件をフィルターしたデータを渡す
  return <ProjectDataViewContainer />;
}