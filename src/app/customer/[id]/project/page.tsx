interface CustomerProjectsPageProps {
  params: {
    id: string;
  };
}

export default function CustomerProjectsPage({ params }: CustomerProjectsPageProps) {
  return <p>案件履歴 - 顧客ID: {params.id}</p>;
}