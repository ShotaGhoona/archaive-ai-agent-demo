import CustomerContactContainer from "@/page-components/customer/customer-contact/ui/CustomerContactContainer";

interface CustomerContactPageProps {
  params: {
    id: string;
  };
}

export default function CustomerContactPage({ params }: CustomerContactPageProps) {
  return <CustomerContactContainer customerId={params.id} />;
}