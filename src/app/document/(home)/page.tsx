import { redirect } from 'next/navigation';

export default async function DocumentHomePage() {
  redirect(`/document/quotation`);
}
