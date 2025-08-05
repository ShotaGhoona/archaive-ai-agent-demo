interface CustomerNotesPageProps {
  params: {
    id: string;
  };
}

export default function CustomerNotesPage({ params }: CustomerNotesPageProps) {
  return <p>メモ・備考 - 顧客ID: {params.id}</p>;
}