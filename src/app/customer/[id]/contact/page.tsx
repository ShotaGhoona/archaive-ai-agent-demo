import { CustomerContactContainer } from "@/page-components";

interface CustomerContactPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CustomerContactPage({ params }: CustomerContactPageProps) {
  const { id } = await params;
  return <CustomerContactContainer customerId={id} />;
}