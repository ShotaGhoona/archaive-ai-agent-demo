import { redirect } from 'next/navigation';

interface CustomerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CustomerPage({ params }: CustomerPageProps) {
  const { id } = await params;
  redirect(`/customer/${id}/profile`);
}