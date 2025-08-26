import { redirect } from 'next/navigation';

interface BlueprintPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BlueprintPage({ params }: BlueprintPageProps) {
  const { id } = await params;
  redirect(`/blueprint/${id}/basic-information`);
}