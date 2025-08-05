import { redirect } from 'next/navigation';

interface CustomerPageProps {
  params: {
    id: string;
  };
}

export default function CustomerPage({ params }: CustomerPageProps) {
  redirect(`/customer/${params.id}/profile`);
}